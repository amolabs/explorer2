#!/bin/sh

if [ -z "$TARGET_ADDRS" -o -z "$CHAIN_ID" ]; then
    echo "Environment variable 'TARGET_ADDRS' or 'CHAIN_ID' is not given"
    exit 1
fi

if [ -z "$REFRESH_INTERVAL" ]; then
    REFRESH_INTERVAL=1800
fi

if [ -z "$COLLECT_INTERVAL" ]; then
    COLLECT_INTERVAL=10
fi

echo "target addrs     = $TARGET_ADDRS"
echo "chain id         = $CHAIN_ID"
echo "refresh interval = $REFRESH_INTERVAL"
echo "collect interval = $COLLECT_INTERVAL"

/app/nodes.py --chain $CHAIN_ID --targets $TARGET_ADDRS -rit $REFRESH_INTERVAL -cit $COLLECT_INTERVAL
