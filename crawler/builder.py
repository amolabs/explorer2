#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# vim: set sw=4 ts=4 expandtab :

import argparse
import json
import base64
from hashlib import sha256

from filelock import FileLock
import dbproxy
from error import ArgError

import amo
import stats
import models

class Builder:
    def __init__(self, chain_id, db=None, force=False):
        if chain_id == None:
            raise ArgError('no chain_id is given.')
        self.chain_id = chain_id

        if db == None:
            db = dbproxy.connect_db()
        self.db = db
        self.cursor = self.db.cursor()

        self.refresh_roof()

        self.lock = FileLock(f'builder-{self.chain_id}')
        try:
            self.lock.acquire()
        except Exception:
            if force:
                self.lock.force_acquire()
            else:
                print('lock file exists. exiting.')
                exit(-1)

        cur = self.cursor
        # get current explorer state
        cur.execute("""
            SELECT * FROM `play_stat` WHERE (`chain_id` = %(chain_id)s)
            """,
            self._vars())
        row = cur.fetchone()
        if row:
            d = dict(zip(cur.column_names, row))
            self.height = d['height']
        else:
            self.height = 0
            cur.execute("""
                INSERT INTO `play_stat` (`chain_id`, `height`)
                VALUES (%(chain_id)s, %(height)s)
                """,
                self._vars())
            self.db.commit()

    def _vars(self):
        v = vars(self).copy()
        if 'db' in v: del v['db']
        if 'cursor' in v: del v['cursor']
        if 'lock' in v: del v['lock']
        return v

    def stat(self):
        print(f'[builder] chain: {self.chain_id}, local {self.height}, remote {self.roof}', flush=True)

    def clear(self):
        print('REBUILD state db')
        cur = self.db.cursor()

        cur.execute("""DELETE FROM `s_requests`
            WHERE (`chain_id` = %(chain_id)s)
            """, self._vars())
        cur.execute("""OPTIMIZE TABLE `s_requests`""")
        cur.fetchall()

        cur.execute("""DELETE FROM `s_usages`
            WHERE (`chain_id` = %(chain_id)s)
            """, self._vars())
        cur.execute("""OPTIMIZE TABLE `s_usages`""")
        cur.fetchall()

        cur.execute("""DELETE FROM `s_parcels`
            WHERE (`chain_id` = %(chain_id)s)
            """, self._vars())
        cur.execute("""OPTIMIZE TABLE `s_parcels`""")
        cur.fetchall()

        cur.execute("""DELETE FROM `s_storages`
            WHERE (`chain_id` = %(chain_id)s)
            """, self._vars())
        cur.execute("""OPTIMIZE TABLE `s_storages`""")
        cur.fetchall()

        cur.execute("""DELETE FROM `s_votes`
            WHERE (`chain_id` = %(chain_id)s)
            """, self._vars())
        cur.execute("""OPTIMIZE TABLE `s_votes`""")
        cur.fetchall()

        cur.execute("""DELETE FROM `s_drafts`
            WHERE (`chain_id` = %(chain_id)s)
            """, self._vars())
        cur.execute("""OPTIMIZE TABLE `s_drafts`""")
        cur.fetchall()

        cur.execute("""DELETE FROM `s_accounts`
            WHERE (`chain_id` = %(chain_id)s)
            """, self._vars())
        cur.execute("""OPTIMIZE TABLE `s_accounts`""")
        cur.fetchall()

        cur.execute("""DELETE FROM `asset_stat`
            WHERE (`chain_id` = %(chain_id)s)
            """, self._vars())
        cur.execute("""OPTIMIZE TABLE `asset_stat`""")
        cur.fetchall()

        self.height = 0
        self._save_height(cur)
        self.db.commit()
        cur.close()

    def refresh_roof(self):
        cur = self.cursor
        # get current explorer collector state
        cur.execute("""
            SELECT `height` FROM `explorer`.`c_blocks` cb
            WHERE cb.`chain_id` = %(chain_id)s
            ORDER BY cb.`height` DESC LIMIT 1
            """,
            self._vars())
        row = cur.fetchone()
        if row:
            d = dict(zip(cur.column_names, row))
            self.roof = d['height']
        else:
            self.roof = 0

    def play(self, limit, verbose):
        if self.height == 0:
            if self.play_genesis() == False:
                return False
        if limit == 0:
            limit = self.roof - self.height
        for i in range(limit):
            if self.play_block() == True:
                continue

    def play_genesis(self):
        cur = self.db.cursor()
        cur.execute("""
            SELECT `genesis` FROM `c_genesis`
            WHERE (`chain_id` = %(chain_id)s)
            """,
            self._vars())
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
            return False # TODO: return error

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
        self.play_block_val_updates(cur)

        # close
        self.height += 1
        self._save_height(cur)
        self.db.commit()
        cur.close()

        # progress report
        if self.height % 1000 == 0:
            print(f'block height {self.height}', flush=True)

        return True

    def play_block_txs(self, cursor):
        # txs
        cursor.execute("""
            SELECT * FROM `c_txs`
            WHERE (`chain_id` = %(chain_id)s AND `height` = %(height)s + 1)
            """,
            self._vars())
        rows = cursor.fetchall()
        cols = cursor.column_names
        for row in rows:
            d = dict(zip(cols, row))
            tx = amo.Tx(self.chain_id, d['height'], d['index'])
            tx.read(d)
            tx.play(cursor)

    def play_block_incentives(self, cursor):
        # block incentives
        cursor.execute("""
            SELECT `incentives` FROM `c_blocks`
            WHERE (`chain_id` = %(chain_id)s AND `height` = %(height)s + 1)
            """,
            self._vars())
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

    def play_block_val_updates(self, cursor):
        # validator updates
        cursor.execute("""
            SELECT `validator_updates` FROM `c_blocks`
            WHERE (`chain_id` = %(chain_id)s AND `height` = %(height)s + 1)
            """,
            self._vars())
        row = cursor.fetchone()
        #asset_stat = stats.Asset(self.chain_id, cursor)
        if row:
            vals = json.loads(row[0])
            for val in vals:
                b = base64.b64decode(val['pub_key']['data'])
                val_addr = sha256(b).hexdigest()[:40].upper()
                if val['power'] == '0':
                    delete_val(self.chain_id, val_addr, cursor)
                else:
                    update_val(self.chain_id, val_addr, val['power'], cursor)

    def _save_height(self, cursor):
        cursor.execute("""
            UPDATE `play_stat` SET `height` = %(height)s
            WHERE `chain_id` = %(chain_id)s
            """,
            self._vars())

    def close(self):
        self.db.close()
        self.lock.release()

def delete_val(chain_id, addr, cur):
    cur.execute("""
        UPDATE `s_accounts`
        SET
            `val_addr` = NULL,
            `val_pubkey` = NULL,
            `val_power` = '0'
        WHERE (`chain_id` = %(chain_id)s AND `val_addr` = %(val_addr)s)
        """,
        {'chain_id': chain_id, 'val_addr': addr})

def update_val(chain_id, addr, power, cur):
    cur.execute("""
        UPDATE `s_accounts`
        SET
            `val_power` = %(val_power)s
        WHERE (`chain_id` = %(chain_id)s AND `val_addr` = %(val_addr)s)
        """,
        {'chain_id': chain_id, 'val_addr': addr, 'val_power': str(power)})

if __name__ == "__main__":
    # command line args
    p = argparse.ArgumentParser('AMO blockchain explorer DB builder')
    p.add_argument("-c", "--chain", help="chain id to build state db",
                   type=str)
    p.add_argument("-l", "--limit", help="limit number of blocks to play",
                   type=int, default=100)
    p.add_argument("-r", "--rebuild", help="rebuild",
                   default=False, dest='rebuild', action='store_true')
    p.add_argument("-v", "--verbose", help="verbose output",
                   default=False, dest='verbose', action='store_true')
    p.add_argument("-f", "--force", help="force-run even if there is a lock",
                   default=False, dest='force', action='store_true')
    args = p.parse_args()

    try:
        builder = Builder(args.chain, force=args.force)
    except ArgError as e:
        print(e.message)
        exit(-1)

    if args.rebuild:
        builder.clear()

    builder.stat()
    builder.play(args.limit, args.verbose)
    if args.limit == 0:
        builder.refresh_roof()
        while builder.roof - builder.height > 0:
            builder.stat()
            builder.play(0, args.verbose)
    builder.stat()

    builder.close()

