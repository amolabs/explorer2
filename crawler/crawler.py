#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# vim: set sw=4 ts=4 expandtab :

import json
import argparse
import mysql.connector
from mysql.connector import Error
from datetime import timezone

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
    collector = collector.Collector(node, db)
    if args.rebuild:
        collector.clear()
    collector.stat()
    collector.play(args.limit)
    collector.stat()

if args.chain:
    builder = builder.Builder(args.chain, db)
    if args.rebuild:
        builder.clear()
    builder.stat()
    if builder.play(args.limit) == False:
        print('Fail')
        exit(0)
    builder.stat()

db.close()
