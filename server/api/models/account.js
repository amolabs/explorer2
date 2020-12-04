/* vim: set sw=2 ts=2 expandtab : */
const { db, dbs } = require('../db/db');

async function getOne(chain_id, address) {
  return new Promise(function(resolve, reject) {
    var query_str;
    var query_var;
    query_str = "SELECT * FROM `?`.`s_accounts` \
      WHERE (`chain_id` = ? AND `address` = ?)";
    query_var = [dbs['builder'], chain_id, address];
    db.query(query_str, query_var, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

async function getOneByValidator(chain_id, address) {
  return new Promise(function(resolve, reject) {
    var query_str;
    var query_var;
    query_str = "SELECT * FROM `?`.`s_accounts` \
      WHERE (`chain_id` = `?` AND `val_addr` = ?)";
    query_var = [dbs['builder'], chain_id, address];
    db.query(query_str, query_var, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

async function getList(chain_id, val_only, from, num) {
  return new Promise(function(resolve, reject) {
    from = Number(from);
    num = Number(num);
    var query_str;
    var query_var;
    if (val_only) {
      query_str = "SELECT * FROM `?`.`s_accounts` \
        WHERE (`chain_id` = ? AND `val_addr` IS NOT NULL) \
        LIMIT ?,?";
      query_var = [dbs['builder'], chain_id, FROM, num];
    } else {
      query_str = "SELECT * FROM `?`.`s_accounts` \
        WHERE (`chain_id` = ?) \
        LIMIT ?,?";
      query_var = [dbs['builder'], chain_id, from, num];
    }
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
  getOneByValidator: getOneByValidator,
  //getLast: getLast,
  getList: getList,
}
