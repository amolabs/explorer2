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

class Storage:
    def __init__(self, chain_id, storage_id, owner, cursor):
        self.chain_id = chain_id
        self.storage_id = storage_id
        self.owner = owner
        self.url = ''
        self.registration_fee = 0
        self.hosting_fee = 0
        self.active = False
        cursor.execute("""
            SELECT * FROM `s_storages`
            WHERE (`chain_id` = %(chain_id)s AND `storage_id` = %(storage_id)s)
            """,
            vars(self))
        row = cursor.fetchone()
        if row:
            d = dict(zip(cursor.column_names, row))
            self.owner = d['owner']
            self.url = d['url']
            self.registration_fee = int(d['registration_fee'])
            self.hosting_fee = int(d['hosting_fee'])
            self.active = d['active']
        else:
            cursor.execute("""
                INSERT INTO `s_storages`
                    (`chain_id`, `storage_id`, `owner`)
                VALUES (%(chain_id)s, %(storage_id)s, %(owner)s)
                """,
                vars(self))

    def save(self, cursor):
        values = vars(self)
        values['registration_fee'] = str(values['registration_fee'])
        values['hosting_fee'] = str(values['hosting_fee'])
        cursor.execute("""
            UPDATE `s_storages`
            SET
                `owner` = %(owner)s,
                `url` = %(url)s,
                `registration_fee` = %(registration_fee)s,
                `hosting_fee` = %(hosting_fee)s,
                `active` = %(active)s
            WHERE (`chain_id` = %(chain_id)s AND `storage_id` = %(storage_id)s)
            """,
            values)

class Parcel:
    def __init__(self, chain_id, parcel_id, owner, cursor):
        self.chain_id = chain_id
        self.parcel_id = parcel_id
        self.storage_id = int(parcel_id[:8], 16)
        self.owner = owner
        self.custody = ''
        self.proxy_account = None
        self.extra = '{}'
        self.on_sale = False
        cursor.execute("""
            SELECT * FROM `s_parcels`
            WHERE (`chain_id` = %(chain_id)s AND `parcel_id` = %(parcel_id)s)
            """,
            vars(self))
        row = cursor.fetchone()
        if row:
            d = dict(zip(cursor.column_names, row))
            self.owner = d['owner']
            self.custody = d['custody']
            self.proxy_account = d['proxy_account']
            self.extra = d['extra']
            self.on_sale = d['on_sale']
        else:
            cursor.execute("""
                INSERT INTO `s_parcels`
                    (`chain_id`, `parcel_id`, `storage_id`, `owner`)
                VALUES (%(chain_id)s, %(parcel_id)s, %(storage_id)s, %(owner)s)
                """,
                vars(self))

    def save(self, cursor):
        values = vars(self)
        cursor.execute("""
            UPDATE `s_parcels`
            SET
                `custody` = %(custody)s,
                `proxy_account` = %(proxy_account)s,
                `extra` = %(extra)s,
                `on_sale` = %(on_sale)s
            WHERE (`chain_id` = %(chain_id)s AND `storage_id` = %(storage_id)s)
            """,
            values)

class Request:
    def __init__(self, chain_id, parcel_id, buyer, cursor):
        self.chain_id = chain_id
        self.parcel_id = parcel_id
        self.buyer = buyer
        self.payment = 0
        self.dealer = None
        self.dealer_fee = 0
        self.extra = '{}'
        cursor.execute("""
            SELECT * FROM `s_requests`
            WHERE (`chain_id` = %(chain_id)s
                AND `parcel_id` = %(parcel_id)s
                AND `buyer` = %(buyer)s)
            """,
            vars(self))
        row = cursor.fetchone()
        if row:
            d = dict(zip(cursor.column_names, row))
            self.payment = int(d.get('payment'))
            self.dealer = d.get('dealer', None)
            self.dealer_fee = int(d.get('dealer_fee'))
            self.extra = d.get('extra', '{}')
        else:
            cursor.execute("""
                INSERT INTO `s_requests`
                    (`chain_id`, `parcel_id`, `buyer`)
                VALUES (%(chain_id)s, %(parcel_id)s, %(buyer)s)
                """,
                vars(self))

    def save(self, cursor):
        values = vars(self)
        values['payment'] = str(values['payment'])
        values['dealer_fee'] = str(values['dealer_fee'])
        cursor.execute("""
            UPDATE `s_requests`
            SET
                `payment` = %(payment)s,
                `dealer` = %(dealer)s,
                `dealer_fee` = %(dealer_fee)s,
                `extra` = %(extra)s
            WHERE (`chain_id` = %(chain_id)s
                AND `parcel_id` = %(parcel_id)s
                AND `buyer` = %(buyer)s)
            """,
            values)

    def delete(self, cursor):
        cursor.execute("""
            DELETE FROM `s_requests`
            WHERE (`chain_id` = %(chain_id)s
                AND `parcel_id` = %(parcel_id)s
                AND `buyer` = %(buyer)s)
            """,
            vars(self))

class Usage:
    def __init__(self, chain_id, parcel_id, grantee, cursor):
        self.chain_id = chain_id
        self.parcel_id = parcel_id
        self.grantee = grantee
        self.custody = ''
        self.extra = '{}'
        cursor.execute("""
            SELECT * FROM `s_usages`
            WHERE (`chain_id` = %(chain_id)s
                AND `parcel_id` = %(parcel_id)s
                AND `grantee` = %(grantee)s)
            """,
            vars(self))
        row = cursor.fetchone()
        if row:
            d = dict(zip(cursor.column_names, row))
            self.custody = d.get('custody')
            self.extra = d.get('extra', '{}')
        else:
            cursor.execute("""
                INSERT INTO `s_usages`
                    (`chain_id`, `parcel_id`, `grantee`)
                VALUES (%(chain_id)s, %(parcel_id)s, %(grantee)s)
                """,
                vars(self))

    def save(self, cursor):
        values = vars(self)
        cursor.execute("""
            UPDATE `s_usages`
            SET
                `custody` = %(custody)s,
                `extra` = %(extra)s
            WHERE (`chain_id` = %(chain_id)s
                AND `parcel_id` = %(parcel_id)s
                AND `grantee` = %(grantee)s)
            """,
            values)

    def delete(self, cursor):
        cursor.execute("""
            DELETE FROM `s_usages`
            WHERE (`chain_id` = %(chain_id)s
                AND `parcel_id` = %(parcel_id)s
                AND `grantee` = %(grantee)s)
            """,
            vars(self))

class UDC:
    def __init__(self, chain_id, udc_id, cursor):
        self.chain_id = chain_id
        self.udc_id = udc_id
        self.owner = ''
        self.desc = ''
        self.operators = '[]'
        self.total = 0
        cursor.execute("""
            SELECT * FROM `s_udcs`
            WHERE (`chain_id` = %(chain_id)s
                AND `udc_id` = %(udc_id)s)
            """,
            vars(self))
        row = cursor.fetchone()
        if row:
            d = dict(zip(cursor.column_names, row))
            self.owner = d.get('owner')
            self.desc = d.get('desc')
            self.operators = d.get('operators')
            self.total = int(d.get('total'))
        else:
            cursor.execute("""
                INSERT INTO `s_udcs`
                    (`chain_id`, `udc_id`)
                VALUES (%(chain_id)s, %(udc_id)s)
                """,
                vars(self))

    def save(self, cursor):
        values = vars(self)
        values['total'] = str(values['total'])
        cursor.execute("""
            UPDATE `s_udcs`
            SET
                `owner` = %(owner)s,
                `desc` = %(desc)s,
                `operators` = %(operators)s,
                `total` = %(total)s
            WHERE (`chain_id` = %(chain_id)s
                AND `udc_id` = %(udc_id)s)
            """,
            values)

class UDCBalance:
    def __init__(self, chain_id, udc_id, address, cursor):
        self.chain_id = chain_id
        self.udc_id = udc_id
        self.address = address
        self.balance = 0
        self.balance_lock = 0
        cursor.execute("""
            SELECT * FROM `s_udc_balances`
            WHERE (`chain_id` = %(chain_id)s
                AND `udc_id` = %(udc_id)s
                AND `address` = %(address)s)
            """,
            vars(self))
        row = cursor.fetchone()
        if row:
            d = dict(zip(cursor.column_names, row))
            self.balance = int(d.get('balance'))
            self.balance_lock = int(d.get('balance_lock'))
        else:
            cursor.execute("""
                INSERT INTO `s_udc_balances`
                    (`chain_id`, `udc_id`, `address`)
                VALUES (%(chain_id)s, %(udc_id)s, %(address)s)
                """,
                vars(self))

    def save(self, cursor):
        values = vars(self)
        values['balance'] = str(values['balance'])
        values['balance_lock'] = str(values['balance_lock'])
        cursor.execute("""
            UPDATE `s_udc_balances`
            SET
                `balance` = %(balance)s,
                `balance_lock` = %(balance_lock)s
            WHERE (`chain_id` = %(chain_id)s
                AND `udc_id` = %(udc_id)s
                AND `address` = %(address)s)
            """,
            values)

def unknown(tx, cursor):
    print(f'tx type ({tx.type}) unknown')

def transfer(tx, cursor):
    #print(f'tx type ({tx.type})')
    payload = json.loads(tx.payload)
    payload['amount'] = int(payload['amount'])

    sender = Account(tx.chain_id, tx.sender, cursor)
    recp = Account(tx.chain_id, payload['to'], cursor)

    sender.balance -= payload['amount']
    recp.balance += payload['amount']

    sender.save(cursor)
    recp.save(cursor)

def stake(tx, cursor):
    #print(f'tx type ({tx.type})')
    payload = json.loads(tx.payload)
    payload['amount'] = int(payload['amount'])

    sender = Account(tx.chain_id, tx.sender, cursor)

    sender.stake += payload['amount']
    sender.balance -= payload['amount']
    val_pubkey = base64.b64decode(payload['validator'])
    sender.val_addr = sha256(val_pubkey).hexdigest()[:40].upper()

    sender.save(cursor)

def withdraw(tx, cursor):
    #print(f'tx type ({tx.type})')
    payload = json.loads(tx.payload)
    payload['amount'] = int(payload['amount'])

    sender = Account(tx.chain_id, tx.sender, cursor)

    sender.stake -= payload['amount']
    sender.balance += payload['amount']
    if sender.stake == 0:
        sender.val_addr = None

    sender.save(cursor)

def delegate(tx, cursor):
    #print(f'tx type ({tx.type})')
    payload = json.loads(tx.payload)
    payload['amount'] = int(payload['amount'])

    sender = Account(tx.chain_id, tx.sender, cursor)

    sender.delegate += payload['amount']
    sender.balance -= payload['amount']
    sender.del_addr = payload['to']

    sender.save(cursor)

def retract(tx, cursor):
    #print(f'tx type ({tx.type})')
    payload = json.loads(tx.payload)
    payload['amount'] = int(payload['amount'])

    sender = Account(tx.chain_id, tx.sender, cursor)

    sender.delegate -= payload['amount']
    sender.balance += payload['amount']
    if sender.stake == 0:
        sender.del_addr = None

    sender.save(cursor)

def setup(tx, cursor):
    #print(f'tx type ({tx.type})')
    payload = json.loads(tx.payload)

    owner = Account(tx.chain_id, tx.sender, cursor)
    storage = Storage(tx.chain_id, payload['storage'], owner.address, cursor)

    storage.url = payload['url']
    storage.registration_fee = int(payload['registration_fee'])
    storage.hosting_fee = int(payload['hosting_fee'])
    storage.active = True

    storage.save(cursor)

def close(tx, cursor):
    #print(f'tx type ({tx.type})')
    payload = json.loads(tx.payload)

    storage = Storage(tx.chain_id, payload['storage'], None, cursor)

    storage.active = False

    storage.save(cursor)

def register(tx, cursor):
    #print(f'tx type ({tx.type})')
    payload = json.loads(tx.payload)

    owner = Account(tx.chain_id, tx.sender, cursor)
    parcel = Parcel(tx.chain_id, payload['target'], owner.address, cursor)

    parcel.custody = payload['custody']
    parcel.proxy_account = payload.get('proxy_account', None)
    parcel.extra = payload.get('extra', '{}')
    parcel.on_sale = True

    parcel.save(cursor)

def discard(tx, cursor):
    #print(f'tx type ({tx.type}) (not implemented)')
    payload = json.loads(tx.payload)

    parcel = Parcel(tx.chain_id, payload['target'], None, cursor)

    parcel.on_sale = False

    parcel.save(cursor)

def request(tx, cursor):
    #print(f'tx type ({tx.type}) (not implemented)')
    payload = json.loads(tx.payload)

    buyer = Account(tx.chain_id, tx.sender, cursor)
    parcel = Parcel(tx.chain_id, payload['target'], None, cursor)
    request = Request(tx.chain_id, parcel.parcel_id, buyer.address, cursor)

    request.payment = int(payload['payment'])
    request.dealer = payload.get('dealer', None)
    request.dealer_fee = int(payload.get('dealer_fee', '0'))
    request.extra = payload.get('extra', '{}')

    request.save(cursor)

def cancel(tx, cursor):
    #print(f'tx type ({tx.type}) (not implemented)')
    payload = json.loads(tx.payload)

    request = Request(tx.chain_id, payload['target'], tx.sender, cursor)

    request.delete(cursor)

def grant(tx, cursor):
    #print(f'tx type ({tx.type}) (not implemented)')
    payload = json.loads(tx.payload)

    usage = Usage(tx.chain_id, payload['target'], payload['grantee'], cursor)

    usage.custody = payload['custody']
    usage.extra = payload.get('extra', '{}')

    usage.save(cursor)

def revoke(tx, cursor):
    #print(f'tx type ({tx.type}) (not implemented)')
    payload = json.loads(tx.payload)

    usage = Usage(tx.chain_id, payload['target'], payload['grantee'], cursor)

    usage.delete(cursor)

def issue(tx, cursor):
    #print(f'tx type ({tx.type}) (not implemented)')
    payload = json.loads(tx.payload)

    udc = UDC(tx.chain_id, payload['udc'], cursor)

    if udc.total == 0: # initial issue
        udc.owner = tx.sender
    udc.desc = payload['desc']
    udc.operators = json.dumps(payload.get('operators', []))
    udc.total += payload['amount']

    udc.save(cursor)

def lock(tx, cursor):
    #print(f'tx type ({tx.type}) (not implemented)')
    payload = json.loads(tx.payload)

    udc_balance = UDCBalance(tx.chain_id, payload['udc'], payload['holder'],
            cursor)
    udc_balance.balance_lock = payload['amount']

    udc_balance.save(cursor)

def burn(tx, cursor):
    #print(f'tx type ({tx.type}) (not implemented)')
    payload = json.loads(tx.payload)
    # udc
    # amount

    udc_balance = UDCBalance(tx.chain_id, payload['udc'], tx.sender,
            cursor)
    udc_balance.balance -= payload['amount']

    udc_balance.save(cursor)

def propose(tx, cursor):
    #print(f'tx type ({tx.type}) (not implemented)')
    pass

def vote(tx, cursor):
    #print(f'tx type ({tx.type}) (not implemented)')
    pass

processor = {
        'transfer': transfer,
        'stake': stake,
        'withdraw': withdraw,
        'delegate': delegate,
        'retract': retract,
        'setup': setup,
        'close': close,
        'register': register,
        'discard': discard,
        'request': request,
        'cancel': cancel,
        'grant': grant,
        'revoke': revoke,
        'issue': issue,
        'lock': lock,
        'burn': burn,
        'propose': propose,
        'vote': vote,
        }
