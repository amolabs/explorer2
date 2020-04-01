-- explorer.c_blocks definition

CREATE TABLE `c_blocks` (
  `chain_id` char(32) NOT NULL,
  `height` int(11) NOT NULL,
  `time` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `hash` char(64) DEFAULT NULL,
  `num_txs` int(11) NOT NULL DEFAULT 0,
  `interval` float NOT NULL DEFAULT 0,
  `proposer` char(40) NOT NULL,
  `tx_bytes` int(11) NOT NULL DEFAULT 0,
  `num_txs_valid` int(11) NOT NULL DEFAULT 0,
  `num_txs_invalid` int(11) NOT NULL DEFAULT 0,
  `incentives` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`incentives`)),
  PRIMARY KEY (`chain_id`,`height`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- explorer.c_genesis definition

CREATE TABLE `c_genesis` (
  `chain_id` char(32) NOT NULL,
  `genesis` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`genesis`)),
  PRIMARY KEY (`chain_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- explorer.play_stat definition

CREATE TABLE `play_stat` (
  `chain_id` char(32) NOT NULL,
  `height` int(11) NOT NULL,
  PRIMARY KEY (`chain_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- explorer.s_accounts definition

CREATE TABLE `s_accounts` (
  `chain_id` char(32) NOT NULL,
  `address` char(40) NOT NULL,
  `balance` char(40) NOT NULL DEFAULT '0',
  `stake` char(40) NOT NULL DEFAULT '0',
  `val_addr` char(40) DEFAULT NULL,
  `delegate` char(40) NOT NULL DEFAULT '0',
  `del_addr` char(40) DEFAULT NULL,
  PRIMARY KEY (`chain_id`,`address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- explorer.s_udcs definition

CREATE TABLE `s_udcs` (
  `chain_id` char(32) NOT NULL,
  `udc_id` int(11) NOT NULL,
  `owner` char(40) NOT NULL DEFAULT '',
  `desc` varchar(100) NOT NULL DEFAULT '',
  `operators` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' CHECK (json_valid(`operators`)),
  `total` char(40) NOT NULL DEFAULT '0',
  PRIMARY KEY (`chain_id`,`udc_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- explorer.s_udc_balances definition

CREATE TABLE `s_udc_balances` (
  `chain_id` char(32) NOT NULL,
  `udc_id` int(11) NOT NULL,
  `address` char(40) NOT NULL,
  `balance` char(40) NOT NULL DEFAULT '0',
  `balance_lock` char(40) NOT NULL DEFAULT '0',
  PRIMARY KEY (`chain_id`,`udc_id`,`address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- explorer.c_txs definition

CREATE TABLE `c_txs` (
  `chain_id` char(32) NOT NULL,
  `height` int(11) NOT NULL,
  `index` int(11) NOT NULL,
  `hash` char(64) NOT NULL,
  `code` int(11) NOT NULL,
  `info` varchar(128) DEFAULT NULL,
  `type` char(32) NOT NULL,
  `sender` char(40) NOT NULL,
  `fee` bigint(20) NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`payload`)),
  `last_height` int(11) NOT NULL,
  PRIMARY KEY (`chain_id`,`height`,`index`),
  KEY `txs_hash` (`chain_id`,`hash`) USING BTREE,
  CONSTRAINT `block_FK` FOREIGN KEY (`chain_id`, `height`) REFERENCES `c_blocks` (`chain_id`, `height`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- explorer.s_storages definition

CREATE TABLE `s_storages` (
  `chain_id` char(32) NOT NULL,
  `storage_id` int(11) NOT NULL,
  `owner` char(40) NOT NULL DEFAULT '',
  `url` varchar(100) DEFAULT NULL,
  `registration_fee` char(40) NOT NULL DEFAULT '0',
  `hosting_fee` char(40) NOT NULL DEFAULT '0',
  `active` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`chain_id`,`storage_id`),
  KEY `s_storages_FK` (`chain_id`,`owner`),
  CONSTRAINT `s_storages_FK` FOREIGN KEY (`chain_id`, `owner`) REFERENCES `s_accounts` (`chain_id`, `address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- explorer.s_parcels definition

CREATE TABLE `s_parcels` (
  `chain_id` char(32) NOT NULL,
  `parcel_id` char(72) NOT NULL,
  `storage_id` int(11) NOT NULL,
  `owner` char(40) NOT NULL DEFAULT '',
  `custody` varchar(100) NOT NULL DEFAULT '',
  `proxy_account` char(40) DEFAULT NULL,
  `extra` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '{}' CHECK (json_valid(`extra`)),
  `on_sale` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`chain_id`,`parcel_id`),
  KEY `s_parcels_FK` (`chain_id`,`storage_id`),
  KEY `s_parcels_FK_1` (`chain_id`,`owner`),
  CONSTRAINT `s_parcels_FK` FOREIGN KEY (`chain_id`, `storage_id`) REFERENCES `s_storages` (`chain_id`, `storage_id`),
  CONSTRAINT `s_parcels_FK_1` FOREIGN KEY (`chain_id`, `owner`) REFERENCES `s_accounts` (`chain_id`, `address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- explorer.s_requests definition

CREATE TABLE `s_requests` (
  `chain_id` char(32) NOT NULL,
  `parcel_id` char(72) NOT NULL,
  `buyer` char(40) NOT NULL,
  `payment` char(40) NOT NULL DEFAULT '0',
  `dealer` char(40) DEFAULT NULL,
  `dealer_fee` char(40) NOT NULL DEFAULT '0',
  `extra` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '{}' CHECK (json_valid(`extra`)),
  PRIMARY KEY (`chain_id`,`parcel_id`,`buyer`),
  KEY `s_requests_FK_1` (`chain_id`,`buyer`),
  CONSTRAINT `s_requests_FK` FOREIGN KEY (`chain_id`, `parcel_id`) REFERENCES `s_parcels` (`chain_id`, `parcel_id`),
  CONSTRAINT `s_requests_FK_1` FOREIGN KEY (`chain_id`, `buyer`) REFERENCES `s_accounts` (`chain_id`, `address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- explorer.s_usages definition

CREATE TABLE `s_usages` (
  `chain_id` char(32) NOT NULL,
  `parcel_id` char(72) NOT NULL,
  `grantee` char(40) NOT NULL,
  `custody` varchar(100) NOT NULL DEFAULT '',
  `extra` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '{}',
  PRIMARY KEY (`chain_id`,`parcel_id`,`grantee`),
  KEY `s_requests_FK_1` (`chain_id`,`grantee`) USING BTREE,
  CONSTRAINT `s_requests_FK_1_copy` FOREIGN KEY (`chain_id`, `grantee`) REFERENCES `s_accounts` (`chain_id`, `address`),
  CONSTRAINT `s_requests_FK_copy` FOREIGN KEY (`chain_id`, `parcel_id`) REFERENCES `s_parcels` (`chain_id`, `parcel_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- explorer.asset_stat definition

CREATE TABLE `asset_stat` (
  `chain_id` char(32) NOT NULL,
  `active_coins` char(40) NOT NULL DEFAULT '0',
  `stakes` char(40) NOT NULL DEFAULT '0',
  `delegates` char(40) NOT NULL DEFAULT '0',
  PRIMARY KEY (`chain_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- explorer.block_stat source

CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `explorer`.`block_stat` AS
select
    `b`.`chain_id` AS `chain_id`,
    count(distinct `b`.`hash`) AS `num_blocks`,
    sum(`b`.`num_txs`) AS `num_txs`,
    avg(`b`.`interval`) AS `avg_interval`
from
    `explorer`.`c_blocks` `b`
group by
    `b`.`chain_id`;


-- explorer.tx_stat source

CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `explorer`.`tx_stat` AS
select
    `t`.`chain_id` AS `chain_id`,
    count(0) AS `num_txs`,
    sum(if(`t`.`code` = 0, 1, 0)) AS `num_txs_valid`,
    sum(if(`t`.`code` > 0, 1, 0)) AS `num_txs_invalid`,
    avg(`t`.`fee`) AS `avg_fee`,
    avg(`t`.`height` - `t`.`last_height`) AS `avg_binding_lag`,
    10000 AS `max_binding_lag`
from
    `explorer`.`c_txs` `t`
group by
    `t`.`chain_id`;
