/* vim: set sw=2 ts=2 expandtab : */
const db = require('../db/db');

async function getOne(chain_id, address) {
  return new Promise(function(resolve, reject) {
    var query_str;
    var query_var;
    query_str = "select * from s_accounts \
      where (chain_id = ? and address = ?)";
    query_var = [chain_id, address];
    db.query(query_str, query_var, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

module.exports = {
  //getStat: getStat,
  getOne: getOne,
  //getLast: getLast,
  //getList: getList,
}
