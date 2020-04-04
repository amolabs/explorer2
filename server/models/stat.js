/* vim: set sw=2 ts=2 expandtab : */
const db = require('../db/db');

async function getBlockStat(chain_id) {
  return new Promise(function(resolve, reject) {
    var query_str =
      "SELECT " +
      "  t.`chain_id`, " +
      "  COUNT(t.`height`) `num_blocks`, " +
      "  SUM(t.`num_txs`) as `num_txs`, " +
      "  AVG(t.`num_txs`) as `avg_num_txs`, " +
      "  AVG(t.`interval`) as `avg_interval` " +
      "FROM ( " +
      "  SELECT * FROM `explorer`.`c_blocks` " +
      "  WHERE `chain_id` = ? " +
      "  ORDER BY `height` DESC LIMIT 1000 " +
      ") t";
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

async function getTxStat(chain_id) {
  return new Promise(function(resolve, reject) {
    var query_str =
      "SELECT " +
      "  `t`.`chain_id` AS `chain_id`, " +
      "  COUNT(`hash`) AS `num_txs`, " +
      "  SUM(IF(`t`.`code` = 0, 1, 0)) AS `num_txs_valid`, " +
      "  SUM(IF(`t`.`code` > 0, 1, 0)) AS `num_txs_invalid`, " +
      "  AVG(`t`.`fee`) AS `avg_fee`, " +
      "  AVG(`t`.`height` - `t`.`last_height`) AS `avg_binding_lag`, " +
      "  10000 AS `max_binding_lag` " +
      "FROM ( " +
      "  SELECT * FROM `explorer`.`c_txs` " +
      "  WHERE `chain_id` = ? " +
      "  ORDER BY `height` DESC, `index` DESC LIMIT 1000 " +
      ") t";
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

module.exports = {
  getBlockStat: getBlockStat,
  getTxStat: getTxStat,
  getAssetStat: getAssetStat,
}
