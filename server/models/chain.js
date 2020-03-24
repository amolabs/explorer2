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

async function getLastBlock(chain_id) {
  return new Promise(function(resolve, reject) {
    var query_str = "SELECT * FROM `blocks` WHERE (`chain_id` = ?) \
      ORDER BY `height` DESC LIMIT 1";
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

async function getLastTx(chain_id) {
  return new Promise(function(resolve, reject) {
    var query_str = "SELECT * FROM `txs` WHERE (`chain_id` = ?) \
      ORDER BY `height` DESC, `index` DESC LIMIT 1";
    var query_var = [chain_id];
    db.query(query_str, query_var, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      if (rows.length == 0) {
        return resolve({});
      }
      resolve(rows[0]);
    });
  });
}

async function getSummary(chain_id) {
  return Promise.all([
    getBlockStat(chain_id), getLastBlock(chain_id), getLastTx(chain_id),
  ],)
    .then((res) => {
      ret = res[0];
      ret.height = res[1].height;
      ret.time = res[1].time;
      ret.tx_height = res[2].height;
      ret.tx_index = res[2].index;
      //console.log('ret', ret);
      return ret;
    });
}

module.exports = {
  getSummary: getSummary,
}
