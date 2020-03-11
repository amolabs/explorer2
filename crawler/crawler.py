#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# vim: set sw=4 ts=4 expandtab :

import json
import argparse
import requests
import mysql.connector
from mysql.connector import Error
from dateutil.parser import parse

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
cur.execute("""select * from chain_summary""")
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
if limit == 0:
    limit = 20
run = min(target_height - last_height, limit)

batch_base = last_height
while run > 0:
    # XXX: This limit is due to the limit of tendermint rpc.
    batch_run = min(run,20)
    # one batch
    print(f'batch height from {batch_base+1} to {batch_base+batch_run}')
    db.autocommit = False
    r = requests.get(f'{node}/blockchain?minHeight={batch_base+1}&maxHeight={batch_base+batch_run}')
    metas = json.loads(r.text)['result']['block_metas']
    for meta in metas:
        # format
        block = {}
        block['chain_id'] = meta['header']['chain_id']
        block['height'] = meta['header']['height']
        block['time'] = meta['header']['time']
        block['hash'] = meta['block_id']['hash']
        block['num_txs'] = meta['header']['num_txs']

        # store
        #print(json.dumps(block))
        block['time'] = parse(block['time'])
        cur.execute("""
            insert into blocks (chain_id, height, time, hash, num_txs)
            values
            (%(chain_id)s, %(height)s, %(time)s, %(hash)s, %(num_txs)s)""",
            (block))
    db.commit()
    run -= len(metas)
    batch_base += len(metas)

# update stat

# closing
cur.close()
db.close()
