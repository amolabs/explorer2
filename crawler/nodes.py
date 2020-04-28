#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# vim: set sw=4 ts=4 expandtab :

import argparse
import json
import socket
import requests as r
from datetime import timezone
from dateutil.parser import parse as dateparse

import dbproxy

REQUEST_TIMEOUT = 1 

def neighbors(addr):
    try:
        #print(f'collecting neighbors from {addr}')
        print('.', end='', flush=True)
        res = r.get(url=f'http://{addr}/net_info', timeout=REQUEST_TIMEOUT)
    except Exception:
        return []
    peers = json.loads(res.text)['result']['peers']
    ps = []
    for p in peers:
        tcp_addr = p['node_info']['listen_addr'].split('tcp://')[1]
        ip = tcp_addr.split(':')[0]
        rpc_addr = p['node_info']['other']['rpc_address'].split('tcp://')[1]
        port = rpc_addr.split(':')[1]
        ps.append(f'{ip}:{port}')
    return ps


def peek(addr):
    try:
        #print(f'collecting information from {addr}')
        print('.', end='', flush=True)
        res = r.get(url=f'http://{addr}/status', timeout=REQUEST_TIMEOUT)
    except Exception:
        return {}
    node = json.loads(res.text)['result']
    return node


def expand(node):
    tcp_addr = node['node_info']['listen_addr'].split('tcp://')[1]
    ip_addr = tcp_addr.split(':')[0]
    rpc_port = node['node_info']['other']['rpc_address'].split(
        'tcp://')[1].split(':')[1]
    lbt = dateparse(node['sync_info']['latest_block_time']) .astimezone(tz=timezone.utc)

    # to load on db
    node['chain_id'] = node['node_info']['network']
    node['val_addr'] = node['validator_info']['address']
    node['moniker'] = node['node_info']['moniker']
    node['latest_block_height'] = node['sync_info']['latest_block_height']
    node['latest_block_time'] = lbt
    node['catching_up'] = node['sync_info']['catching_up']

    # to print
    node['rpc_addr'] = f'http://{ip_addr}:{rpc_port}'
    node['catching_up_sign'] = '+' if node['sync_info']['catching_up'] else ' '
    node['p2p_addr'] = node['node_info']['id'] + '@' + tcp_addr
    node['voting_power'] = node['validator_info']['voting_power']

    # clean-up
    del node['node_info']
    del node['validator_info']
    del node['sync_info']

    return node

def print_nodes(nodes):
    # this is just for neat display
    clen = 0
    mlen = 0
    alen = 0
    monikers = {}
    for _, n in nodes.items():
        clen = max(clen, len(n['chain_id']))
        mlen = max(mlen, len(n['moniker']))
        alen = max(alen, len(n['rpc_addr']))
        monikers[n['chain_id'] + '_' + n['moniker']] = n
    
    print()
    for k in sorted(monikers.keys()):
        n = monikers[k]
        print(f'{n["chain_id"]:{clen}}', end=' ', flush=True)
        print(f'{n["moniker"]:{mlen}}', end=' ', flush=True)
        print(f'{n["rpc_addr"]:{alen}}', end=' ', flush=True)
        print(f'{n["latest_block_height"]:>7}', end=' ', flush=True)
        print(f'{n["n_peers"]:>3}', end=' ', flush=True)
        print(f'{n["catching_up_sign"]}', end=' ', flush=True)
        print(f'{n["voting_power"]:>{20}}', flush=True)

def update_nodes(db, nodes):
    if len(nodes) == 0:
        return

    cur = db.cursor()

    # purge first
    cur.execute("""DELETE FROM `s_nodes`""")
    cur.execute("""OPTIMIZE TABLE `s_nodes`""")
    cur.fetchall()

    # then, insert
    for _, n in nodes.items():
        cur.execute("""
            INSERT INTO `s_nodes`
                (`chain_id`, `val_addr`, `moniker`,
                 `latest_block_time`, `latest_block_height`,
                 `catching_up`, `n_peers`)
            VALUES
                (%(chain_id)s, %(val_addr)s, %(moniker)s,
                 %(latest_block_time)s, %(latest_block_height)s,
                 %(catching_up)s, %(n_peers)s)
            """,
            n)

    db.commit()
    cur.close()

if __name__ == '__main__':
    # command line args
    p = argparse.ArgumentParser('AMO blockchain node inspector')
    p.add_argument('node', type=str, nargs='+')
    
    args = p.parse_args()

    # db connection
    db = dbproxy.connect_db()
    if db == None:
        exit(-1)

    cands = []
    for n in args.node:
        host, port = n.split(':')
        ip = socket.gethostbyname(host)
        n_addr = f'{ip}:{port}'
        cands.append(n_addr)

    nodes = {}
    
    print('collecting', end='', flush=True)
    # initial nodes
    while cands:
        n = cands.pop()
        if n not in nodes:
            peek_n = peek(n)
            if peek_n == {}:  # when cannot reach to node behind firewall via rpc
                continue
            nodes[n] = expand(peek_n)
        peers = neighbors(n)
        nodes[n]["n_peers"] = len(peers)
        for n in peers:
            if n not in nodes and n not in cands:
                cands.append(n)

    print_nodes(nodes) 
    update_nodes(db, nodes)
