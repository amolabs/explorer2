/* vim: set sw=2 ts=2 expandtab : */
const db = require('../db/db');

async function getBlockStat(chain_id, non_empty, num_blks) {
  return new Promise(function(resolve, reject) {
    var option = '';
    var limit = '';
    if (non_empty) {
      option = "AND t.`height` IS NOT NULL";
    }
    if (num_blks) {
      limit = `LIMIT ${num_blks}`;
    }
    var query_str = "SELECT \
        t.`chain_id` AS `chain_id`, \
        MAX(t.`height`) `last_height`, \
        COUNT(t.`chain_id`) `num_blocks`, \
        SUM(t.`num_txs`) `num_txs`, AVG(t.`num_txs`) `avg_num_txs`, \
        AVG(IFNULL(t.`blk_tx_bytes`, 0)) `avg_blk_tx_bytes`, \
        AVG(t.`interval`) `avg_interval` \
      FROM ( \
        SELECT \
          b.*, SUM(t.`tx_bytes`) `blk_tx_bytes` \
        FROM `c_blocks` b LEFT JOIN `c_txs` t ON \
            b.`height` = t.`height` AND b.`chain_id` = t.`chain_id`  \
        WHERE b.`chain_id` = ? " + option + " \
        GROUP BY b.`height` \
        ORDER BY b.`height` DESC " + limit + " \
      ) t";
    var query_var = [chain_id];
    db.query(query_str, query_var, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      if (rows.length == 0) {
        return reject('not found');
      }
      resolve(rows[0]);
    });
  });
}

async function getTxStat(chain_id, num_txs) {
  return new Promise(function(resolve, reject) {
    // TODO: change fee to tx_fee in DB schema
    // TODO: change avg_fee to avg_tx_fee in field name
    var limit = '';
    if (num_txs) {
      limit = `LIMIT ${num_txs}`;
    }
    var query_str = "SELECT \
        `t`.`chain_id` AS `chain_id`, \
        MAX(t.`height`) `tx_height`, \
        COUNT(`hash`) AS `num_txs`, \
        SUM(IF(`t`.`code` = 0, 1, 0)) AS `num_txs_valid`, \
        SUM(IF(`t`.`code` > 0, 1, 0)) AS `num_txs_invalid`, \
        AVG(`t`.`fee`) AS `avg_fee`, \
        AVG(`t`.`tx_bytes`) AS `avg_tx_bytes`, \
        AVG(`t`.`height` - `t`.`last_height`) AS `avg_binding_lag`, \
        10000 AS `max_binding_lag` \
      FROM ( \
        SELECT * FROM `c_txs` \
        WHERE `chain_id` = ? \
        ORDER BY `height` DESC, `index` DESC " + limit + " \
      ) t";
    var query_var = [chain_id];
    db.query(query_str, query_var, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows[0]);
    });
  });
}

async function getAssetStat(chain_id) {
  return new Promise(function(resolve, reject) {
    var query_str = "SELECT * FROM `asset_stat` WHERE (`chain_id` = ?) LIMIT 1";
    var query_var = [chain_id];
    db.query(query_str, query_var, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows[0]);
    });
  });
}

async function getValidatorStat(chain_id, num_blks) {
  num_blks = Number(num_blks) || 1000;
  return new Promise(function(resolve, reject) {
    // CAUTION: not very comfortable with this sum().
    var query_str = "SELECT count(*) `num_validators`, SUM(`eff_stake`) `total_eff_stakes`, AVG(`eff_stake`) `avg_eff_stake` FROM `s_accounts` \
      WHERE (`chain_id` = ? AND `val_addr` IS NOT NULL) LIMIT 1";
    var query_var = [chain_id];
    db.query(query_str, query_var, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      stat = rows[0];

      // another query
      query_str = "SELECT \
        JSON_EXTRACT(`incentives`, '$[*].amount') AS `amounts` \
        FROM `c_blocks` WHERE `chain_id` = ? \
        ORDER BY `height` DESC \
        LIMIT ?";
      query_var = [chain_id, num_blks];
      db.query(query_str, query_var, function (err, rows, fields) {
        if (err) {
          return reject(err);
        }
        sum = BigInt(0);
        rows.forEach(row => {
          if (!row.amounts) {
            return;
          }
          l = JSON.parse(row.amounts);
          l.forEach(a => {
            sum += BigInt(a);
          });
        });
        stat.avg_blk_incentive = (sum / BigInt(num_blks)).toString();

        resolve(stat);
      });
    });
  });
}

module.exports = {
  getBlockStat: getBlockStat,
  getTxStat: getTxStat,
  getAssetStat: getAssetStat,
  getValidatorStat: getValidatorStat,
}
