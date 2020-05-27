#!/bin/bash

SERVICE_NAME=amo-api-server.service

# copy server/
rm -rf /root/amo-api-server
cp -rf server/ /root/amo-api-server

# prepare service
cp -f server.service.in /etc/systemd/system/$SERVICE_NAME

# enable service
systemctl enable $SERVICE_NAME
