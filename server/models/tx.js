/* vim: set sw=2 ts=2 expandtab : */
const db = require('../db/db');

async function getOne(chain_id, height, index) {
  return new Promise(function(resolve, reject) {
    var query_str;
    var query_var;
    if (height == 0 && index == 0) {
      query_str = "select * from txs where (chain_id = ?) \
        order by height desc, `index` desc limit 1";
      query_var = [chain_id];
    } else {
      query_str = "select * from txs where (chain_id = ?) \
        and (height = ? and `index` = ?)";
      query_var = [chain_id, height, index];
    }
    db.query(query_str, query_var, function (err, rows, fields) {
      // Call reject on error states,
      // call resolve with results
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

async function getList(chain_id, from_h, from_i, num, order) {
  return new Promise(function(resolve, reject) {
    from_h = Number(from_h);
    from_i = Number(from_i);
    num = Number(num);
    var query_str;
    var query_var;
    if (order == 'asc') {
      query_str = "select * from txs where (chain_id = ?) \
        and (height >= ? and `index` >= ?) \
        order by height asc, `index` asc limit ?";
      query_var = [chain_id, from_h, from_i, num];
    } else {
      query_str = "select * from txs where (chain_id = ?) \
        and (height <= ? and `index` <= ?) \
        order by height desc, `index` desc limit ?";
      query_var = [chain_id, from_h, from_i, num];
    }
    db.query(query_str, query_var, function (err, rows, fields) {
      // Call reject on error states,
      // call resolve with results
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

module.exports = {
  getOne: getOne,
  getList: getList,
}
