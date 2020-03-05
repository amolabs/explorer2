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
    my_last_height = int(chain_summary['height'])
else:
    my_last_height = 0
print('fetched currnet explorer status')

# get node status
r = requests.get(f'{node}/status')
dat = json.loads(r.text)
target_last_height = int(dat['result']['sync_info']['latest_block_height'])
#print(dat['result']['node_info']['network'])
print('fetched target node status')

# figure out
print(f'currnet explorer status: {my_last_height}')
print(f'target node status: {target_last_height}')
limit = args.limit
if limit > 0:
    run = min(target_last_height - my_last_height, limit)
else:
    run = target_last_height - my_last_height

# collect
db.autocommit = False

#r = requests.get(f'{node}/blockchain?minHeight={my_last_height+1}&maxHeight={my_last_height+run}')
#metas = json.loads(r.text)['result']['block_metas']
#print(json.dumps(dat, indent=2))
#exit(0)
for h in range(my_last_height+1, my_last_height+1+run):
    # retrieve block
    r = requests.get(f'{node}/block?height={h}')
    dat = json.loads(r.text)
    meta = dat['result']['block_meta']
    #print(json.dumps(meta))
    block = {}
    block['chain_id'] = meta['header']['chain_id']
    block['height'] = meta['header']['height']
    block['time'] = meta['header']['time']
    block['hash'] = meta['block_id']['hash']
    block['num_txs'] = meta['header']['num_txs']

    #print(block['chain_id'], block['height'], block['time'])
    #print(json.dumps(block))

    block['time'] = parse(block['time'])
    # store
    cur.execute("""
        insert into blocks (chain_id, height, time, hash, num_txs)
        values
        (%(chain_id)s, %(height)s, %(time)s, %(hash)s, %(num_txs)s)""",
        (block))
db.commit()
cur.close()

# update stat

# closing
db.close()
