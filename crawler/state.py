# -*- coding: utf-8 -*-
# vim: set sw=4 ts=4 expandtab :

def unknown(tx, cursor):
    print('unknown');

def transfer(tx, cursor):
    print(tx.type)

processor = {
        'transfer': transfer,
        }
