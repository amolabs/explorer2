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
import collector
import builder

# local config
dbconfigfile = '../db/config.json'

# command line args
p = argparse.ArgumentParser('AMO blockchain explorer builder')
p.add_argument("-n", "--node", help="rpc node address to connect",
        type=str)
p.add_argument("-l", "--limit", help="limit number of blocks to collect",
        type=int, default=100)
p.add_argument("-c", "--chain", help="chain id to build state db",
        type=str)
p.add_argument("-r", "--rebuild", help="rebuild state db",
        default=False, dest='rebuild', action='store_true')
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

if args.node:
    cur = db.cursor()
    s = requests.Session()

    # get node status
    r = s.get(f'{node}/status')
    dat = json.loads(r.text)
    target_height = int(dat['result']['sync_info']['latest_block_height'])
    #print(dat['result']['node_info']['network'])
    print(f'target remote height: {target_height}')
    chain_id = dat['result']['node_info']['network']

    # get current explorer state
    cur.execute("""SELECT `height` FROM `c_blocks` 
        WHERE (`chain_id` = %(chain_id)s)
        ORDER BY `height` DESC LIMIT 1""",
        {'chain_id': chain_id})
    row = cur.fetchone()
    if row:
        #print(row)
        b = dict(zip(cur.column_names, row))
        last_height = int(b['height'])
    else:
        last_height = 0
    print(f'currnet explorer height: {last_height}')

    # check genesis
    cur.execute("""
        SELECT COUNT(*) FROM `c_genesis` WHERE (`chain_id` = %(chain_id)s)
        """,
        {'chain_id': chain_id})
    row = cur.fetchone()
    if row[0] == 0:
        r = s.get(f'{node}/genesis')
        dat = json.loads(r.text)
        genesis = json.dumps(dat['result']['genesis'])
        cur.execute("""
            INSERT INTO `c_genesis`
                (`chain_id`, `genesis`)
            VALUES
                (%(chain_id)s, %(genesis)s)
            """,
            {'chain_id': chain_id, 'genesis': genesis})
        db.commit()

    # figure out
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
        block_id, block_raw, txs_results = collector.block(s, node, h)
        block_header = block_raw['header']
        tx_bodies = block_raw['data']['txs']
        block = amo.Block(block_header['chain_id'], block_header['height'])
        block.set_meta(block_id, block_header)
        block.save(cur)
        num = 0
        num_valid = 0
        num_invalid = 0
        for i in range(len(tx_bodies) if tx_bodies else 0):
            body = tx_bodies[i]
            result = txs_results[i]
            tx = amo.Tx(block.chain_id, block.height, i)
            tx.parse_body(body)
            tx.set_result(result)
            if result['code'] == 0:
                num_valid += 1
            else:
                num_invalid += 1
            num += 1
            tx.save(cur)

        if num_valid > 0 or num_invalid > 0:
            block.num_txs = num
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

if args.chain:
    cur = db.cursor()
    builder = builder.Builder(args.chain, cur)
    if args.rebuild:
        builder.clear(cur)
    db.commit()
    builder.stat()
    if builder.play(cur, args.limit) == False:
        print('Fail')
        exit(0)
    db.commit()
    builder.stat()

db.close()
