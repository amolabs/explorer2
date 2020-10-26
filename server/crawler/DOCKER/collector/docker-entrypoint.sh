#!/bin/sh

if [ -z "$NODE_ADDR" ]; then
    echo "Environment variable 'NODE_ADDR' is not given"
    exit 1
fi

echo "node addr        = $NODE_ADDR"

/app/collector.py --node $NODE_ADDR --limit 0
