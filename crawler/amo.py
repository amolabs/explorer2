# -*- coding: utf-8 -*-
# vim: set sw=4 ts=4 expandtab :

import json
import base64
from datetime import timezone
from dateutil.parser import parse as dateparse
import hashlib

import tx

class Block:
    """form a block"""
    def __init__(self, chain_id, height):
        self.chain_id = chain_id
        self.height = int(height)

    def _vars(self):
        v = vars(self).copy()
        del v['txs']
        del v['txs_results']
        v['validator_updates'] = json.dumps(v['validator_updates'])
        return v

    def read(self, raw):
        self.hash = raw['block_id']['hash'] if 'block_id' in raw else ''
        header = raw['block']['header']
        self.time = dateparse(header['time']) .astimezone(tz=timezone.utc)
        self.proposer = header['proposer_address']
        self.txs = raw['block']['data']['txs']

    def read_meta(self, raw):
        self.hash = raw['block_id']['hash'] if 'block_id' in raw else ''
        header = raw['header']
        self.time = dateparse(header['time']) .astimezone(tz=timezone.utc)
        self.proposer = header['proposer_address']
        self.num_txs = int(raw['num_txs'])
        self.txs = []
        self.txs_results = []
        self.incentives = '[]' # hmmm...
        self.validator_updates = []

    def read_results(self, raw):
        self.txs_results = raw['txs_results']
        self.validator_updates = raw['validator_updates']
        if self.validator_updates == None:
            self.validator_updates = []

    def set_meta(self, blk_id, blk_header):
        self.time = dateparse(blk_header['time']).astimezone(tz=timezone.utc)
        self.hash = blk_id['hash']
        #self.num_txs = blk_header['num_txs']
        self.proposer = blk_header['proposer_address']

    """cursor: db cursor"""
    def save(self, cursor):
        dt = self.time.astimezone(tz=timezone.utc)
        self.time = dt.replace(tzinfo=None).isoformat()
        self.interval = 0
        if self.height <= 2:
            self.interval = 0
        else:
            cursor.execute(f"""
                SELECT `time` FROM `c_blocks`
                WHERE (`chain_id` = %(chain_id)s AND `height` = %(height)s - 1)""",
                self._vars())
            row = cursor.fetchone()
            # TODO exception handling
            prev = row[0].replace(tzinfo=timezone.utc)
            self.interval = (dt - prev).total_seconds()
        cursor.execute("""
            INSERT INTO `c_blocks`
                (`chain_id`, `height`, `time`, `hash`,
                    `interval`, `proposer`, `incentives`, `validator_updates`)
            VALUES
                (%(chain_id)s, %(height)s, %(time)s, %(hash)s,
                %(interval)s, %(proposer)s,
                %(incentives)s, %(validator_updates)s)
            """,
            self._vars())

    def update_num_txs(self, cursor):
        cursor.execute("""
            UPDATE `c_blocks` SET
                `num_txs` = %(num_txs)s,
                `num_txs_valid` = %(num_txs_valid)s,
                `num_txs_invalid` = %(num_txs_invalid)s
            WHERE
                `chain_id` = %(chain_id)s and `height` = %(height)s
            """,
            self._vars())

class Tx:
    """form a tx"""
    def __init__(self, chain_id, height, index):
        self.chain_id = chain_id
        self.height = height
        self.index = index

    def _vars(self):
        v = vars(self).copy()
        return v

    def parse_body(self, body):
        b = base64.b64decode(body)
        self.tx_bytes = len(b)
        self.hash = hashlib.sha256(b).hexdigest().upper()
        self.body = body
        parsed = json.loads(b)
        self.type = parsed['type']
        self.sender = parsed['sender']
        self.fee = int(parsed['fee'])
        self.last_height = int(parsed['last_height'])
        self.payload = json.dumps(parsed['payload'])

    def set_result(self, result):
        self.code = result['code']
        self.info = result['info']

    def read(self, d):
        self.type = d['type']
        self.sender = d['sender']
        self.fee = int(d['fee'])
        self.last_height = int(d['last_height'])
        self.payload = d['payload']
        #self.payload_parsed = json.loads(d['payload'])
        self.code = d['code']
        self.info = d['info']

    def play(self, cursor):
        if self.code is not 0:
            #print('tx code is non-zero (invalid)')
            return
        tx.processor.get(self.type, tx.unknown)(self, cursor)

    """Save to DB

    :param cursor: db cursor opened with conn.cursor()
    """
    def save(self, cursor):
        cursor.execute("""
            INSERT INTO `c_txs`
                (`chain_id`, `height`, `index`, `hash`, `tx_bytes`,
                `code`, `info`,
                `type`, `sender`, `fee`, `last_height`, `payload`)
            VALUES
                (%(chain_id)s, %(height)s, %(index)s, %(hash)s, %(tx_bytes)s,
                %(code)s, %(info)s,
                %(type)s, %(sender)s, %(fee)s, %(last_height)s, %(payload)s
                )
            """,
            self._vars())
