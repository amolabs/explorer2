/* vim: set sw=2 ts=2 expandtab : */
const db = require('../db/db');

async function getOne(chain_id, draft_id) {
  return new Promise(function(resolve, reject) {
    var query_str;
    var query_var;
    query_str = "select * from s_drafts \
      where (chain_id = ?) and (draft_id = ?)";
    query_var = [chain_id, draft_id];
    db.query(query_str, query_var, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows[0]);
    });
  });
}

async function getList(chain_id, anchor, from, num) {
  return new Promise(function(resolve, reject) {
    anchor = Number(anchor);
    from = Number(from);
    num = Number(num);
    var query_str;
    var query_var;
    if (anchor == 0) {
      query_str = "SELECT * FROM `s_drafts` \
        WHERE (`chain_id` = ?) \
        ORDER BY `draft_id` DESC LIMIT ?,?";
      query_var = [chain_id, from, num];
    } else {
      query_str = "SELECT * FROM `s_drafts` \
        WHERE (`chain_id` = ?) AND (`draft_id` <= ?) \
        ORDER BY `draft_id` DESC LIMIT ?,?";
      query_var = [chain_id, anchor, from, num];
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
  getOne: getOne,
  getList: getList,
}
