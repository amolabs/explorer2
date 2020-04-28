#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# vim: set sw=4 ts=4 expandtab :

import argparse
import json
import socket
import requests as r

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
    node['moniker'] = node['node_info']['moniker']
    tcp_addr = node['node_info']['listen_addr'].split('tcp://')[1]
    node['p2p_addr'] = node['node_info']['id'] + '@' + tcp_addr
    ip_addr = tcp_addr.split(':')[0]
    rpc_port = node['node_info']['other']['rpc_address'].split(
        'tcp://')[1].split(':')[1]
    node['rpc_addr'] = f'http://{ip_addr}:{rpc_port}'
    node['catching_up_sign'] = '+' if node['sync_info']['catching_up'] else ' '
    node['voting_power'] = node['validator_info']['voting_power']
    return node

def print_nodes(nodes):
    # this is just for neat display
    mlen = 0
    alen = 0
    monikers = {}
    for _, n in nodes.items():
        expand(n)
        mlen = max(mlen, len(n['moniker']))
        alen = max(alen, len(n['rpc_addr']))
        monikers[n['moniker']] = n
    
    print()
    for k in sorted(monikers.keys()):
        n = monikers[k]
        print(
            f'{k:{mlen}} {n["rpc_addr"]:{alen}} {n["sync_info"]["latest_block_height"]:>7} {n["n_peers"]:>3} {n["catching_up_sign"]} {n["voting_power"]:>{20}}'
        )

if __name__ == '__main__':
    # command line args
    p = argparse.ArgumentParser('AMO blockchain node inspector')
    p.add_argument('node', type=str, nargs='+')
    
    args = p.parse_args()
    
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
            nodes[n] = peek_n
        peers = neighbors(n)
        nodes[n]["n_peers"] = len(peers)
        for n in peers:
            if n not in nodes and n not in cands:
                cands.append(n)
    
    print_nodes(nodes) 
