#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# vim: set sw=4 ts=4 expandtab :

import argparse
import json
import base64
import requests

from filelock import FileLock
import dbproxy
from error import ArgError

import amo

class Collector:
    def __init__(self, node, db=None, force=False):
        if node == None:
            raise ArgError('no node is given.')
        self.node = node

        if db == None:
            db = dbproxy.connect_db()
        self.db = db
        cur = self.db.cursor()

        self.refresh_remote()

        self.lock = FileLock(f'collector-{self.chain_id}')
        try:
            self.lock.acquire()
        except Exception:
            if force:
                self.lock.force_acquire()
            else:
                print('lock file exists. exiting.')
                exit(-1)

        # get current explorer state
        cur.execute("""SELECT `height` FROM `c_blocks` 
            WHERE (`chain_id` = %(chain_id)s)
            ORDER BY `height` DESC LIMIT 1""",
            self._vars())
        row = cur.fetchone()
        if row:
            b = dict(zip(cur.column_names, row))
            self.height = int(b['height'])
        else:
            self.height = 0
        cur.close()

    def _vars(self):
        v = vars(self).copy()
        if 'db' in v: del v['db']
        if 'lock' in v: del v['lock']
        return v

    def stat(self):
        print(f'[collector] chain: {self.chain_id}, local {self.height}, remote {self.remote_height}', flush=True)

    def clear(self):
        print('REBUILD block db')
        cur = self.db.cursor()
        cur.execute("""DELETE FROM `c_genesis`
            WHERE (`chain_id` = %(chain_id)s)
            """, self._vars())
        cur.execute("""OPTIMIZE TABLE `c_genesis`""")
        cur.fetchall()
        cur.execute("""DELETE FROM `c_txs`
            WHERE (`chain_id` = %(chain_id)s)
            """, self._vars())
        cur.execute("""OPTIMIZE TABLE `c_txs`""")
        cur.fetchall()
        cur.execute("""DELETE FROM `c_blocks`
            WHERE (`chain_id` = %(chain_id)s)
            """, self._vars())
        cur.execute("""OPTIMIZE TABLE `c_blocks`""")
        cur.fetchall()
        self.height = 0
        self.db.commit()
        cur.close()

    def refresh_remote(self):
        # get node status
        try:
            r = requests.get(f'{self.node}/status')
        except:
            print('unable to get node status')
            exit(-1)
        dat = json.loads(r.text)
        self.remote_height = int(dat['result']['sync_info']['latest_block_height'])
        self.chain_id = dat['result']['node_info']['network']


    def ensure_genesis(self, s):
        cur = self.db.cursor()
        # check genesis
        cur.execute("""
            SELECT COUNT(*) FROM `c_genesis` WHERE (`chain_id` = %(chain_id)s)
            """,
            self._vars())
        row = cur.fetchone()
        if row[0] == 0:
            r = s.get(f'{self.node}/genesis')
            dat = json.loads(r.text)
            self.genesis = json.dumps(dat['result']['genesis'])
            cur.execute("""
                INSERT INTO `c_genesis`
                    (`chain_id`, `genesis`)
                VALUES
                    (%(chain_id)s, %(genesis)s)
                """,
                self._vars())
            self.db.commit()
        cur.close()

    def play(self, limit, verbose):
        cur = self.db.cursor()
        s = requests.Session()

        self.ensure_genesis(s)

        # figure out
        if limit > 0:
            limit = min(self.remote_height - self.height, limit)
        else:
            limit = self.remote_height - self.height

        batch_base = self.height
        acc = 0
        while limit > 0:
            # 20 blocks is a tendermint limitation
            batch = min(20, limit)
            blocks = self.collect_block_metas(s, batch_base + 1, batch)
            if len(blocks) == 0:
                print('No more blocks')
                break
            self.db.autocommit = False
            for block in blocks:
                h = block.height
                if verbose:
                    if h % 50 == 0:
                        print('.', flush=True)
                    else:
                        print('.', end='', flush=True)
                if h % 1000 == 0:
                    print(f'block height {h}', flush=True)

                block.save(cur) # for FK contraint
                if block.num_txs > 0:
                    block = self.collect_block(s, h)

                    num = 0
                    num_valid = 0
                    num_invalid = 0
                    for i in range(len(block.txs) if block.txs else 0):
                        tx_body = block.txs[i]
                        tx_result = block.txs_results[i]
                        tx = amo.Tx(block.chain_id, block.height, i)
                        tx.parse_body(tx_body)
                        tx.set_result(tx_result)
                        if tx_result['code'] == 0:
                            num_valid += 1
                        else:
                            num_invalid += 1
                        num += 1
                        tx.save(cur)

                    if num_valid > 0 or num_invalid > 0:
                        block.num_txs = num
                        block.num_txs_valid = num_valid
                        block.num_txs_invalid = num_invalid
                        block.update_num_txs(cur)
            limit -= len(blocks)
            acc += len(blocks)
            batch_base += len(blocks)
            self.height += len(blocks)
            self.db.commit()

        # closing
        if verbose:
            print()
        print(f'{acc} blocks collected')
        cur.close()

    def collect_block(self, s, height):
        r = s.get(f'{self.node}/block?height={height}')
        dat = json.loads(r.text)['result']
        block = amo.Block(dat['block']['header']['chain_id'],
                dat['block']['header']['height'])
        block.read(dat)

        r = s.get(f'{self.node}/block_results?height={height}')
        dat = json.loads(r.text)['result']
        block.read_results(dat)

        q = f'"{height}"'.encode('latin1').hex()
        r = s.get(f'{self.node}/abci_query?path="/inc_block"&data=0x{q}')
        b = json.loads(r.text)['result']['response']['value']
        if b == None:
            incs = json.dumps([])
        else:
            incs = base64.b64decode(b)
        block.incentives = incs

        return block

    def collect_block_metas(self, s, start, num):
        # NOTE: max 20 items
        r = s.get(f'{self.node}/blockchain?minHeight={start}&maxHeight={start+num-1}')
        metas = json.loads(r.text)['result']['block_metas']
        list.sort(metas, key=lambda val: int(val['header']['height']))
        blocks = []
        for meta in metas:
            block = amo.Block(meta['header']['chain_id'],
                    meta['header']['height'])
            block.read_meta(meta)
            blocks.append(block)
        return blocks

    def close(self):
        self.db.close()
        self.lock.release()

if __name__ == '__main__':
    # command line args
    p = argparse.ArgumentParser('AMO blockchain explorer block collector')
    p.add_argument("-n", "--node", help="rpc node address to connect",
                   type=str)
    p.add_argument("-l", "--limit", help="limit number of blocks to collect",
                   type=int, default=100)
    p.add_argument("-r", "--rebuild", help="rebuild",
                   default=False, dest='rebuild', action='store_true')
    p.add_argument("-v", "--verbose", help="verbose output",
                   default=False, dest='verbose', action='store_true')
    p.add_argument("-f", "--force", help="force-run even if there is a lock",
                   default=False, dest='force', action='store_true')
    args = p.parse_args()

    try:
        collector = Collector(node = args.node, force=args.force)
    except ArgError as e:
        print(e.message)
        exit(-1)

    if args.rebuild:
        collector.clear()

    collector.stat()
    collector.play(args.limit, args.verbose)
    if args.limit == 0:
        collector.refresh_remote()
        while collector.remote_height - collector.height > 0:
            collector.stat()
            collector.play(0, args.verbose)
    collector.stat()

    collector.close()


