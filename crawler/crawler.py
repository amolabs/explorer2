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

def collect_block_headers(node, base, num):
    print(f'batch height from {base+1} to {base+num}')
    r = requests.get(
            f'{node}/blockchain?minHeight={base+1}&maxHeight={base+num}')
    metas = json.loads(r.text)['result']['block_metas']
    list.sort(metas, key=lambda val: int(val['header']['height']))
    return metas

def save_block(block):
    #print(json.dumps(block))
    dt = block['time'].astimezone(tz=timezone.utc)
    block['time'] = dt.replace(tzinfo=None).isoformat()

    block['interval'] = 0
    if block['height'] == 1:
        block['interval'] = 0
    else:
        cur.execute(f"""SELECT `time` FROM `blocks`
            WHERE `height` = {block["height"] - 1}""")
        row = cur.fetchone()
        # TODO exception handling
        prev = row[0].replace(tzinfo=timezone.utc)
        block['interval'] = (dt - prev).total_seconds()

    cur.execute("""
        INSERT INTO `blocks`
            (`chain_id`, `height`, `time`, `hash`, `num_txs`,
                `interval`, `proposer`)
        VALUES
            (%(chain_id)s, %(height)s, %(time)s, %(hash)s, %(num_txs)s,
            %(interval)s, %(proposer)s)""",
        (block))

def collect_block_txs(node, height):
    # collect txs
    r = requests.get(f'{node}/tx_search?query="tx.height={height}"')
    items = json.loads(r.text)['result']['txs']
    print(f'- block height {height}: num_txs = {len(items)}')
    return items

def save_tx(chain_id, tx):
    tx['chain_id'] = chain_id
    cur.execute("""
        INSERT INTO `txs`
            (`chain_id`, `hash`, `height`, `index`, `code`, `info`,
            `type`, `sender`, `fee`, `payload`)
        VALUES
            (%(chain_id)s, %(hash)s,
            %(height)s, %(index)s, %(code)s, %(info)s,
            %(type)s, %(sender)s, %(fee)s, %(payload)s
            )""",
        (tx))

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
while run > 0:
    # XXX: This limit is due to the limit of tendermint rpc.
    batch_run = min(run,20)
    # batch start
    db.autocommit = False

    # collect raw data
    metas = collect_block_headers(node, batch_base, batch_run)
    for meta in metas:
        block = amo.format_block(meta)
        save_block(block)

        if int(block['num_txs']) > 0:
            items = collect_block_txs(node, block['height'])
            for item in items:
                tx = amo.format_tx(item)
                save_tx(block['chain_id'], tx)

    # update stat
    # done

    db.commit()
    # batch end

    run -= len(metas)
    batch_base += len(metas)

# closing
cur.close()
db.close()
