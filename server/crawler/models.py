# -*- coding: utf-8 -*-
# vim: set sw=4 ts=4 expandtab :

import json


class Account:
    def __init__(self, dbs, chain_id, address, cursor):
        self.dbs = dbs
        self.chain_id = chain_id
        self.address = address
        self.balance = 0
        self.stake = 0
        self.stake_locked = 0 # stake_unlocked = stake - stake_locked
        self.eff_stake = 0
        self.val_addr = None
        self.val_pubkey = None
        self.val_power = 0
        self.delegate = 0
        self.del_addr = None
        cursor.execute(
            f"""
            SELECT * FROM `{self.dbs['builder']}`.`s_accounts`
            WHERE (`chain_id` = %(chain_id)s AND `address` = %(address)s)
            """, self._vars())
        row = cursor.fetchone()
        if row:
            d = dict(zip(cursor.column_names, row))
            self.balance = int(d['balance'])
            self.stake = int(d['stake'])
            self.stake_locked = int(d['stake_locked'])
            self.eff_stake = int(d['eff_stake'])
            self.val_addr = d['val_addr']
            self.val_pubkey = d['val_pubkey']
            self.val_power = int(d['val_power'])
            self.delegate = int(d['delegate'])
            self.del_addr = d['del_addr']
        else:
            cursor.execute(
                f"""
                INSERT INTO `{self.dbs['builder']}`.`s_accounts`
                    (`chain_id`, `address`)
                VALUES
                    (%(chain_id)s, %(address)s)
                """, self._vars())

    def _vars(self):
        v = vars(self).copy()
        del v['dbs']
        v['balance'] = str(v['balance'])
        v['stake'] = str(v['stake'])
        v['stake_locked'] = str(v['stake_locked'])
        v['eff_stake'] = str(v['eff_stake'])
        v['delegate'] = str(v['delegate'])
        v['val_power'] = str(v['val_power'])
        return v

    def save(self, cursor):
        cursor.execute(
            f"""
            UPDATE `{self.dbs['builder']}`.`s_accounts`
            SET
                `balance` = %(balance)s,
                `stake` = %(stake)s,
                `stake_locked` = %(stake_locked)s,
                `eff_stake` = %(eff_stake)s,
                `val_addr` = %(val_addr)s,
                `val_pubkey` = %(val_pubkey)s,
                `val_power` = %(val_power)s,
                `delegate` = %(delegate)s,
                `del_addr` = %(del_addr)s
            WHERE (`chain_id` = %(chain_id)s AND `address` = %(address)s)
            """, self._vars())


class Storage:
    def __init__(self, dbs, chain_id, storage_id, owner, cursor):
        self.dbs = dbs
        self.chain_id = chain_id
        self.storage_id = storage_id
        self.owner = owner
        self.url = ''
        self.registration_fee = 0
        self.hosting_fee = 0
        self.active = False
        cursor.execute(
            f"""
            SELECT * FROM `{self.dbs['builder']}`.`s_storages`
            WHERE (`chain_id` = %(chain_id)s AND `storage_id` = %(storage_id)s)
            """, self._vars())
        row = cursor.fetchone()
        if row:
            d = dict(zip(cursor.column_names, row))
            self.owner = d['owner']
            self.url = d['url']
            self.registration_fee = int(d['registration_fee'])
            self.hosting_fee = int(d['hosting_fee'])
            self.active = bool(d['active'])
        else:
            cursor.execute(
                f"""
                INSERT INTO `{self.dbs['builder']}`.`s_storages`
                    (`chain_id`, `storage_id`, `owner`)
                VALUES (%(chain_id)s, %(storage_id)s, %(owner)s)
                """, self._vars())

    def _vars(self):
        v = vars(self).copy()
        del v['dbs']
        v['registration_fee'] = str(v['registration_fee'])
        v['hosting_fee'] = str(v['hosting_fee'])
        v['active'] = str(int(v['active'] == True))
        return v

    def save(self, cursor):
        cursor.execute(
            f"""
            UPDATE `{self.dbs['builder']}`.`s_storages`
            SET
                `owner` = %(owner)s,
                `url` = %(url)s,
                `registration_fee` = %(registration_fee)s,
                `hosting_fee` = %(hosting_fee)s,
                `active` = %(active)s
            WHERE (`chain_id` = %(chain_id)s AND `storage_id` = %(storage_id)s)
            """, self._vars())


class Parcel:
    def __init__(self, dbs, chain_id, parcel_id, owner, cursor):
        self.dbs = dbs
        self.chain_id = chain_id
        self.parcel_id = parcel_id[:72] if len(parcel_id) > 72 else parcel_id
        self.storage_id = int(parcel_id[:8], 16)
        self.owner = owner  # FK
        self.custody = ''
        self.proxy_account = None
        self.extra = '{}'
        self.on_sale = False
        cursor.execute(
            f"""
            SELECT * FROM `{self.dbs['builder']}`.`s_parcels`
            WHERE (`chain_id` = %(chain_id)s AND `parcel_id` = %(parcel_id)s)
            """, self._vars())
        row = cursor.fetchone()
        if row:
            d = dict(zip(cursor.column_names, row))
            self.owner = d['owner']
            self.custody = d['custody']
            self.proxy_account = d['proxy_account']
            self.extra = d.get('extra', '{}')
            self.on_sale = d['on_sale']
        else:
            cursor.execute(
                f"""
                INSERT INTO `{self.dbs['builder']}`.`s_parcels`
                    (`chain_id`, `parcel_id`, `storage_id`, `owner`)
                VALUES (%(chain_id)s, %(parcel_id)s, %(storage_id)s, %(owner)s)
                """, self._vars())

    def _vars(self):
        v = vars(self).copy()
        del v['dbs']
        return v

    def save(self, cursor):
        cursor.execute(
            f"""
            UPDATE `{self.dbs['builder']}`.`s_parcels`
            SET
                `storage_id` = %(storage_id)s,
                `custody` = %(custody)s,
                `proxy_account` = %(proxy_account)s,
                `extra` = %(extra)s,
                `on_sale` = %(on_sale)s
            WHERE (`chain_id` = %(chain_id)s AND `parcel_id` = %(parcel_id)s)
            """, self._vars())


class Request:
    def __init__(self, dbs, chain_id, parcel_id, buyer, cursor):
        self.dbs = dbs
        self.chain_id = chain_id
        self.parcel_id = parcel_id
        self.buyer = buyer
        self.payment = 0
        self.dealer = None
        self.dealer_fee = 0
        self.extra = '{}'
        cursor.execute(
            f"""
            SELECT * FROM `{self.dbs['builder']}`.`s_requests`
            WHERE (`chain_id` = %(chain_id)s
                AND `parcel_id` = %(parcel_id)s
                AND `buyer` = %(buyer)s)
            """, self._vars())
        row = cursor.fetchone()
        if row:
            d = dict(zip(cursor.column_names, row))
            self.payment = int(d.get('payment'))
            self.dealer = d.get('dealer', None)
            self.dealer_fee = int(d.get('dealer_fee'))
            self.extra = d.get('extra', '{}')
        else:
            cursor.execute(
                f"""
                INSERT INTO `{self.dbs['builder']}`.`s_requests`
                    (`chain_id`, `parcel_id`, `buyer`)
                VALUES (%(chain_id)s, %(parcel_id)s, %(buyer)s)
                """, self._vars())
        
    def _vars(self):
        v = vars(self).copy()
        del v['dbs']
        v['payment'] = str(v['payment'])
        v['dealer_fee'] = str(v['dealer_fee'])
        return v

    def save(self, cursor):
        cursor.execute(
            f"""
            UPDATE `{self.dbs['builder']}`.`s_requests`
            SET
                `payment` = %(payment)s,
                `dealer` = %(dealer)s,
                `dealer_fee` = %(dealer_fee)s,
                `extra` = %(extra)s
            WHERE (`chain_id` = %(chain_id)s
                AND `parcel_id` = %(parcel_id)s
                AND `buyer` = %(buyer)s)
            """, self._vars())

    def delete(self, cursor):
        cursor.execute(
            f"""
            DELETE FROM `{self.dbs['builder']}`.`s_requests`
            WHERE (`chain_id` = %(chain_id)s
                AND `parcel_id` = %(parcel_id)s
                AND `buyer` = %(buyer)s)
            """, self._vars())


class Usage:
    def __init__(self, dbs, chain_id, parcel_id, grantee, cursor):
        self.dbs = dbs
        self.chain_id = chain_id
        self.parcel_id = parcel_id
        self.grantee = grantee
        self.custody = ''
        self.extra = '{}'
        cursor.execute(
            f"""
            SELECT * FROM `{self.dbs['builder']}`.`s_usages`
            WHERE (`chain_id` = %(chain_id)s
                AND `parcel_id` = %(parcel_id)s
                AND `grantee` = %(grantee)s)
            """, self._vars())
        row = cursor.fetchone()
        if row:
            d = dict(zip(cursor.column_names, row))
            self.custody = d.get('custody')
            self.extra = d.get('extra', '{}')
        else:
            cursor.execute(
                f"""
                INSERT INTO `{self.dbs['builder']}`.`s_usages`
                    (`chain_id`, `parcel_id`, `grantee`)
                VALUES (%(chain_id)s, %(parcel_id)s, %(grantee)s)
                """, self._vars())

    def _vars(self):
        v = vars(self).copy()
        del v['dbs']
        return v

    def save(self, cursor):
        cursor.execute(
            f"""
            UPDATE `{self.dbs['builder']}`.`s_usages`
            SET
                `custody` = %(custody)s,
                `extra` = %(extra)s
            WHERE (`chain_id` = %(chain_id)s
                AND `parcel_id` = %(parcel_id)s
                AND `grantee` = %(grantee)s)
            """, self._vars())

    def delete(self, cursor):
        cursor.execute(
            f"""
            DELETE FROM `{self.dbs['builder']}`.`s_usages`
            WHERE (`chain_id` = %(chain_id)s
                AND `parcel_id` = %(parcel_id)s
                AND `grantee` = %(grantee)s)
            """, self._vars())


class Draft:
    def __init__(self, dbs, chain_id, draft_id, proposer, cursor):
        self.dbs = dbs
        self.chain_id = chain_id
        self.draft_id = draft_id
        self.proposer = proposer  # FK
        cursor.execute(
            f"""
            SELECT * FROM `{self.dbs['builder']}`.`s_drafts`
            WHERE (`chain_id` = %(chain_id)s
                AND `draft_id` = %(draft_id)s)
            """, self._vars())
        row = cursor.fetchone()
        if row:
            d = dict(zip(cursor.column_names, row))
            self.proposer = d['proposer']
            self.config = d['config']
            self.desc = d['desc']
            self.open_count = d['open_count']
            self.close_count = d['close_count']
            self.apply_count = d['apply_count']
            self.deposit = int(d['deposit'])
            self.tally_quorum = int(d['tally_quorum'])
            self.tally_approve = int(d['tally_approve'])
            self.tally_reject = int(d['tally_reject'])
            self.proposed_at = d['proposed_at']
            self.closed_at = d['closed_at']
            self.applied_at = d['applied_at']
        else:
            self.open_count = 0
            self.close_count = 0
            self.apply_count = 0
            self.deposit = 0
            self.tally_quorum = 0
            self.tally_approve = 0
            self.tally_reject = 0
            self.proposed_at = 0
            self.closed_at = 0
            self.applied_at = 0
            cursor.execute(
                f"""
                INSERT INTO `{self.dbs['builder']}`.`s_drafts`
                    (`chain_id`, `draft_id`, `proposer`)
                VALUES (%(chain_id)s, %(draft_id)s, %(proposer)s)
                """, self._vars())

    def _vars(self):
        v = vars(self).copy()
        v['deposit'] = str(v.get('deposit', 0))
        v['tally_quorum'] = str(v.get('tally_quorum', 0))
        v['tally_approve'] = str(v.get('tally_approve', 0))
        v['tally_reject'] = str(v.get('tally_reject', 0))
        v['config'] = json.dumps(v.get('config', {}))
        del v['dbs']
        return v

    def save(self, cursor):
        cursor.execute(
            f"""
            UPDATE `{self.dbs['builder']}`.`s_drafts`
            SET
                `proposer` = %(proposer)s,
                `config` = %(config)s,
                `desc` = %(desc)s,
                `open_count` = %(open_count)s,
                `close_count` = %(close_count)s,
                `apply_count` = %(apply_count)s,
                `deposit` = %(deposit)s,
                `tally_quorum` = %(tally_quorum)s,
                `tally_approve` = %(tally_approve)s,
                `tally_reject` = %(tally_reject)s,
                `proposed_at` = %(proposed_at)s,
                `closed_at` = %(closed_at)s,
                `applied_at` = %(applied_at)s
            WHERE (`chain_id` = %(chain_id)s
                AND `draft_id` = %(draft_id)s)
            """, self._vars())


class Vote:
    def __init__(self, dbs, chain_id, draft_id, voter, cursor):
        self.dbs = dbs
        self.chain_id = chain_id
        self.draft_id = draft_id
        self.voter = voter
        cursor.execute(
            f"""
            SELECT * FROM `{self.dbs['builder']}`.`s_votes`
            WHERE (`chain_id` = %(chain_id)s
                AND `draft_id` = %(draft_id)s
                AND `voter` = %(voter)s)
            """, self._vars())
        row = cursor.fetchone()
        if row:
            d = dict(zip(cursor.column_names, row))
            self.approve = d.get('approve')
        else:
            cursor.execute(
                f"""
                INSERT INTO `{self.dbs['builder']}`.`s_votes`
                    (`chain_id`, `draft_id`, `voter`)
                VALUES (%(chain_id)s, %(draft_id)s, %(voter)s)
                """, self._vars())
    def _vars(self):
        v = vars(self).copy()
        del v['dbs']
        return v

    def save(self, cursor):
        cursor.execute(
            f"""
            UPDATE `{self.dbs['builder']}`.`s_votes`
            SET
                `approve` = %(approve)s
            WHERE (`chain_id` = %(chain_id)s
                AND `draft_id` = %(draft_id)s
                AND `voter` = %(voter)s)
            """, self._vars())


class UDC:
    def __init__(self, dbs, chain_id, udc_id, cursor):
        self.dbs = dbs
        self.chain_id = chain_id
        self.udc_id = udc_id
        self.owner = ''
        self.desc = ''
        self.operators = '[]'
        self.total = 0
        cursor.execute(
            f"""
            SELECT * FROM `{self.dbs['builder']}`.`s_udcs`
            WHERE (`chain_id` = %(chain_id)s
                AND `udc_id` = %(udc_id)s)
            """, self._vars())
        row = cursor.fetchone()
        if row:
            d = dict(zip(cursor.column_names, row))
            self.owner = d.get('owner')
            self.desc = d.get('desc')
            self.operators = d.get('operators')
            self.total = int(d.get('total'))
        else:
            cursor.execute(
                f"""
                INSERT INTO `{self.dbs['builder']}`.`s_udcs`
                    (`chain_id`, `udc_id`)
                VALUES (%(chain_id)s, %(udc_id)s)
                """, self._vars())

    def _vars(self):
        v = vars(self).copy()
        v['total'] = str(v['total'])
        del v['dbs']
        return v

    def save(self, cursor):
        cursor.execute(
            f"""
            UPDATE `{self.dbs['builder']}`.`s_udcs`
            SET
                `owner` = %(owner)s,
                `desc` = %(desc)s,
                `operators` = %(operators)s,
                `total` = %(total)s
            WHERE (`chain_id` = %(chain_id)s
                AND `udc_id` = %(udc_id)s)
            """, self._vars())


class UDCBalance:
    def __init__(self, dbs, chain_id, udc_id, address, cursor):
        self.dbs = dbs
        self.chain_id = chain_id
        self.udc_id = udc_id
        self.address = address
        self.balance = 0
        self.balance_lock = 0
        cursor.execute(
            f"""
            SELECT * FROM `{self.dbs['builder']}`.`s_udc_balances`
            WHERE (`chain_id` = %(chain_id)s
                AND `udc_id` = %(udc_id)s
                AND `address` = %(address)s)
            """, self._vars())
        row = cursor.fetchone()
        if row:
            d = dict(zip(cursor.column_names, row))
            self.balance = int(d.get('balance'))
            self.balance_lock = int(d.get('balance_lock'))
        else:
            cursor.execute(
                f"""
                INSERT INTO `{self.dbs['builder']}`.`s_udc_balances`
                    (`chain_id`, `udc_id`, `address`)
                VALUES (%(chain_id)s, %(udc_id)s, %(address)s)
                """, self._vars())

    def _vars(self):
        v = vars(self).copy()
        v['balance'] = str(v['balance'])
        v['balance_lock'] = str(v['balance_lock'])
        del v['dbs']
        return v

    def save(self, cursor):
        cursor.execute(
            f"""
            UPDATE `{self.dbs['builder']}`.`s_udc_balances`
            SET
                `balance` = %(balance)s,
                `balance_lock` = %(balance_lock)s
            WHERE (`chain_id` = %(chain_id)s
                AND `udc_id` = %(udc_id)s
                AND `address` = %(address)s)
            """, self._vars())


class RelAccountBlock:
    def __init__(self, dbs, chain_id, address, height, cursor):
        self.dbs = dbs
        self.chain_id = chain_id
        self.address = address
        self.height = height
        self.amount = 0
        cursor.execute(
            f"""
            SELECT * FROM `{self.dbs['builder']}`.`r_account_block`
            WHERE (`chain_id` = %(chain_id)s AND `address` = %(address)s
                AND `height` = %(height)s)
            """, self._vars())
        row = cursor.fetchone()
        if row:
            d = dict(zip(cursor.column_names, row))
            self.amount = int(d['amount'])
            self.new = False
        else:
            self.amount = 0
            self.new = True

    def _vars(self):
        v = vars(self).copy()
        v['amount'] = str(v['amount'])
        del v['dbs']
        return v

    def save(self, cursor):
        if self.new and self.amount != 0:
            cursor.execute(
                f"""
                INSERT INTO `{self.dbs['builder']}`.`r_account_block` (
                    `chain_id`, `address`, `height`, `amount`)
                VALUES (%(chain_id)s, %(address)s, %(height)s, %(amount)s)
                """, self._vars())
        else:
            cursor.execute(
                f"""
                UPDATE `{self.dbs['builder']}`.`r_account_block`
                SET
                    `amount` = %(amount)s
                WHERE (`chain_id` = %(chain_id)s AND `address` = %(address)s
                    AND `height` = %(height)s)
                """, self._vars())


class RelAccountTx:
    def __init__(self, dbs, chain_id, address, height, index, cursor):
        self.dbs = dbs
        self.chain_id = chain_id
        self.address = address
        self.height = height
        self.index = index
        self.amount = 0
        cursor.execute(
            f"""
            SELECT * FROM `{self.dbs['builder']}`.`r_account_tx`
            WHERE (`chain_id` = %(chain_id)s AND `address` = %(address)s
                AND `height` = %(height)s AND `index` = %(index)s)
            """, self._vars())
        row = cursor.fetchone()
        if row:
            d = dict(zip(cursor.column_names, row))
            self.amount = int(d['amount'])
            self.new = False
        else:
            self.amount = 0
            self.new = True

    def _vars(self):
        v = vars(self).copy()
        v['amount'] = str(v['amount'])
        del v['dbs']
        return v

    def save(self, cursor):
        if self.new and self.amount != 0:
            cursor.execute(
                f"""
                INSERT INTO `{self.dbs['builder']}`.`r_account_tx` (
                    `chain_id`, `address`, `height`, `index`, `amount`)
                VALUES (%(chain_id)s, %(address)s, %(height)s, %(index)s,
                    %(amount)s)
                """, self._vars())
        else:
            cursor.execute(
                f"""
                UPDATE `{self.dbs['builder']}`.`r_account_tx`
                SET
                    `amount` = %(amount)s
                WHERE (`chain_id` = %(chain_id)s AND `address` = %(address)s
                    AND `height` = %(height)s AND `index` = %(index)s)
                """, self._vars())


class RelParcelTx:
    def __init__(self, dbs, chain_id, parcel_id, height, index, cursor):
        self.dbs = dbs
        self.chain_id = chain_id
        self.parcel_id = parcel_id
        self.height = height
        self.index = index

    def _vars(self):
        v = vars(self).copy()
        del v['dbs']
        return v

    def save(self, cursor):
        cursor.execute(
            f"""
            INSERT INTO `{self.dbs['builder']}`.`r_parcel_tx` (
                `chain_id`, `parcel_id`, `height`, `index`)
            VALUES (%(chain_id)s, %(parcel_id)s, %(height)s, %(index)s)
            """, self._vars())
