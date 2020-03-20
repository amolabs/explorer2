#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# vim: set sw=4 ts=4 expandtab :

import json
import argparse
import requests
import mysql.connector
from mysql.connector import Error
from datetime import timezone

import amo

# local config
dbconfigfile = '../db/config.json'

# command line args
p = argparse.ArgumentParser('AMO blockchain crawler')
p.add_argument("node", help="rpc node address to connect",
        type=str)
p.add_argument("-l", "--limit", help="limit number of blocks to collect",
        type=int, default=100)
args = p.parse_args()
node = args.node

def collect_block(node, height):
    r = requests.get(f'{node}/block?height={height}')
    block = json.loads(r.text)['result']
    if int(block['block_meta']['header']['num_txs']) > 0:
        r = requests.get(f'{node}/block_results?height={height}')
        block_results = json.loads(r.text)['result']['results']['deliver_tx']
    else:
        block_results = []
    return block['block_meta'], block['block']['data']['txs'], block_results

def collect_block_headers(node, base, num):
    print(f'batch height from {base+1} to {base+num}')
    r = requests.get(
            f'{node}/blockchain?minHeight={base+1}&maxHeight={base+num}')
    metas = json.loads(r.text)['result']['block_metas']
    list.sort(metas, key=lambda val: int(val['header']['height']))
    return metas

def collect_block_txs(node, height):
    # collect txs
    r = requests.get(f'{node}/tx_search?query="tx.height={height}"')
    items = json.loads(r.text)['result']['txs']
    print(f'- block height {height}: num_txs = {len(items)}')
    return items

# read config
try:
    f = open(dbconfigfile, "r")
    config = json.load(f)
    dbconfig = config['db']
except OSError as e:
    print("Unable to read DB config:", e)
    exit(-1)
else:
    f.close()

# connect db
try:
    db = mysql.connector.connect(
            host=dbconfig['host'],
            user=dbconfig['user'],
            password=dbconfig['password'],
            database=dbconfig['database'],
            )
except Error as e:
    print("DB connection error", e)
    exit(-1)
else:
    print("DB connected")

# get current explorer state
cur = db.cursor()
cur.execute("""SELECT * FROM `chain_summary`""")
row = cur.fetchone()
if row:
    #print(row)
    chain_summary = dict(zip(cur.column_names, row))
    last_height = int(chain_summary['height'])
else:
    last_height = 0
print('fetched currnet explorer status')

# get node status
r = requests.get(f'{node}/status')
dat = json.loads(r.text)
target_height = int(dat['result']['sync_info']['latest_block_height'])
#print(dat['result']['node_info']['network'])
print('fetched target node status')

# figure out
print(f'currnet explorer status: {last_height}')
print(f'target node status: {target_height}')
limit = args.limit
if limit > 0:
    run = min(target_height - last_height, limit)
else:
    run = target_height - last_height

print(f'==========================================================')
batch_base = last_height
#while run > 0:
for h in range(last_height + 1, last_height + run + 1):
    # batch start
    db.autocommit = False

    ### NOTE: the following strategy is effective when tx density is high.
    if h % 50 == 0:
        print('.', flush=True)
    else:
        print('.', end='', flush=True)
    if h % 100 == 0:
        print(f'block height {h}', flush=True)
    block_meta, tx_bodies, block_results = collect_block(node, h)
    block = amo.Block(block_meta['header']['chain_id'], h)
    block.set_meta(block_meta)
    #if tx_bodies == None:
    #    tx_bodies = []
    #if block_results == None:
    #    block_results = []
    #if len(tx_bodies) != len(block_results):
    #    print(f'tx bodies and block results mismatches')
    #    exit(-1)
    block.save(cur)
    num = 0
    num_valid = 0
    num_invalid = 0
    for i in range(len(tx_bodies) if tx_bodies else 0):
        body = tx_bodies[i]
        result = block_results[i]
        tx = amo.Tx(block.chain_id, block.height, i)
        tx.set_body(body)
        tx.set_result(result)
        if result['code'] == 0:
            num_valid += 1
        else:
            num_invalid += 1
        num += 1
        #pprint(vars(tx))
        tx.save(cur)

    assert(block.num_txs == num)
    if num_valid > 0 or num_invalid > 0:
        block.num_txs_valid = num_valid
        block.num_txs_invalid = num_invalid
        block.update(cur)

    ### NOTE: the following strategy is effective when tx density is low.

    # XXX: This limit is due to the limit of tendermint rpc.
    #batch_run = min(run,20)
    # collect raw data
    #metas = collect_block_headers(node, batch_base, batch_run)
    #for meta in metas:
    #    block = amo.format_block(meta)
    #    save_block(block)
    #    if int(block['num_txs']) > 0:
    #        items = collect_block_txs(node, block['height'])
    #        for item in items:
    #            tx = amo.format_tx(item)
    #            save_tx(block['chain_id'], tx)
    # update stat
    # done

    #run -= len(metas)
    #batch_base += len(metas)

    db.commit()
    # batch end

print()
# closing
cur.close()
db.close()
