# -*- coding: utf-8 -*-
# vim: set sw=4 ts=4 expandtab :

import json
import base64

def block(s, node, height):
    r = s.get(f'{node}/block?height={height}')
    dat = json.loads(r.text)['result']
    block_id = dat['block_id']
    block = dat['block']

    r = s.get(f'{node}/block_results?height={height}')
    txs_results = json.loads(r.text)['result']['txs_results']

    q = f'"{height}"'.encode('latin1').hex()
    r = s.get(f'{node}/abci_query?path="/inc_block"&data=0x{q}')
    b = json.loads(r.text)['result']['response']['value']
    if b == None:
        incs = json.dumps([])
    else:
        incs = base64.b64decode(b)

    return block_id, block, txs_results, incs

#def block_metas(node, base, num):
#    print(f'batch height from {base+1} to {base+num}')
#    r = requests.get(
#            f'{node}/blockchain?minHeight={base+1}&maxHeight={base+num}')
#    metas = json.loads(r.text)['result']['block_metas']
#    list.sort(metas, key=lambda val: int(val['header']['height']))
#    return metas

#def block_txs(node, height):
#    # collect txs
#    r = requests.get(f'{node}/tx_search?query="tx.height={height}"')
#    items = json.loads(r.text)['result']['txs']
#    print(f'- block height {height}: num_txs = {len(items)}')
#    return items

