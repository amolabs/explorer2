# -*- coding: utf-8 -*-
# vim: set sw=4 ts=4 expandtab :

import json

class Asset:
    def __init__(self, dbs, chain_id, cursor):
        self.dbs = dbs
        self.chain_id = chain_id
        self.active_coins = 0
        self.stakes = 0
        self.delegates = 0
        cursor.execute(f"""
            SELECT * FROM `{self.dbs['builder']}`.`asset_stat`
            WHERE (`chain_id` = %(chain_id)s)
            """,
            self._vars())
        row = cursor.fetchone()
        if row:
            d = dict(zip(cursor.column_names, row))
            self.active_coins = int(d['active_coins'])
            self.stakes = int(d['stakes'])
            self.delegates = int(d['delegates'])
        else:
            cursor.execute(f"""
                INSERT INTO `{self.dbs['builder']}`.`asset_stat` (`chain_id`)
                VALUES (%(chain_id)s)
                """,
                self._vars())

    def _vars(self):
        v = vars(self).copy()
        del v['dbs']
        v['active_coins'] = str(self.active_coins)
        v['stakes'] = str(self.stakes)
        v['delegates'] = str(self.delegates)
        return v

    def save(self, cursor):
        cursor.execute(f"""
            UPDATE `{self.dbs['builder']}`.`asset_stat`
            SET
                `active_coins` = %(active_coins)s,
                `stakes` = %(stakes)s,
                `delegates` = %(delegates)s
            WHERE (`chain_id` = %(chain_id)s)
            """, self._vars())
