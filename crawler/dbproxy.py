# -*- coding: utf-8 -*-
# vim: set sw=4 ts=4 expandtab :

import json
import os

import mysql.connector
from mysql.connector import Error as DBError


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
