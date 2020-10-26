#!/bin/sh

if [ -z "$CHAIN_ID" ]; then
    echo "Environment variable 'CHAIN_ID' is not given"
    exit 1
fi

echo "chain id = $CHAIN_ID"

/app/builder.py --chain $CHAIN_ID --limit 0
