/* vim: set sw=2 ts=2 expandtab : */
const db = require('../db/db');

async function getBalance(chain_id, address, udc_id) {
  return new Promise(function(resolve, reject) {
    udc_id = Number(udc_id);
    var query_str;
    var query_var;
    query_str = " \
      SELECT ub.chain_id, ub.address, ub.udc_id, u.`desc`, ub.balance \
      FROM explorer.s_udc_balances ub LEFT JOIN explorer.s_udcs u \
        ON ub.chain_id = u.chain_id AND ub.udc_id = u.udc_id \
      WHERE ub.chain_id = ? AND ub.address = ? AND ub.udc_id = ? \
    ";
    query_var = [chain_id, address, udc_id];
    db.query(query_str, query_var, function (err, rows) {
      if (err) {
        return reject(err);
      }
      resolve(rows[0]);
    });
  });
}

async function getBalancesByAccount(chain_id, address, from, num) {
  return new Promise(function(resolve, reject) {
    from = Number(from);
    num = Number(num);
    var query_str;
    var query_var;
    query_str = " \
      SELECT ub.chain_id, ub.address, ub.udc_id, u.`desc`, ub.balance \
      FROM explorer.s_udc_balances ub LEFT JOIN explorer.s_udcs u \
        ON ub.chain_id = u.chain_id AND ub.udc_id = u.udc_id \
      WHERE ub.chain_id = ? AND ub.address = ? \
      ORDER BY ub.udc_id \
      LIMIT ?, ? \
    ";
    query_var = [chain_id, address, from, num];
    db.query(query_str, query_var, function (err, rows) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

module.exports = {
  getBalance,
  getBalancesByAccount,
}
