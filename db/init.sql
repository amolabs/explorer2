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
  PRIMARY KEY (`chain_id`,`address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- explorer.s_parcels definition

CREATE TABLE `s_parcels` (
  `chain_id` char(32) NOT NULL,
  `parcel_id` char(72) NOT NULL,
  PRIMARY KEY (`chain_id`,`parcel_id`)
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
