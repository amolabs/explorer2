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

SERVICE_NAME=amo-crawler-$CHAIN_ID.service

echo "service name = $SERVICE_NAME"
echo "node addr    = $NODE_ADDR"
echo "chain id     = $CHAIN_ID"

# copy crawler/
rm -rf /root/amo-crawler
cp -f crawler/ /root/amo-crawler

# make symbolic link
ln -sf /root/amo-crawler/collector.py /usr/local/bin/amo-crawler-collector
ln -sf /root/amo-crawler/builder.py /usr/local/bin/amo-crawler-builder

# copy crawler_run.sh
cp -f crawler_run.sh /root/amo_crawler_run.sh

# prepare service
cp -f crawler.service.in $SERVICE_NAME 
sed -e s#@node_addr@#$NODE_ADDR# -i.tmp $SERVICE_NAME
sed -e s#@chain_id@#$CHAIN_ID# -i.tmp $SERVICE_NAME
mv $SERVICE_NAME /etc/systemd/system/$SERVICE_NAME

# enable service
systemctl enable $SERVICE_NAME

# clean-up
rm -f *.tmp
