# -*- coding: utf-8 -*-
# vim: set sw=4 ts=4 expandtab :

import json
import base64
from datetime import timezone
from dateutil.parser import parse as dateparse

def format_block(dat):
    # format
    block = {}
    block['chain_id'] = dat['header']['chain_id']
    block['height'] = dat['header']['height']
    block['time'] = dateparse(dat['header']['time']).astimezone(tz=timezone.utc)
    block['hash'] = dat['block_id']['hash']
    block['num_txs'] = dat['header']['num_txs']
    return block

def format_tx(dat):
    tx = {}
    tx['hash'] = dat['hash']
    tx['height'] = int(dat['height'])
    tx['index'] = int(dat['index'])
    tx['code'] = int(dat['tx_result']['code'])
    tx['info'] = dat['tx_result']['info']
    b = base64.b64decode(dat['tx'])
    body = json.loads(b)
    tx['type'] = body['type']
    tx['sender'] = body['sender']
    tx['fee'] = int(body['fee'])
    tx['payload'] = json.dumps(body['payload'])
    return tx

