# -*- coding: utf-8 -*-
# vim: set sw=4 ts=4 expandtab :

import json
import base64
import requests

import amo

class Collector:
    def __init__(self, node, db):
        self.node = node
        self.db = db

        cur = self.db.cursor()
        # get node status
        r = requests.get(f'{self.node}/status')
        dat = json.loads(r.text)
        self.remote_height = int(dat['result']['sync_info']['latest_block_height'])
        self.chain_id = dat['result']['node_info']['network']

        # get current explorer state
        cur.execute("""SELECT `height` FROM `c_blocks` 
            WHERE (`chain_id` = %(chain_id)s)
            ORDER BY `height` DESC LIMIT 1""",
            self._vars())
        row = cur.fetchone()
        if row:
            #print(row)
            b = dict(zip(cur.column_names, row))
            self.height = int(b['height'])
        else:
            self.height = 0

        cur.close()

    def _vars(self):
        v = vars(self).copy()
        del v['db']
        return v

    def stat(self):
        print(f'[collector] node: {self.node}, local {self.height} => remote {self.remote_height}')

    def clear(self):
        print('REBUILD')
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

    def play(self, limit):
        cur = self.db.cursor()
        s = requests.Session()

        self.ensure_genesis(s)

        # figure out
        if limit > 0:
            run = min(self.remote_height - self.height, limit)
        else:
            run = self.remote_height - self.height

        batch_base = self.height
        for h in range(self.height + 1, self.height + run + 1):
            # batch start
            self.db.autocommit = False

            ### NOTE: the following strategy is effective when tx density is high.
            if h % 50 == 0:
                print('.', flush=True)
            else:
                print('.', end='', flush=True)
            if h % 100 == 0:
                print(f'block height {h}', flush=True)
            block_id, block_raw, txs_results, incs = collect_block(s, self.node, h)
            block_header = block_raw['header']
            tx_bodies = block_raw['data']['txs']
            block = amo.Block(block_header['chain_id'], block_header['height'])
            block.set_meta(block_id, block_header)
            block.incentives = incs
            block.save(cur)
            num = 0
            num_valid = 0
            num_invalid = 0
            for i in range(len(tx_bodies) if tx_bodies else 0):
                body = tx_bodies[i]
                result = txs_results[i]
                tx = amo.Tx(block.chain_id, block.height, i)
                tx.parse_body(body)
                tx.set_result(result)
                if result['code'] == 0:
                    num_valid += 1
                else:
                    num_invalid += 1
                num += 1
                tx.save(cur)

            if num_valid > 0 or num_invalid > 0:
                block.num_txs = num
                block.num_txs_valid = num_valid
                block.num_txs_invalid = num_invalid
                block.update(cur)

            ### NOTE: the following strategy is effective when tx density is low.

            # XXX: This limit is due to the limit of tendermint rpc.
            #batch_run = min(run,20)
            # collect raw data
            #metas = collect_block_headers(node, batch_base, batch_run)
            #for meta in metas:
            #    block = amo.format_block(meta)
            #    save_block(block)
            #    if int(block['num_txs']) > 0:
            #        items = collect_block_txs(node, block['height'])
            #        for item in items:
            #            tx = amo.format_tx(item)
            #            save_tx(block['chain_id'], tx)
            # update stat
            # done

            #run -= len(metas)
            #batch_base += len(metas)

            self.db.commit()
            # batch end
        
        self.height += run
        print()
        # closing
        cur.close()

def collect_block(s, node, height):
    r = s.get(f'{node}/block?height={height}')
    dat = json.loads(r.text)['result']
    block_id = dat['block_id']
    block = dat['block']

    r = s.get(f'{node}/block_results?height={height}')
    txs_results = json.loads(r.text)['result']['txs_results']

    q = f'"{height}"'.encode('latin1').hex()
    r = s.get(f'{node}/abci_query?path="/inc_block"&data=0x{q}')
    b = json.loads(r.text)['result']['response']['value']
    if b == None:
        incs = json.dumps([])
    else:
        incs = base64.b64decode(b)

    return block_id, block, txs_results, incs

#def block_metas(node, base, num):
#    print(f'batch height from {base+1} to {base+num}')
#    r = requests.get(
#            f'{node}/blockchain?minHeight={base+1}&maxHeight={base+num}')
#    metas = json.loads(r.text)['result']['block_metas']
#    list.sort(metas, key=lambda val: int(val['header']['height']))
#    return metas

#def block_txs(node, height):
#    # collect txs
#    r = requests.get(f'{node}/tx_search?query="tx.height={height}"')
#    items = json.loads(r.text)['result']['txs']
#    print(f'- block height {height}: num_txs = {len(items)}')
#    return items

