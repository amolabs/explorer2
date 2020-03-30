# -*- coding: utf-8 -*-
# vim: set sw=4 ts=4 expandtab :

import json
import base64
from hashlib import sha256

class Account:
    def __init__(self, chain_id, address, cursor):
        self.chain_id = chain_id
        self.address = address
        self.balance = 0
        self.stake = 0
        self.val_addr = None
        self.delegate = 0
        self.del_addr = None
        cursor.execute("""
            SELECT * FROM `s_accounts`
            WHERE (`chain_id` = %(chain_id)s AND `address` = %(address)s)
            """,
            vars(self))
        row = cursor.fetchone()
        if row:
            d = dict(zip(cursor.column_names, row))
            self.balance = int(d['balance'])
            self.stake = int(d['stake'])
            self.val_addr = d['val_addr']
            self.delegate = int(d['delegate'])
            self.del_addr = d['del_addr']
        else:
            cursor.execute("""
                INSERT INTO `s_accounts` (`chain_id`, `address`)
                VALUES (%(chain_id)s, %(address)s)
                """,
                vars(self))

    def save(self, cursor):
        #print(vars(self))
        values = vars(self)
        values['balance'] = str(values['balance'])
        values['stake'] = str(values['stake'])
        values['delegate'] = str(values['delegate'])
        cursor.execute("""
            UPDATE `s_accounts`
            SET
                `balance` = %(balance)s,
                `stake` = %(stake)s,
                `val_addr` = %(val_addr)s,
                `delegate` = %(delegate)s,
                `del_addr` = %(del_addr)s
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

def stake(tx, cursor):
    print(f'tx type ({tx.type})')
    payload = json.loads(tx.payload)
    payload['amount'] = int(payload['amount'])
    sender = Account(tx.chain_id, tx.sender, cursor)

    sender.stake += payload['amount']
    sender.balance -= payload['amount']
    val_pubkey = base64.b64decode(payload['validator'])
    sender.val_addr = sha256(val_pubkey).hexdigest()[:40].upper()

    sender.save(cursor)

processor = {
        'transfer': transfer,
        'stake': stake,
        }
