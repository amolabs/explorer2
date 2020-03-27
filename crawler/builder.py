# -*- coding: utf-8 -*-
# vim: set sw=4 ts=4 expandtab :

import json

import amo
import state

class Builder:
    def __init__(self, chain_id, cursor):
        self.chain_id = chain_id
        self.height = 0
        cursor.execute("""
            SELECT * FROM `play_stat` WHERE (`chain_id` = %(chain_id)s)
            """,
            vars(self))
        row = cursor.fetchone()
        if row:
            d = dict(zip(cursor.column_names, row))
            self.height = d['height']
        else:
            cursor.execute("""
                INSERT INTO `play_stat` (`chain_id`, `height`)
                VALUES (%(chain_id)s, %(height)s)
                """,
                vars(self))
        cursor.execute("""
            SELECT * FROM `block_stat` WHERE (`chain_id` = %(chain_id)s)
            """,
            vars(self))
        row = cursor.fetchone()
        if row:
            d = dict(zip(cursor.column_names, row))
            self.roof = d['num_blocks']
        else:
            self.roof = 0

    def stat(self):
        print('state db stat', vars(self))

    def clear(self, cursor):
        print('REBUILD')
        cursor.execute("""DELETE FROM `accounts`""")
        cursor.execute("""OPTIMIZE TABLE `accounts`""")
        cursor.fetchall()
        self.height = 0
        self._save_height(cursor)

    def play(self, cursor, num):
        if self.height == 0:
            if self.play_genesis(cursor) == False:
                return False
        if num == 0:
            num = self.roof - self.height
        for i in range(num):
            if self.step_block(cursor) == True:
                continue

    def play_genesis(self, cursor):
        cursor.execute("""
            SELECT `genesis` FROM `genesis`
            WHERE (`chain_id` = %(chain_id)s)
            """,
            vars(self))
        row = cursor.fetchone()
        if row:
            genesis = json.loads(row[0])['app_state']
            for item in genesis['balances']:
                acc = state.Account(self.chain_id, item['owner'], cursor)
                acc.balance = item['amount']
                acc.save(cursor)
        else:
            return False # TODO: return error

    def step_block(self, cursor):
        if self.height + 1 > self.roof:
            return False
        cursor.execute("""
            SELECT * FROM `txs`
            WHERE (`chain_id` = %(chain_id)s AND `height` = %(height)s + 1)
            """,
            vars(self))
        rows = cursor.fetchall()
        cols = cursor.column_names
        for row in rows:
            d = dict(zip(cols, row))
            tx = amo.Tx(self.chain_id, d['height'], d['index'])
            tx.read(d)
            tx.play(cursor)

        self.height += 1
        self._save_height(cursor)
        return True

    def _save_height(self, cursor):
        cursor.execute("""
            UPDATE `play_stat` SET `height` = %(height)s
            WHERE `chain_id` = %(chain_id)s
            """,
            vars(self))

