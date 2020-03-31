/* vim: set sw=2 ts=2 expandtab : */
const db = require('../db/db');

async function getBlockStat(chain_id) {
  return new Promise(function(resolve, reject) {
    var query_str = "SELECT * FROM `block_stat` WHERE (`chain_id` = ?) LIMIT 1";
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
    var query_str = "SELECT * FROM `tx_stat` WHERE (`chain_id` = ?) LIMIT 1";
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
