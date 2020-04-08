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
        l.`address` `owner`, l.`stake` `stake`, \
        GROUP_CONCAT(\
          JSON_OBJECT('address', r.`address`, 'amount', r.`delegate`)\
          ) `delegators` \
      FROM `s_accounts` l LEFT JOIN `s_accounts` r \
        ON l.`address` = r.`del_addr` \
      WHERE l.`chain_id` = ? AND l.`val_addr` = ?";
    query_var = [chain_id, address];
    var val = {};
    db.query(query_str, query_var, function (err, rows, fields) {
      if (err) {
        console.log(err);
        return reject(err);
      }
      console.log(rows);
      if (rows.length > 0) {
        val = rows[0];
        if (val['address'] == null) {
          // XXX: this is strange.
          resolve(null);
        }
        // NOTE: unfortunately, mariadb 10.4 does not support JSON_ARRAYAGG().
        if (val['delegators']) {
          val['delegators'] = JSON.parse('['+val['delegators']+']');
        } else {
          val['delegators'] = [];
        }
        resolve(val);
      } else {
        reject('not found');
      }
    });
  });
}

module.exports = {
  //getStat: getStat,
  getOne: getOne,
  //getLast: getLast,
  //getList: getList,
}
