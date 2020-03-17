/* vim: set sw=2 ts=2 expandtab : */
const db = require('../db/db');

async function getBlock(chain_id, height) {
  return new Promise(function(resolve, reject) {
    var query_str;
    var query_var;
    if (height == 0) {
      query_str = "select * from blocks where (chain_id = ?) order by height desc limit 1";
      query_var = [chain_id];
    } else {
      query_str = "select * from blocks where (chain_id = ?) and (height = ?) limit 1";
      query_var = [chain_id, height];
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

module.exports = getBlock;
