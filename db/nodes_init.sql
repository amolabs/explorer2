-- explorer.nodes definition (insert, update)
CREATE TABLE `nodes` (
  `chain_id` char(32) NOT NULL,
  `node_id` char(40) NOT NULL,
  `timestamp` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `moniker` varchar(40) NOT NULL,
  `ip_addr` int(11) unsigned NOT NULL default 0,
  PRIMARY KEY (`chain_id`, `node_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- explorer.node_history definition (insert)
CREATE TABLE `node_history` (
  `chain_id` char(32) NOT NULL,
  `node_id` char(40) NOT NULL,
  `timestamp` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `n_peers` int(11) NOT NULL default 0,
  `val_addr` char(40) NOT NULL,
  `latest_block_time` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `latest_block_height` int(11) NOT NULL,
  `catching_up` boolean NOT NULL default false,
  `elapsed` float(8,6) NOT NULL default 0,
  `online` boolean NOT NULL default false,
  PRIMARY KEY (`chain_id`, `node_id`, `timestamp`),
  CONSTRAINT `nodes_FK` FOREIGN KEY (`chain_id`, `node_id`) REFERENCES `nodes` (`chain_id`, `node_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

