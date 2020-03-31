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

BLOCK_LIMIT_THRESHOLD = 100

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
p.add_argument("-il", "--ignore-lock", help="If this flag is enabled, delete lock file and force start", default=False)
args = p.parse_args()
node = args.node

try:
    lock = filelock.acquire()
except Exception:
    if not args.ignore_lock:
        raise
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

if args.node:
    collector = collector.Collector(node, db)
    if args.rebuild:
        collector.clear()

    target = [int(args.limit / BLOCK_LIMIT_THRESHOLD), args.limit % BLOCK_LIMIT_THRESHOLD]
    limited = args.limit != 0

    while True:
        run_limit = BLOCK_LIMIT_THRESHOLD

        if limited:
            if target[0] > 0:
                target[0] -= 1
            elif target[1] != 0:
                run_limit = target[1]
                target[1] = 0
            else:
                break

        if args.verbose:
            collector.stat()
        collector.play(run_limit)
        if args.verbose:
            collector.stat()

        if args.chain:
            builder = Builder(args.chain, db)
            if args.rebuild:
                builder.clear()
            if args.verbose:
                builder.stat()
            if builder.play(min(args.limit, run_limit)) == False:
                print('Fail')
                break
            if args.verbose:
                builder.stat()

        if collector.height == collector.remote_height:
            break

db.close()
filelock.release(lock)
