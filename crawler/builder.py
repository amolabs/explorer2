#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# vim: set sw=4 ts=4 expandtab :
"""
state db builder
"""

# standard imports
import argparse
import json
import base64
from hashlib import sha256
import time
import signal  # for main
import traceback  # for main
import sys  # for main

from error import ArgError  # for main
from filelock import FileLock, Timeout

import dbproxy
import tx
import stats
import models


class Builder:
    def __init__(self, chain_id, db=None):
        if chain_id is None:
            raise ArgError('no chain_id is given.')
        self.chain_id = chain_id

        if db is None:
            db = dbproxy.connect_db()
        self.db = db
        self.cursor = self.db.cursor()

        self.refresh_roof()

        lock = FileLock(f'/var/tmp/builder-{self.chain_id}.lock')
        try:
            lock.acquire(timeout=1)
        except Timeout:
            self.print_log('another instance is running. exiting.')
            sys.exit(-1)
        else:
            self.lock = lock

        cur = self.cursor
        # get current explorer state
        cur.execute(
            """
            SELECT * FROM `play_stat` WHERE (`chain_id` = %(chain_id)s)
            """, self._vars())
        row = cur.fetchone()
        if row:
            d = dict(zip(cur.column_names, row))
            self.height = d['height']
        else:
            self.height = 0
            cur.execute(
                """
                INSERT INTO `play_stat` (`chain_id`, `height`)
                VALUES (%(chain_id)s, %(height)s)
                """, self._vars())
            self.db.commit()

    def _vars(self):
        v = vars(self).copy()
        if 'db' in v:
            del v['db']
        if 'cursor' in v:
            del v['cursor']
        if 'lock' in v:
            del v['lock']
        return v

    def print_log(self, msg):
        print(f'[builder] [{self.chain_id}] {msg}', flush=True)

    def print_stat(self):
        self.print_log(f'local {self.height}, remote {self.roof}')

    def clear(self):
        self.print_log('REBUILD state db')
        cur = self.db.cursor()

        for t in dbproxy.s_tables:
            cur.execute(
                f"DELETE FROM `{t}` WHERE `chain_id` = '{self.chain_id}'")
            cur.execute("""OPTIMIZE TABLE `{t}`""")
            cur.fetchall()

        self.height = 0
        self._save_height(cur)
        self.db.commit()
        cur.close()

    def refresh_roof(self):
        self.db.commit()  # to get updated blocks
        cur = self.cursor
        # get current explorer collector state
        cur.execute(
            """
            SELECT `height` FROM `c_blocks` cb
            WHERE cb.`chain_id` = %(chain_id)s
            ORDER BY cb.`height` DESC LIMIT 1
            """, self._vars())
        row = cur.fetchone()
        if row:
            d = dict(zip(cur.column_names, row))
            self.roof = d['height']
        else:
            self.roof = 0

    def play(self, limit, verbose):
        if self.height == 0:
            if self.play_genesis() is False:
                return False
        if limit == 0:
            limit = self.roof - self.height
        acc = 0
        self.db.autocommit = False
        for i in range(limit):
            if self.play_block() is True:
                acc += 1
                h = self.height
                if verbose:
                    if h % 50 == 0:
                        print('.', flush=True)
                    else:
                        print('.', end='', flush=True)
                if h % 1000 == 0:
                    self.print_log(f'block height {h}')
            if i > 0 and i % 50 == 0:
                self.db.commit()
        self.db.commit()
        if verbose:
            print(flush=True)
        self.print_log(f'{acc} blocks played')

    def play_genesis(self):
        cur = self.db.cursor()
        cur.execute(
            """
            SELECT `genesis` FROM `c_genesis`
            WHERE (`chain_id` = %(chain_id)s)
            """, self._vars())
        row = cur.fetchone()
        asset_stat = stats.Asset(self.chain_id, cur)
        if row:
            genesis = json.loads(row[0])['app_state']
            for item in genesis['balances']:
                acc = models.Account(self.chain_id, item['owner'], cur)
                acc.balance = int(item['amount'])
                asset_stat.active_coins += int(item['amount'])
                acc.save(cur)
        else:
            return False  # TODO: return error

        # stat
        asset_stat.save(cur)

        self.db.commit()
        cur.close()

    def play_block(self):
        cur = self.db.cursor()
        if self.height + 1 > self.roof:
            return False

        self.play_block_txs(cur)
        self.play_block_incentives(cur)
        self.play_block_penalties(cur)
        self.play_block_val_updates(cur)

        # close
        self.height += 1
        self._save_height(cur)
        cur.close()

        return True

    def play_block_txs(self, cursor):
        # txs
        cursor.execute(
            """
            SELECT * FROM `c_txs`
            WHERE (`chain_id` = %(chain_id)s AND `height` = %(height)s + 1)
            """, self._vars())
        rows = cursor.fetchall()
        cols = cursor.column_names
        for row in rows:
            d = dict(zip(cols, row))
            t = tx.Tx(self.chain_id, d['height'], d['index'])
            t.read(d)
            t.play(cursor)

    def play_block_incentives(self, cursor):
        # block incentives
        cursor.execute(
            """
            SELECT `incentives` FROM `c_blocks`
            WHERE (`chain_id` = %(chain_id)s AND `height` = %(height)s + 1)
            """, self._vars())
        row = cursor.fetchone()
        asset_stat = stats.Asset(self.chain_id, cursor)
        if row:
            incentives = json.loads(row[0])
            for inc in incentives:
                recp = models.Account(self.chain_id, inc['address'], cursor)
                recp.balance += int(inc['amount'])
                asset_stat.active_coins += int(inc['amount'])
                recp.save(cursor)
        asset_stat.save(cursor)

    def play_block_penalties(self, cursor):
        # block incentives
        cursor.execute(
            """
            SELECT `penalties` FROM `c_blocks`
            WHERE (`chain_id` = %(chain_id)s AND `height` = %(height)s + 1)
            """, self._vars())
        row = cursor.fetchone()
        if row:
            asset_stat = stats.Asset(self.chain_id, cursor)
            penalties = json.loads(row[0])
            for pen in penalties:
                recp = models.Account(self.chain_id, pen['address'], cursor)
                if recp.stake > 0:  # staker
                    recp.stake -= int(pen['amount'])
                    recp.eff_stake -= int(pen['amount'])
                    asset_stat.stakes -= int(pen['amount'])
                    recp.save(cursor)
                elif recp.delegate > 0:  # delegator
                    recp.delegate -= int(pen['amount'])
                    staker = models.Account(self.chain_id, recp.del_addr,
                                            cursor)
                    staker.eff_stake -= int(pen['amount'])
                    asset_stat.delegates -= int(pen['amount'])
                    recp.save(cursor)
                    staker.save(cursor)
            asset_stat.save(cursor)

    def play_block_val_updates(self, cursor):
        # validator updates
        cursor.execute(
            """
            SELECT `validator_updates` FROM `c_blocks`
            WHERE (`chain_id` = %(chain_id)s AND `height` = %(height)s + 1)
            """, self._vars())
        row = cursor.fetchone()
        if row:
            vals = json.loads(row[0])
            for val in vals:
                b = base64.b64decode(val['pub_key']['data'])
                val_addr = sha256(b).hexdigest()[:40].upper()
                if 'power' not in val or val['power'] == '0':
                    delete_val(self.chain_id, val_addr, cursor)
                else:
                    update_val(self.chain_id, val_addr, val['power'], cursor)

    def _save_height(self, cursor):
        cursor.execute(
            """
            UPDATE `play_stat` SET `height` = %(height)s
            WHERE `chain_id` = %(chain_id)s
            """, self._vars())

    def close(self):
        self.db.close()
        self.lock.release()

    def watch(self):
        self.print_log(f'Waiting for new block from db')
        while True:
            time.sleep(2)
            self.refresh_roof()
            if self.roof - self.height > 0:
                self.play(0, args.verbose)
                self.print_stat()


def delete_val(chain_id, addr, cur):
    cur.execute(
        """
        UPDATE `s_accounts`
        SET
            `val_addr` = NULL,
            `val_pubkey` = NULL,
            `val_power` = '0'
        WHERE (`chain_id` = %(chain_id)s AND `val_addr` = %(val_addr)s)
        """, {
            'chain_id': chain_id,
            'val_addr': addr
        })


def update_val(chain_id, addr, power, cur):
    cur.execute(
        """
        UPDATE `s_accounts`
        SET
            `val_power` = %(val_power)s
        WHERE (`chain_id` = %(chain_id)s AND `val_addr` = %(val_addr)s)
        """, {
            'chain_id': chain_id,
            'val_addr': addr,
            'val_power': str(power)
        })


def handle(sig, stack_frame):
    raise KeyboardInterrupt


if __name__ == "__main__":
    # command line args
    p = argparse.ArgumentParser('AMO blockchain explorer DB builder')
    p.add_argument("-c",
                   "--chain",
                   help="chain id to build state db",
                   type=str)
    p.add_argument("-l",
                   "--limit",
                   help="limit number of blocks to play",
                   type=int,
                   default=100)
    p.add_argument("-r",
                   "--rebuild",
                   help="rebuild",
                   default=False,
                   dest='rebuild',
                   action='store_true')
    p.add_argument("-v",
                   "--verbose",
                   help="verbose output",
                   default=False,
                   dest='verbose',
                   action='store_true')
    args = p.parse_args()

    try:
        builder = Builder(args.chain)
    except ArgError as err:
        print(err)
        sys.exit(-1)

    if args.rebuild:
        builder.clear()

    try:
        signal.signal(signal.SIGTERM, handle)
        builder.print_stat()
        builder.play(args.limit, args.verbose)
        builder.print_stat()
        if args.limit == 0:
            builder.refresh_roof()
            while builder.roof - builder.height > 0:
                builder.play(0, args.verbose)
                builder.print_stat()
                builder.refresh_roof()
            builder.print_log('No more blocks.')
            builder.watch()
    except KeyboardInterrupt:
        builder.print_log('interrupted. closing builder')
        builder.close()
    except Exception:
        traceback.print_exc()
        builder.close()
        sys.exit(-1)
    else:
        builder.print_log('closing builder')
        builder.close()
