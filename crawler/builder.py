# -*- coding: utf-8 -*-
# vim: set sw=4 ts=4 expandtab :

import json
import base64
from hashlib import sha256

import amo
import state
import stats

class Builder:
    def __init__(self, chain_id, db):
        self.chain_id = chain_id
        self.db = db

        self.height = 0
        cur = self.db.cursor()
        cur.execute("""
            SELECT * FROM `play_stat` WHERE (`chain_id` = %(chain_id)s)
            """,
            self._vars())
        row = cur.fetchone()
        if row:
            d = dict(zip(cur.column_names, row))
            self.height = d['height']
        else:
            cur.execute("""
                INSERT INTO `play_stat` (`chain_id`, `height`)
                VALUES (%(chain_id)s, %(height)s)
                """,
                self._vars())
        cur.execute("""
            SELECT * FROM `block_stat` WHERE (`chain_id` = %(chain_id)s)
            """,
            self._vars())
        row = cur.fetchone()
        if row:
            d = dict(zip(cur.column_names, row))
            self.roof = d['num_blocks']
        else:
            self.roof = 0
        self.db.commit()
        cur.close()

    def _vars(self):
        v = vars(self).copy()
        del v['db']
        return v

    def stat(self):
        print(f'[builder] chain: {self.chain_id}, local {self.height} => remote {self.roof}')

    def clear(self):
        print('REBUILD')
        cur = self.db.cursor()
        cur.execute("""DELETE FROM `s_requests`
            WHERE (`chain_id` = %(chain_id)s)
            """, self._vars())
        cur.execute("""OPTIMIZE TABLE `s_requests`""")
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

    def play(self, num):
        if self.height == 0:
            if self.play_genesis() == False:
                return False
        if num == 0:
            num = self.roof - self.height
        for i in range(num):
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
                acc = state.Account(self.chain_id, item['owner'], cur)
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

        # txs
        cur.execute("""
            SELECT * FROM `c_txs`
            WHERE (`chain_id` = %(chain_id)s AND `height` = %(height)s + 1)
            """,
            self._vars())
        rows = cur.fetchall()
        cols = cur.column_names
        for row in rows:
            d = dict(zip(cols, row))
            tx = amo.Tx(self.chain_id, d['height'], d['index'])
            tx.read(d)
            tx.play(cur)

        # block incentives
        cur.execute("""
            SELECT `incentives` FROM `c_blocks`
            WHERE (`chain_id` = %(chain_id)s AND `height` = %(height)s + 1)
            """,
            self._vars())
        row = cur.fetchone()
        asset_stat = stats.Asset(self.chain_id, cur)
        if row:
            incentives = json.loads(row[0])
            for inc in incentives:
                recp = state.Account(self.chain_id, inc['address'], cur)
                recp.balance += int(inc['amount'])
                asset_stat.active_coins += int(inc['amount'])
                recp.save(cur)

        # validator updates
        cur.execute("""
            SELECT `validator_updates` FROM `c_blocks`
            WHERE (`chain_id` = %(chain_id)s AND `height` = %(height)s + 1)
            """,
            self._vars())
        row = cur.fetchone()
        #asset_stat = stats.Asset(self.chain_id, cur)
        if row:
            vals = json.loads(row[0])
            for val in vals:
                b = base64.b64decode(val['pub_key']['data'])
                val_addr = sha256(b).hexdigest()[:40].upper()
                if val['power'] == '0':
                    delete_val(self.chain_id, val_addr, cur)
                else:
                    update_val(self.chain_id, val_addr, val['power'], cur)

        # close
        self.height += 1
        self._save_height(cur)
        asset_stat.save(cur)
        self.db.commit()
        cur.close()
        return True

    def _save_height(self, cursor):
        cursor.execute("""
            UPDATE `play_stat` SET `height` = %(height)s
            WHERE `chain_id` = %(chain_id)s
            """,
            self._vars())

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

