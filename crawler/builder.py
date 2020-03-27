# -*- coding: utf-8 -*-
# vim: set sw=4 ts=4 expandtab :

import amo

class Builder:
    def __init__(self, chain_id, cursor):
        self.chain_id = chain_id
        self.height = 0
        cursor.execute("""
            SELECT * FROM `play_stat` WHERE (`chain_id` = %(chain_id)s)
            """,
            ({'chain_id': self.chain_id}))
        row = cursor.fetchone()
        if row:
            s = dict(zip(cursor.column_names, row))
            self.height = s['height']
        else:
            cursor.execute("""
                INSERT INTO `play_stat` (`chain_id`, `height`)
                VALUES (%(chain_id)s, %(height)s)
                """,
                vars(self))

    def stat(self):
        print('state db stat', vars(self))

    def clear(self, cursor):
        print('REBUILD')
        self.height = 0
        self._save_height(cursor)

    def play(self, cursor, num):
        for i in range(num):
            self.step_block(cursor)

    def step_block(self, cursor):
        cursor.execute("""
            SELECT * FROM `txs`
            WHERE (`chain_id` = %(chain_id)s AND `height` = %(height)s + 1)
            """,
            vars(self))
        rows = cursor.fetchall()
        for row in rows:
            d = dict(zip(cursor.column_names, row))
            tx = amo.Tx(self.chain_id, d['height'], d['index'])
            tx.read(d)
            tx.play(cursor)

        self.height += 1
        self._save_height(cursor)

    def _save_height(self, cursor):
        cursor.execute("""
            UPDATE `play_stat` SET `height` = %(height)s
            WHERE `chain_id` = %(chain_id)s
            """,
            vars(self))

