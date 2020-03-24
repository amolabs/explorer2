-- explorer.blocks definition

CREATE TABLE `blocks` (
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


-- explorer.txs definition

CREATE TABLE `txs` (
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
  PRIMARY KEY (`chain_id`,`height`,`index`),
  KEY `txs_hash` (`chain_id`,`hash`) USING BTREE,
  CONSTRAINT `block_FK` FOREIGN KEY (`chain_id`, `height`) REFERENCES `blocks` (`chain_id`, `height`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- explorer.chain_summary source

CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `explorer`.`chain_summary` AS
select
    `b`.`chain_id` AS `chain_id`,
    max(`b`.`height`) AS `height`,
    count(distinct `b`.`hash`) AS `num_blocks`,
    sum(`b`.`num_txs`) AS `num_txs`,
    avg(`b`.`interval`) AS `avg_interval`
from
    `explorer`.`blocks` `b`
group by
    `b`.`chain_id`;
