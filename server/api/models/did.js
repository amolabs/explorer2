/* vim: set sw=2 ts=2 expandtab : */
const db = require('../db/db');

async function getList(chain_id) {
  return new Promise(function(resolve, reject) {
    var query_str;
    var query_var;
    query_str = "select * from s_dids \
      where (chain_id = ?) \
      order by id asc";
    query_var = [chain_id];
    db.query(query_str, query_var, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      for (i = 0; i < rows.length; i++) {
        rows[i].document = JSON.parse(rows[i].document)
        rows[i].active = rows[i].active > 0 ? true : false;
      }
      resolve(rows);
    });
  });
}

async function getOne(chain_id, did) {
  return new Promise(function(resolve, reject) {
    var query_str;
    var query_var;
    query_str = "select * from s_dids \
      where (chain_id = ? and id = ?)";
    query_var = [chain_id, did];
    db.query(query_str, query_var, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      for (i = 0; i < rows.length; i++) {
        rows[i].document = JSON.parse(rows[i].document)
        rows[i].active = rows[i].active > 0 ? true : false;
      }
      resolve(rows);
    });
  });
}

module.exports = {
  getList: getList,
  getOne: getOne,
}
