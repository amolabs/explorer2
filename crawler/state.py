# -*- coding: utf-8 -*-
# vim: set sw=4 ts=4 expandtab :

import json

class Account:
    def __init__(self, chain_id, address, cursor):
        self.chain_id = chain_id
        self.address = address
        cursor.execute("""
            SELECT * FROM `accounts`
            WHERE (`chain_id` = %(chain_id)s AND `address` = %(address)s)
            """,
            vars(self))
        row = cursor.fetchone()
        if row:
            d = dict(zip(cursor.column_names, row))
            self.balance = int(d['balance'])
        else:
            self.balance = 0
            cursor.execute("""
                INSERT INTO `accounts` (`chain_id`, `address`)
                VALUES (%(chain_id)s, %(address)s)
                """,
                vars(self))

    def save(self, cursor):
        #print(vars(self))
        values = vars(self)
        values['balance'] = str(values['balance'])
        cursor.execute("""
            UPDATE `accounts`
            SET `balance` = %(balance)s
            WHERE (`chain_id` = %(chain_id)s AND `address` = %(address)s)
            """,
            values)


def unknown(tx, cursor):
    print(f'tx type ({tx.type}) unknown')

def transfer(tx, cursor):
    print(f'tx type ({tx.type})')
    payload = json.loads(tx.payload)
    payload['amount'] = int(payload['amount'])
    sender = Account(tx.chain_id, tx.sender, cursor)
    recp = Account(tx.chain_id, payload['to'], cursor)
    sender.balance -= payload['amount']
    recp.balance += payload['amount']
    sender.save(cursor)
    recp.save(cursor)

processor = {
        'transfer': transfer,
        }
