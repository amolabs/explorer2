#!/bin/bash

usage() {
    echo "syntax: $0 [options] <node_rpc_addr> <chain_id>"
    echo "options:"
    echo "  -h  print usage"
}

while getopts "h" arg; do
  case $arg in
    h | *)
      usage
      exit
      ;;
  esac
done

NODE_ADDR=$1
CHAIN_ID=$2
if [ -z "$NODE_ADDR" -o -z "$CHAIN_ID" ]; then
    usage
    exit
fi

echo "node addr    = $NODE_ADDR"
echo "chain id     = $CHAIN_ID"

amo-crawler-collector --node $NODE_ADDR --limit 0
amo-crawler-builder --chain $CHAIN_ID --limit 0
