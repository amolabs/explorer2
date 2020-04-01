# -*- coding: utf-8 -*-
# vim: set sw=4 ts=4 expandtab :

class Asset:
    def __init__(self, chain_id, cursor):
        self.chain_id = chain_id
        self.active_coins = 0
        self.stakes = 0
        self.delegates = 0
        cursor.execute("""
            SELECT * FROM `asset_stat`
            WHERE (`chain_id` = %(chain_id)s)
            """,
            vars(self))
        row = cursor.fetchone()
        if row:
            d = dict(zip(cursor.column_names, row))
            self.active_coins = int(d['active_coins'])
            self.stakes = int(d['stakes'])
            self.delegates = int(d['delegates'])
        else:
            cursor.execute("""
                INSERT INTO `asset_stat` (`chain_id`)
                VALUES (%(chain_id)s)
                """,
                vars(self))

    def save(self, cursor):
        #print(vars(self))
        values = vars(self)
        values['active_coins'] = str(values['active_coins'])
        values['stakes'] = str(values['stakes'])
        values['delegates'] = str(values['delegates'])
        cursor.execute("""
            UPDATE `asset_stat`
            SET
                `active_coins` = %(active_coins)s,
                `stakes` = %(stakes)s,
                `delegates` = %(delegates)s
            WHERE (`chain_id` = %(chain_id)s)
            """,
            values)
