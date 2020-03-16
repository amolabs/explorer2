-- explorer.blocks definition

CREATE TABLE `blocks` (
  `chain_id` char(32) NOT NULL,
  `height` int(11) NOT NULL,
  `time` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `hash` char(64) DEFAULT NULL,
  `num_txs` int(11) NOT NULL,
  PRIMARY KEY (`chain_id`,`height`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- explorer.txs definition

CREATE TABLE `txs` (
  `chain_id` char(32) NOT NULL,
  `hash` char(64) NOT NULL,
  `height` int(11) NOT NULL,
  `index` int(11) NOT NULL,
  `code` int(11) NOT NULL,
  `info` varchar(128) DEFAULT NULL,
  `type` char(32) NOT NULL,
  `sender` char(40) NOT NULL,
  `fee` bigint(20) NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`payload`)),
  PRIMARY KEY (`chain_id`,`hash`),
  KEY `block_FK` (`chain_id`,`height`),
  CONSTRAINT `block_FK` FOREIGN KEY (`chain_id`, `height`) REFERENCES `blocks` (`chain_id`, `height`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- explorer.chain_summary source

CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `explorer`.`chain_summary` AS
select
    `b`.`chain_id` AS `chain_id`,
    max(`b`.`height`) AS `height`,
    count(distinct `b`.`hash`) AS `num_blocks`,
    count(distinct `t`.`hash`) AS `num_txs`
from
    (`explorer`.`blocks` `b`
left join `explorer`.`txs` `t` on
    (`b`.`chain_id` = `t`.`chain_id`
    and `b`.`height` = `t`.`height`))
group by
    `b`.`chain_id`;
