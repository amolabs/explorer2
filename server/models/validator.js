/* vim: set sw=2 ts=2 expandtab : */
const db = require('../db/db');

async function getOne(chain_id, address) {
  return new Promise(function(resolve, reject) {
    var query_str;
    var query_var;
    // NOTE: unfortunately, mariadb 10.4 does not support JSON_ARRAYAGG().
    var query_str = "SELECT \
        l.`val_addr` `address`, l.`val_pubkey` `pubkey`, \
        l.`val_power` `power`, \
        l.`address` `owner`, l.`stake` `stake`, l.`eff_stake` `eff_stake` \
      FROM `s_accounts` l \
      WHERE l.`chain_id` = ? AND l.`val_addr` = ?";
    query_var = [chain_id, address];
    var val = {};
    db.query(query_str, query_var, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      return resolve(rows[0]);
    });
  });
}

// TODO: use temp table to capture the consistent list of delegators
async function getDelegators(chain_id, address, from, num) {
  return new Promise(function(resolve, reject) {
    from = Number(from);
    num = Number(num);
    var query_str;
    var query_var;
    query_str = "SELECT r.`address`, r.`delegate` \
      FROM `s_accounts` l \
        LEFT JOIN `s_accounts` r ON l.`address` = r.`del_addr` \
      WHERE l.`chain_id` = ? and l.`val_addr` = ? \
      LIMIT ?,?";
    query_var = [chain_id, address, from, num];
    db.query(query_str, query_var, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

module.exports = {
  getOne: getOne,
  getDelegators: getDelegators,
}
