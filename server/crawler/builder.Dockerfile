# vim: set expandtab:

# base image
FROM python:3.8.3-alpine3.11

# set working dir
WORKDIR /app

# copy necessary elements
COPY builder.py dbproxy.py block.py tx.py models.py stats.py util.py error.py /app/
COPY DOCKER/builder/requirements.txt /app/
COPY DOCKER/builder/docker-entrypoint.sh /usr/bin/

# install requirements.txt
RUN pip3 install -r requirements.txt

# set volumes
VOLUME /db/
VOLUME /var/tmp/

# run app
CMD ["docker-entrypoint.sh"]
