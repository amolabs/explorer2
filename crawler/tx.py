# -*- coding: utf-8 -*-
# vim: set sw=4 ts=4 expandtab :

import json
from hashlib import sha256

import stats
import models

def unknown(tx, cursor):
    print(f'tx type ({tx.type}) unknown')

def transfer(tx, cursor):
    payload = json.loads(tx.payload)
    payload['amount'] = int(payload['amount'])

    sender = models.Account(tx.chain_id, tx.sender, cursor)
    recp = models.Account(tx.chain_id, payload['to'], cursor)

    sender.balance -= payload['amount']
    recp.balance += payload['amount']

    sender.save(cursor)
    recp.save(cursor)

def stake(tx, cursor):
    payload = json.loads(tx.payload)
    payload['amount'] = int(payload['amount'])

    sender = models.Account(tx.chain_id, tx.sender, cursor)

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
    payload = json.loads(tx.payload)
    payload['amount'] = int(payload['amount'])

    sender = models.Account(tx.chain_id, tx.sender, cursor)

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
    payload = json.loads(tx.payload)
    payload['amount'] = int(payload['amount'])

    sender = models.Account(tx.chain_id, tx.sender, cursor)

    sender.delegate += payload['amount']
    sender.balance -= payload['amount']
    sender.del_addr = payload['to']

    asset_stat = stats.Asset(tx.chain_id, cursor)
    asset_stat.active_coins -= payload['amount']
    asset_stat.delegates += payload['amount']
    asset_stat.save(cursor)

    sender.save(cursor)

def retract(tx, cursor):
    payload = json.loads(tx.payload)
    payload['amount'] = int(payload['amount'])

    sender = models.Account(tx.chain_id, tx.sender, cursor)

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
    payload = json.loads(tx.payload)
    payload['registration_fee'] = int(payload['registration_fee'])
    payload['hosting_fee'] = int(payload['hosting_fee'])

    owner = models.Account(tx.chain_id, tx.sender, cursor)
    storage = models.Storage(tx.chain_id, payload['storage'], owner.address,
            cursor)

    storage.url = payload['url']
    storage.registration_fee = payload['registration_fee']
    storage.hosting_fee = payload['hosting_fee']
    storage.active = True

    storage.save(cursor)

def close(tx, cursor):
    payload = json.loads(tx.payload)

    storage = models.Storage(tx.chain_id, payload['storage'], None, cursor)

    storage.active = False

    storage.save(cursor)

def register(tx, cursor):
    payload = json.loads(tx.payload)

    owner = models.Account(tx.chain_id, tx.sender, cursor)
    parcel = models.Parcel(tx.chain_id, payload['target'], owner.address,
            cursor)
    storage = models.Storage(tx.chain_id, parcel.storage_id, None, cursor)
    host = models.Account(tx.chain_id, storage.owner, cursor)

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
    payload = json.loads(tx.payload)

    parcel = models.Parcel(tx.chain_id, payload['target'], None, cursor)

    parcel.on_sale = False

    parcel.save(cursor)

def request(tx, cursor):
    payload = json.loads(tx.payload)
    payload['payment'] = int(payload['payment'])
    payload['dealer_fee'] = int(payload.get('dealer_fee', '0'))

    buyer = models.Account(tx.chain_id, tx.sender, cursor)
    parcel = models.Parcel(tx.chain_id, payload['target'], None, cursor)
    storage = models.Storage(tx.chain_id, parcel.storage_id, None, cursor)
    host = models.Account(tx.chain_id, storage.owner, cursor)
    request = models.Request(tx.chain_id, parcel.parcel_id, buyer.address,
            cursor)

    request.payment = payload['payment']
    request.dealer = payload.get('dealer', None)
    request.dealer_fee = payload['dealer_fee']
    request.extra = payload.get('extra', '{}')

    if request.dealer is not None:
        buyer.balance -= request.dealer_fee
    buyer.balance -= request.payment

    request.save(cursor)
    buyer.save(cursor)

def cancel(tx, cursor):
    payload = json.loads(tx.payload)

    buyer = models.Account(tx.chain_id, tx.sender, cursor)
    request = models.Request(tx.chain_id, payload['target'], tx.sender, cursor)

    buyer.balance += request.payment
    buyer.balance += request.dealer_fee

    request.delete(cursor)
    buyer.save(cursor)

def grant(tx, cursor):
    payload = json.loads(tx.payload)

    parcel = models.Parcel(tx.chain_id, payload['target'], None, cursor)
    storage = models.Storage(tx.chain_id, parcel.storage_id, None, cursor)
    host = models.Account(tx.chain_id, storage.owner, cursor)
    owner = models.Account(tx.chain_id, parcel.owner, cursor)
    request = models.Request(tx.chain_id, payload['target'], payload['grantee'],
            cursor)
    usage = models.Usage(tx.chain_id, payload['target'], payload['grantee'],
            cursor)

    usage.custody = payload['custody']
    usage.extra = payload.get('extra', '{}')

    owner.balance += request.payment
    if request.dealer is not None:
        dealer = models.Account(tx.chain_id, request.dealer, cursor)
        dealer.balance += request.dealer_fee
        deader.save(cursor)
    owner.balance -= storage.hosting_fee
    host.balance += storage.hosting_fee

    request.delete(cursor)
    usage.save(cursor)

def revoke(tx, cursor):
    payload = json.loads(tx.payload)

    usage = models.Usage(tx.chain_id, payload['target'], payload['grantee'],
            cursor)

    usage.delete(cursor)

def issue(tx, cursor):
    payload = json.loads(tx.payload)
    payload['amount'] = int(payload['amount'])

    udc = models.UDC(tx.chain_id, payload['udc'], cursor)
    issuer = models.UDCBalance(tx.chain_id, udc.udc_id, tx.sender, cursor)

    if udc.total == 0: # initial issue
        udc.owner = tx.sender
    udc.desc = payload['desc'] if 'desc' in payload else ''
    udc.operators = json.dumps(payload.get('operators', []))
    udc.total += payload['amount']

    issuer.balance += payload['amount']

    udc.save(cursor)
    issuer.save(cursor)

def lock(tx, cursor):
    payload = json.loads(tx.payload)
    payload['amount'] = int(payload['amount'])

    udc_bal = models.UDCBalance(tx.chain_id, payload['udc'], payload['holder'],
            cursor)
    udc_bal.balance_lock = payload['amount']

    udc_bal.save(cursor)

def burn(tx, cursor):
    payload = json.loads(tx.payload)
    payload['amount'] = int(payload['amount'])

    udc_bal = models.UDCBalance(tx.chain_id, payload['udc'], tx.sender,
            cursor)
    udc_bal.balance -= payload['amount']

    udc_bal.save(cursor)

def propose(tx, cursor):
    payload = json.loads(tx.payload)
    payload['deposit'] = int(payload.get('deposit', '0'))

    proposer = models.Account(tx.chain_id, tx.sender, cursor)
    draft = models.Draft(tx.chain_id, payload['draft_id'], tx.sender, cursor)

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

    voter = models.Account(tx.chain_id, tx.sender, cursor)
    draft = models.Draft(tx.chain_id, payload['draft_id'], None, cursor)
    vote = models.Vote(tx.chain_id, draft.draft_id, voter.address, cursor)

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
