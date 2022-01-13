/* vim: set sw=2 ts=2 expandtab : */
const db = require('../db/db');

async function getAccountHistory(chain_id, address, anchor, from, num,
  include_tx, include_block) {
  return new Promise(function(resolve, reject) {
    anchor = Number(anchor);
    from = Number(from);
    num = Number(num);
    include_tx = include_tx === 'true';
    include_block = include_block === 'true';
    var query_str = "";
    var query_var = [];
    if (include_tx) {
      query_str += "\
        ( \
          SELECT rat.`chain_id`, rat.`address`, \
            rat.`height`, rat.`index`, rat.`amount`, \
            c_txs.`type` `tx_type`, c_txs.`hash` `tx_hash`, \
            c_txs.`sender` `tx_sender`, \
            c_txs.fee `tx_fee`, c_txs.payload `tx_payload` \
          FROM r_account_tx rat \
            LEFT JOIN c_txs ON rat.chain_id = c_txs.chain_id \
            AND rat.height = c_txs.height AND rat.`index` = c_txs.`index` \
          WHERE rat.chain_id = ? \
            AND rat.`address` = ? "
            + (anchor > 0 ? "AND rat.height <= ? " : "")
      + " ORDER BY rat.`seq` DESC LIMIT ? \
        ) \
      ";
      if (anchor > 0) {
        query_var = query_var.concat([
          chain_id, address, anchor, from + num]);
      } else {
        // anchor height will not be used when anchor = 0
        query_var = query_var.concat([
          chain_id, address, from + num]);
      }
    }
    if (include_block) {
      if (query_str.length > 0) {
        query_str += " UNION ALL ";
      }
      query_str += "\
        ( \
          SELECT rab.`chain_id`, rab.`address`, \
            rab.`height`, null `index`, rab.`amount`, \
            'block' `tx_type`, '' `tx_hash`, '' `tx_sender`, \
            '' `tx_fee`, '' `tx_payload` \
          FROM r_account_block rab \
          WHERE  rab.chain_id = ? \
            AND rab.`address` = ? "
            + (anchor > 0 ? "AND rab.height <= ? " : "")
      + " ORDER BY rab.`seq` DESC LIMIT ? \
        ) \
      ";
      if (anchor > 0) {
        query_var = query_var.concat([
          chain_id, address, anchor, from + num]);
      } else {
        // anchor height will not be used when anchor = 0
        query_var = query_var.concat([
          chain_id, address, from + num]);
      }
    }
    if (query_str.length == 0) {
      return resolve([]);
    }

    query_str += " ORDER BY `height` DESC, `index` DESC LIMIT ?, ?";
    query_var = query_var.concat([from, num]);

    db.query(query_str, query_var, function(err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

async function getUDCBalanceHistory(chain_id, address, udc, anchor, from, num) {
  return new Promise(function(resolve, reject) {
    udc = Number(udc);
    anchor = Number(anchor);
    from = Number(from);
    num = Number(num);
    var query_str = "";
    var query_var = [];
    if (anchor > 0) {
      query_str = "\
        SELECT r.chain_id, r.address, r.udc_id, r.height, r.`index`, r.amount, \
          t.`type` `tx_type`, t.`hash` `tx_hash`, t.`sender` `tx_sender`, \
          t.fee `tx_fee`, t.payload `tx_payload` \
        FROM explorer.r_balance_tx r LEFT JOIN c_txs t \
          ON r.chain_id = t.chain_id AND r.height = t.height \
          AND r.`index` = t.`index` \
        WHERE r.chain_id = ? AND r.address = ? AND r.udc_id = ? \
        AND r.height <= ? \
        ORDER BY r.height DESC, r.`index` DESC \
        LIMIT ?, ? \
      ";
      query_var = [chain_id, address, udc, anchor, from, num];
    } else {
      query_str = "\
        SELECT r.chain_id, r.address, r.udc_id, r.height, r.`index`, r.amount, \
          t.`type` `tx_type`, t.`hash` `tx_hash`, t.`sender` `tx_sender`, \
          t.fee `tx_fee`, t.payload `tx_payload` \
        FROM explorer.r_balance_tx r LEFT JOIN c_txs t \
          ON r.chain_id = t.chain_id AND r.height = t.height \
          AND r.`index` = t.`index` \
        WHERE r.chain_id = ? AND r.address = ? AND r.udc_id = ? \
        ORDER BY r.height DESC, r.`index` DESC \
        LIMIT ?, ? \
      ";
      query_var = [chain_id, address, udc, from, num];
    }
    db.query(query_str, query_var, function(err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

async function getParcelHistory(chain_id, parcel_id, top, from, num) {
  return new Promise(function(resolve, reject) {
    top = Number(top);
    from = Number(from);
    num = Number(num);
    var query_str;
    var query_var;
    query_str = "\
      SELECT rpt.`chain_id`, rpt.`parcel_id`, rpt.`height`, rpt.`index`, \
        ct.`type` `tx_type`, ct.`hash` `tx_hash`, \
        ct.`sender` `tx_sender`, \
        ct.fee `tx_fee`, ct.payload `tx_payload` \
      FROM `r_parcel_tx` rpt \
        LEFT JOIN `c_txs` ct \
        ON rpt.`chain_id` = ct.`chain_id` \
          AND rpt.`height` = ct.`height` \
          AND rpt.`index` = ct.`index`  \
      WHERE rpt.`chain_id` = ? AND rpt.`parcel_id` = ? \
      ORDER BY rpt.`height` DESC, rpt.`index` DESC \
      LIMIT ?, ? \
    ";
    query_var = [chain_id, parcel_id, from, num];
    db.query(query_str, query_var, function(err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

module.exports = {
  getAccountHistory,
  getUDCBalanceHistory,
  getParcelHistory,
}
