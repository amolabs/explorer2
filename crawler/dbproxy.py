# -*- coding: utf-8 -*-
# vim: set sw=4 ts=4 expandtab :

import json
import os

import mysql.connector
from mysql.connector import Error as DBError

c_tables = ['c_genesis', 'c_txs', 'c_blocks']
s_tables = ['s_protocol', 's_accounts', 's_udcs',
            's_incentives', 's_penalties',
            's_drafts', 's_storages', 's_udc_balances',
            's_votes', 's_parcels', 's_requests', 's_usages']


def connect_db():
    # read config
    config_dir = os.path.dirname(os.path.abspath(__file__)) + '/../db'
    dbconfigfile = config_dir + '/config.json'
    # print(dbconfigfile)
    try:
        f = open(dbconfigfile, "r")
        cfg = json.load(f)
        dbconfig = cfg['db']
    except OSError as e:
        print("Unable to read DB config:", e)
        return None
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
    except DBError as e:
        print("DB connection error", e)
        return None
    else:
        print("DB connected")
        return db
