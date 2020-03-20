# -*- coding: utf-8 -*-
# vim: set sw=4 ts=4 expandtab :

import json
import base64
from datetime import timezone
from dateutil.parser import parse as dateparse
import hashlib

class Block:
    """form a block"""
    def __init__(self, chain_id, height):
        self.chain_id = chain_id
        self.height = height

    def set_meta(self, meta):
        self.time = dateparse(
                meta['header']['time']).astimezone(tz=timezone.utc)
        self.hash = meta['block_id']['hash']
        self.num_txs = int(meta['header']['num_txs'])
        self.proposer = meta['header']['proposer_address']

    """cursor: db cursor"""
    def save(self, cursor):
        dt = self.time.astimezone(tz=timezone.utc)
        self.time = dt.replace(tzinfo=None).isoformat()
        self.interval = 0
        if self.height == 1:
            self.interval = 0
        else:
            cursor.execute(f"""SELECT `time` FROM `blocks`
                WHERE `height` = {self.height - 1}""")
            row = cursor.fetchone()
            # TODO exception handling
            prev = row[0].replace(tzinfo=timezone.utc)
            self.interval = (dt - prev).total_seconds()
        cursor.execute("""
            INSERT INTO `blocks`
                (`chain_id`, `height`, `time`, `hash`, `num_txs`,
                    `interval`, `proposer`)
            VALUES
                (%(chain_id)s, %(height)s, %(time)s, %(hash)s, %(num_txs)s,
                %(interval)s, %(proposer)s)
            """,
            (vars(self)))

    def update(self, cursor):
        cursor.execute("""
            UPDATE `blocks` SET
                `num_txs_valid` = %(num_txs_valid)s,
                `num_txs_invalid` = %(num_txs_invalid)s
            WHERE
                `chain_id` = %(chain_id)s and `height` = %(height)s
            """,
            (vars(self)))

class Tx:
    """form a tx"""
    def __init__(self, chain_id, height, index):
        self.chain_id = chain_id
        self.height = height
        self.index = index

    def set_body(self, body):
        b = base64.b64decode(body)
        self.hash = hashlib.sha256(b).hexdigest().upper()
        self.body = body
        parsed = json.loads(b)
        self.type = parsed['type']
        self.sender = parsed['sender']
        self.fee = int(parsed['fee'])
        self.payload = json.dumps(parsed['payload'])

    def set_result(self, result):
        self.code = result['code']
        self.info = result['info']

    """Save to DB

    :param cursor: db cursor opened with conn.cursor()
    """
    def save(self, cursor):
        cursor.execute("""
            INSERT INTO `txs`
                (`chain_id`, `hash`, `height`, `index`, `code`, `info`,
                `type`, `sender`, `fee`, `payload`)
            VALUES
                (%(chain_id)s, %(hash)s,
                %(height)s, %(index)s, %(code)s, %(info)s,
                %(type)s, %(sender)s, %(fee)s, %(payload)s
                )
            """,
            (vars(self)))

