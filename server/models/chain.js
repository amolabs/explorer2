/* vim: set sw=2 ts=2 expandtab : */
const db = require('../db/db');

async function getSummary(chain_id) {
  return new Promise(function(resolve, reject) {
    var query_str = "select * from chain_summary where (chain_id = ?)";
    var query_var = [chain_id];
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
  getSummary: getSummary,
}
