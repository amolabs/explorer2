#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# vim: set sw=4 ts=4 expandtab :

import argparse
import json

import mysql.connector
from mysql.connector import Error

import collector
import filelock
from builder import Builder

# local config
dbconfigfile = '../db/config.json'

BATCH_SIZE = 100

# command line args
p = argparse.ArgumentParser('AMO blockchain explorer builder')
p.add_argument("-n", "--node", help="rpc node address to connect",
               type=str)
p.add_argument("-c", "--chain", help="chain id to build state db",
               type=str)
p.add_argument("-l", "--limit", help="limit number of blocks to collect",
               type=int, default=100)
p.add_argument("-r", "--rebuild", help="rebuild state db",
               default=False, dest='rebuild', action='store_true')
p.add_argument("-v", "--verbose", help="verbose output",
               default=False, dest='verbose', action='store_true')
p.add_argument("-f", "--force", help="force-run even if there is a lock",
               default=False, dest='force', action='store_true')
p.add_argument("--build-only", help="do not collect, only build state",
               default=False, dest='build_only', action='store_true')
args = p.parse_args()

try:
    lock = filelock.acquire()
except Exception:
    if not args.force:
        print('lock file exists. exiting.')
        exit(-1)
    lock = filelock.ignore_acquire()

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
        port=dbconfig.get('port', 3306),
        user=dbconfig['user'],
        password=dbconfig['password'],
        database=dbconfig['database'],
    )
except Error as e:
    print("DB connection error", e)
    exit(-1)
else:
    print("DB connected")

if args.node and not args.build_only:
    collector = collector.Collector(args.node, db)
    if args.rebuild:
        collector.clear()

    if args.limit > 0:
        l = min(args.limit, collector.remote_height - collector.height)
    else:
        l = collector.remote_height - collector.height
    while l > 0:
        batch = min(l, BATCH_SIZE)
        # collect
        if args.verbose:
            collector.stat()
        collector.play(batch)
        if args.verbose:
            collector.stat()
        # build
        builder = Builder(collector.chain_id, db)
        if args.verbose:
            builder.stat()
        if builder.play(0) == False:
            print('Fail')
            break
        if args.verbose:
            builder.stat()
        l -= batch

if args.chain and args.build_only:
    chain_id = args.chain
    builder = Builder(chain_id, db)
    cur = db.cursor()
    cur.execute("""SELECT height FROM `c_blocks`
        WHERE (`chain_id` = %(chain_id)s)
        ORDER BY `height` DESC
        LIMIT 1
        """,
        {'chain_id': chain_id})
    row = cur.fetchone()
    if row:
        dest = row[0]
    else:
        exit(0)
    cur.close()
    if args.rebuild:
        builder.clear()
    run_size = dest - builder.height
    if args.limit > 0:
        run_size = min(run_size, args.limit)
    if args.verbose:
        builder.stat()
    if builder.play(run_size) == False:
        print('Fail')
    if args.verbose:
        builder.stat()

db.close()
filelock.release(lock)
