/* vim: set sw=2 ts=2 expandtab : */
const db = require('../db/db');

async function getBlock(chainid, height) {
  return new Promise(function(resolve, reject) {
    // The Promise constructor should catch any errors thrown on
    // this tick. Alternately, try/catch and reject(err) on catch.
    var query_str = "select * from blocks where (chainid = ?) and (height = ?)";
    var query_var = [chainid, height];

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
