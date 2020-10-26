#!/bin/sh

if [ -z "$NODE_ADDR" ]; then
    echo "Environment variable 'NODE_ADDR' is not given"
    exit 1
fi

echo "node addr        = $NODE_ADDR"

./collector.py --node $NODE_ADDR --limit 0 &
status=$?
if [ $status -ne 0 ]; then
    echo "Failed to start collector.py: $status"
    exit $status
fi
