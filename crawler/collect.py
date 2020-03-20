# -*- coding: utf-8 -*-
# vim: set sw=4 ts=4 expandtab :

import json
import requests

def block(node, height):
    r = requests.get(f'{node}/block?height={height}')
    block = json.loads(r.text)['result']
    if int(block['block_meta']['header']['num_txs']) > 0:
        r = requests.get(f'{node}/block_results?height={height}')
        block_results = json.loads(r.text)['result']['results']['deliver_tx']
    else:
        block_results = []
    return block['block_meta'], block['block']['data']['txs'], block_results

def block_metas(node, base, num):
    print(f'batch height from {base+1} to {base+num}')
    r = requests.get(
            f'{node}/blockchain?minHeight={base+1}&maxHeight={base+num}')
    metas = json.loads(r.text)['result']['block_metas']
    list.sort(metas, key=lambda val: int(val['header']['height']))
    return metas

def block_txs(node, height):
    # collect txs
    r = requests.get(f'{node}/tx_search?query="tx.height={height}"')
    items = json.loads(r.text)['result']['txs']
    print(f'- block height {height}: num_txs = {len(items)}')
    return items

