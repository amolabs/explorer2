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
      if (rows.length > 0) {
        val = rows[0];
        if (val['address'] == null) {
          // XXX: this is strange.
          return resolve(null);
        }
        // XXX: we cannot use aggregate function such as SUM or AVG in SQL
        // query, since the stake and delegate amount are all big integers and
        // the DBMS does not support them. So, we need the following dirty
        // codes.
        eff_stake = BigInt(val['stake']);
        if (val['delegators']) {
          // NOTE: unfortunately, mariadb 10.4 does not support JSON_ARRAYAGG().
          val['delegators'] = JSON.parse('['+val['delegators']+']');
          if (val['delegators'][0]['address'] == null) {
            val['delegators'] = []; // XXX: this is also strange.
          }
          for (const d of val['delegators']) {
            eff_stake += BigInt(d['amount']);
          }
        } else {
          val['delegators'] = [];
        }
        val['eff_stake'] = eff_stake.toString();
        return resolve(val);
      } else {
        return reject(null);
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
