# -*- coding: utf-8 -*-
# vim: set sw=4 ts=4 expandtab :

import json
from hashlib import sha256

import stats

class Account:
    def __init__(self, chain_id, address, cursor):
        self.chain_id = chain_id
        self.address = address
        self.balance = 0
        self.stake = 0
        self.val_addr = None
        self.val_pubkey = None
        self.val_power = 0
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
            self.val_pubkey = d['val_pubkey']
            self.val_power = int(d['val_power'])
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
        values['val_power'] = str(values['val_power'])
        cursor.execute("""
            UPDATE `s_accounts`
            SET
                `balance` = %(balance)s,
                `stake` = %(stake)s,
                `val_addr` = %(val_addr)s,
                `val_pubkey` = %(val_pubkey)s,
                `val_power` = %(val_power)s,
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
        self.owner = owner # FK
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
                `storage_id` = %(storage_id)s,
                `custody` = %(custody)s,
                `proxy_account` = %(proxy_account)s,
                `extra` = %(extra)s,
                `on_sale` = %(on_sale)s
            WHERE (`chain_id` = %(chain_id)s AND `parcel_id` = %(parcel_id)s)
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

class Draft:
    def __init__(self, chain_id, draft_id, proposer, cursor):
        self.chain_id = chain_id
        self.draft_id = draft_id
        self.proposer = proposer # FK
        cursor.execute("""
            SELECT * FROM `s_drafts`
            WHERE (`chain_id` = %(chain_id)s
                AND `draft_id` = %(draft_id)s)
            """,
            vars(self))
        row = cursor.fetchone()
        if row:
            d = dict(zip(cursor.column_names, row))
            self.proposer = d['proposer']
            self.config = d['config']
            self.desc = d['desc']
            self.open_count = d['open_count']
            self.close_count = d['close_count']
            self.apply_count = d['apply_count']
            self.deposit = int(d['deposit'])
            self.tally_approve = d['tally_approve']
            self.tally_reject = d['tally_reject']
        else:
            cursor.execute("""
                INSERT INTO `s_drafts`
                    (`chain_id`, `draft_id`, `proposer`)
                VALUES (%(chain_id)s, %(draft_id)s, %(proposer)s)
                """,
                vars(self))

    def save(self, cursor):
        values = vars(self)
        values['deposit'] = str(values.get('deposit', '0'))
        cursor.execute("""
            UPDATE `s_drafts`
            SET
                `proposer` = %(proposer)s,
                `config` = %(config)s,
                `desc` = %(desc)s,
                `open_count` = %(open_count)s,
                `close_count` = %(close_count)s,
                `apply_count` = %(apply_count)s,
                `deposit` = %(deposit)s,
                `tally_approve` = %(tally_approve)s,
                `tally_reject` = %(tally_reject)s
            WHERE (`chain_id` = %(chain_id)s
                AND `draft_id` = %(draft_id)s)
            """,
            values)

class Vote:
    def __init__(self, chain_id, draft_id, voter, cursor):
        self.chain_id = chain_id
        self.draft_id = draft_id
        self.voter = voter
        cursor.execute("""
            SELECT * FROM `s_votes`
            WHERE (`chain_id` = %(chain_id)s
                AND `draft_id` = %(draft_id)s
                AND `voter` = %(voter)s)
            """,
            vars(self))
        row = cursor.fetchone()
        if row:
            d = dict(zip(cursor.column_names, row))
            self.approve = d.get('approve')
        else:
            cursor.execute("""
                INSERT INTO `s_votes`
                    (`chain_id`, `draft_id`, `voter`)
                VALUES (%(chain_id)s, %(draft_id)s, %(voter)s)
                """,
                vars(self))

    def save(self, cursor):
        cursor.execute("""
            UPDATE `s_votes`
            SET
                `approve` = %(approve)s
            WHERE (`chain_id` = %(chain_id)s
                AND `draft_id` = %(draft_id)s
                AND `voter` = %(voter)s)
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
    sender.val_pubkey = payload['validator']
    b = bytearray.fromhex(sender.val_pubkey)
    sender.val_addr = sha256(b).hexdigest()[:40].upper()

    asset_stat = stats.Asset(tx.chain_id, cursor)
    asset_stat.active_coins -= payload['amount']
    asset_stat.stakes += payload['amount']
    asset_stat.save(cursor)

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

    asset_stat = stats.Asset(tx.chain_id, cursor)
    asset_stat.active_coins += payload['amount']
    asset_stat.stakes -= payload['amount']
    asset_stat.save(cursor)

    sender.save(cursor)

def delegate(tx, cursor):
    #print(f'tx type ({tx.type})')
    payload = json.loads(tx.payload)
    payload['amount'] = int(payload['amount'])

    sender = Account(tx.chain_id, tx.sender, cursor)

    sender.delegate += payload['amount']
    sender.balance -= payload['amount']
    sender.del_addr = payload['to']

    asset_stat = stats.Asset(tx.chain_id, cursor)
    asset_stat.active_coins -= payload['amount']
    asset_stat.delegates += payload['amount']
    asset_stat.save(cursor)

    sender.save(cursor)

def retract(tx, cursor):
    #print(f'tx type ({tx.type})')
    payload = json.loads(tx.payload)
    payload['amount'] = int(payload['amount'])

    sender = Account(tx.chain_id, tx.sender, cursor)

    sender.delegate -= payload['amount']
    sender.balance += payload['amount']
    if sender.delegate == 0:
        sender.del_addr = None

    asset_stat = stats.Asset(tx.chain_id, cursor)
    asset_stat.active_coins += payload['amount']
    asset_stat.delegates -= payload['amount']
    asset_stat.save(cursor)

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
    storage = Storage(tx.chain_id, parcel.storage_id, None, cursor)
    host = Account(tx.chain_id, storage.owner, cursor)

    parcel.custody = payload['custody']
    parcel.proxy_account = payload.get('proxy_account', None)
    parcel.extra = payload.get('extra', '{}')
    parcel.on_sale = True

    owner.balance -= storage.registration_fee
    host.balance += storage.registration_fee

    owner.save(cursor)
    parcel.save(cursor)
    host.save(cursor)

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
    storage = Storage(tx.chain_id, parcel.storage_id, None, cursor)
    host = Account(tx.chain_id, storage.owner, cursor)
    request = Request(tx.chain_id, parcel.parcel_id, buyer.address, cursor)

    request.payment = int(payload['payment'])
    request.dealer = payload.get('dealer', None)
    request.dealer_fee = int(payload.get('dealer_fee', '0'))
    request.extra = payload.get('extra', '{}')

    if request.dealer is not None:
        buyer.balance -= request.dealer_fee
    buyer.balance -= request.payment

    request.save(cursor)
    dealer.save(cursor)
    buyer.save(cursor)

def cancel(tx, cursor):
    #print(f'tx type ({tx.type}) (not implemented)')
    payload = json.loads(tx.payload)

    buyer = Account(tx.chain_id, tx.sender, cursor)
    request = Request(tx.chain_id, payload['target'], tx.sender, cursor)

    buyer.balance += request.payment
    buyer.balance += request.dealer_fee

    request.delete(cursor)
    buyer.save(cursor)

def grant(tx, cursor):
    #print(f'tx type ({tx.type}) (not implemented)')
    payload = json.loads(tx.payload)

    parcel = Parcel(tx.chain_id, payload['target'], None, cursor)
    storage = Storage(tx.chain_id, parcel.storage_id, None, cursor)
    host = Account(tx.chain_id, storage.owner, cursor)
    owner = Account(tx.chain_id, parcel.owner, cursor)
    request = Request(tx.chain_id, payload['target'], payload['grantee'], cursor)
    usage = Usage(tx.chain_id, payload['target'], payload['grantee'], cursor)

    usage.custody = payload['custody']
    usage.extra = payload.get('extra', '{}')

    owner.balance += request.payment
    if request.dealer is not None:
        dealer = Account(tx.chain_id, request.dealer, cursor)
        dealer.balance += request.dealer_fee
    owner.balance -= storage.hosting_fee
    host.balance += storage.hosting_fee

    request.delete(cursor)
    usage.save(cursor)

def revoke(tx, cursor):
    #print(f'tx type ({tx.type}) (not implemented)')
    payload = json.loads(tx.payload)

    usage = Usage(tx.chain_id, payload['target'], payload['grantee'], cursor)

    usage.delete(cursor)

def issue(tx, cursor):
    #print(f'tx type ({tx.type}) (not implemented)')
    payload = json.loads(tx.payload)
    payload['amount'] = int(payload['amount'])

    udc = UDC(tx.chain_id, payload['udc'], cursor)
    issuer = UDCBalance(tx.chain_id, udc.udc_id, tx.sender, cursor)

    if udc.total == 0: # initial issue
        udc.owner = tx.sender
    udc.desc = payload['desc']
    udc.operators = json.dumps(payload.get('operators', []))
    udc.total += payload['amount']

    issuer.balance += payload['amount']

    udc.save(cursor)
    issuer.save(cursor)

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
    payload = json.loads(tx.payload)
    payload['deposit'] = int(payload.get('deposit', '0'))

    proposer = Account(tx.chain_id, tx.sender, cursor)
    draft = Draft(tx.chain_id, payload['draft_id'], tx.sender, cursor)
    draft.config = json.dumps(payload['config'])
    draft.desc = payload['desc']
    draft.open_count = 0
    draft.close_count = 0
    draft.apply_count = 0
    draft.deposit = payload['deposit']
    draft.tally_approve = 0
    draft.tally_reject = 0

    proposer.balance -= payload['deposit']

    proposer.save(cursor)
    draft.save(cursor)

def vote(tx, cursor):
    payload = json.loads(tx.payload)

    voter = Account(tx.chain_id, tx.sender, cursor)
    draft = Draft(tx.chain_id, payload['draft_id'], None, cursor)
    vote = Vote(tx.chain_id, draft.draft_id, voter.address, cursor)
    vote.approve = payload['approve']

    vote.save(cursor)

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
