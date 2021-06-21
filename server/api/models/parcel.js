/* vim: set sw=2 ts=2 expandtab : */
const db = require('../db/db');

async function getOne(chain_id, parcel_id) {
  return new Promise(function(resolve, reject) {
    var query_str;
    var query_var;
    query_str = "select * from s_parcels \
      where (chain_id = ? and parcel_id = ?)";
    query_var = [chain_id, parcel_id];
    db.query(query_str, query_var, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      for (i = 0; i < rows.length; i++) {
        rows[i].on_sale = rows[i].on_sale > 0 ? true : false;
      }
      resolve(rows);
    });
  });
}

async function getListByOwner(chain_id, address, top, from, num) {
  return new Promise(function(resolve, reject) {
    top = Number(top);
    from = Number(from);
    num = Number(num);
    var query_str;
    var query_var;
    if (top == 0) {
      query_str = "SELECT * \
        FROM s_parcels sp LEFT JOIN ( \
          SELECT rpt.parcel_id, MAX(rpt.height) h, ct.`type` \
            FROM r_parcel_tx rpt \
          LEFT JOIN c_txs ct \
            ON rpt.chain_id = ct.chain_id AND rpt.height = ct.height \
              AND rpt.`index` = ct.`index` \
          GROUP BY rpt.parcel_id \
        ) t ON sp.parcel_id = t.parcel_id \
        WHERE sp.chain_id = ? \
          AND sp.owner = ? \
          AND t.`type` = 'register' \
        ORDER BY t.h DESC \
        LIMIT ?, ? \
      ";
      query_var = [chain_id, address, from, num];
    } else {
      query_str = "SELECT * \
        FROM s_parcels sp LEFT JOIN ( \
          SELECT rpt.parcel_id, MAX(rpt.height) h, ct.`type` \
            FROM r_parcel_tx rpt \
          LEFT JOIN c_txs ct \
            ON rpt.chain_id = ct.chain_id AND rpt.height = ct.height \
              AND rpt.`index` = ct.`index` \
          GROUP BY rpt.parcel_id \
        ) t ON sp.parcel_id = t.parcel_id \
        WHERE sp.chain_id = ? \
          AND sp.owner = ? \
          AND t.`type` = 'register' \
          AND h <= ? \
        ORDER BY t.h DESC \
        LIMIT ?, ? \
      ";
      query_var = [chain_id, address, top, from, num];
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
  //getLast: getLast,
  //getList: getList,
  getListByOwner: getListByOwner,
}
