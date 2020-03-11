/* vim: set sw=2 ts=2 expandtab : */
const db = require('../db/db');

async function getBlock(chain_id, height) {
  return new Promise(function(resolve, reject) {
    // The Promise constructor should catch any errors thrown on
    // this tick. Alternately, try/catch and reject(err) on catch.
    var query_str = "select * from blocks where (chain_id = ?) and (height = ?)";
    var query_var = [chain_id, height];

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
