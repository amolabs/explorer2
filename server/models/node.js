/* vim: set sw=2 ts=2 expandtab : */
const db = require('../db/db');

async function getOne(chain_id, val_addr, from, to) {
  return new Promise(function(resolve, reject) {
    var query_str = "SELECT \
    n.`node_id`, n.`moniker`, ni.`val_addr`, \
    ni.`catching_up`, ni.`elapsed`, ni.`timestamp`, \
    ni.`latest_block_height`, ni.`latest_block_time`, \
    ut.`uptime` \
  FROM `nodes` n \
  JOIN `node_info` ni \
    ON n.`chain_id` = ni.`chain_id` \
    AND n.`node_id` = ni.`node_id` \
  JOIN ( \
    SELECT o.`node_id`, COUNT(o.`timestamp`)/g.`count_t`*100 `uptime` \
    FROM ( \
      SELECT `node_id`, `timestamp` \
      FROM `node_info` \
      WHERE `chain_id` = ? AND `val_addr` = ? AND `timestamp` BETWEEN ? AND ? \
    ) o \
    JOIN ( \
      SELECT COUNT(`timestamp`) `count_t` \
      FROM `node_info` \
      WHERE `chain_id` = 'ghost_chain_id' AND `timestamp` BETWEEN ? AND ? \
    ) g \
    GROUP BY o.`node_id` \
  ) ut \
  ON n.`node_id` = ut.`node_id` \
  JOIN ( \
    SELECT `node_id`, MAX(`timestamp`) `max_timestamp` \
    FROM `node_info` \
    WHERE `chain_id` = ? AND `val_addr` = ? AND `timestamp` BETWEEN ? AND ? \
    GROUP BY `node_id` \
  ) mt \
  ON n.`node_id` = mt.`node_id` AND ni.`timestamp` = mt.`max_timestamp` \
  ORDER BY n.`moniker`";
    query_var = [chain_id, val_addr, from, to, from, to, chain_id, val_addr, from, to];
    db.query(query_str, query_var, function(err, row, fields) {
        if(err) {
            return reject(err);
        }
        return resolve(row);
    });
  });
}

async function getList(chain_id, from, to) {
    return new Promise(function(resolve, reject) {
        var query_str = "SELECT \
              n.`node_id`, n.`moniker`, ni.`val_addr`, \
              ni.`catching_up`, ni.`elapsed`, ni.`timestamp`, \
              ni.`latest_block_height`, ni.`latest_block_time`, \
              ut.`uptime` \
            FROM `nodes` n \
            JOIN `node_info` ni \
              ON n.`chain_id` = ni.`chain_id` \
              AND n.`node_id` = ni.`node_id` \
            JOIN ( \
              SELECT o.`node_id`, COUNT(o.`timestamp`)/g.`count_t`*100 `uptime` \
              FROM ( \
                SELECT `node_id`, `timestamp` \
                FROM `node_info` \
                WHERE `chain_id` = ? AND `timestamp` BETWEEN ? AND ? \
              ) o \
              JOIN ( \
                SELECT COUNT(`timestamp`) `count_t` \
                FROM `node_info` \
                WHERE `chain_id` = 'ghost_chain_id' AND `timestamp` BETWEEN ? AND ? \
              ) g \
              GROUP BY o.`node_id` \
            ) ut \
            ON n.`node_id` = ut.`node_id` \
            JOIN ( \
              SELECT `node_id`, MAX(`timestamp`) `max_timestamp` \
              FROM `node_info` \
              WHERE `chain_id` = ? AND `timestamp` BETWEEN ? AND ? \
              GROUP BY `node_id` \
            ) mt \
            ON n.`node_id` = mt.`node_id` AND ni.`timestamp` = mt.`max_timestamp` \
            ORDER BY n.`moniker`";
        var query_var = [chain_id, from, to, from, to, chain_id, from, to];
        db.query(query_str, query_var, function(err, rows, fields) {
            if (err) {
                return reject(err);
            }
            return resolve(rows);
        });
    });
}

async function getHistory(chain_id, val_addr, anchor, from, num) {
    return new Promise(function(resolve, resect) {
        var query_str;
        var query_var;
        if (anchor == 0) {
          query_str = "SELECT \
            n.`node_id`, n.`moniker`, i.`val_addr`, \
            i.`latest_block_height`, i.`latest_block_time`, \
            i.`catching_up`, i.`elapsed`, i.`timestamp` \
        FROM \
            `nodes` n \
            JOIN `node_info` i ON n.`chain_id` = i.`chain_id` \
            AND n.`node_id` = i.`node_id` \
        WHERE n.`chain_id` = ? AND i.`val_addr` = ? \
        ORDER BY i.`latest_block_height` DESC \
        LIMIT ?, ?";
        query_var = [chain_id, val_addr, from, num];
        } else { 
          query_str = "SELECT \
              n.`node_id`, n.`moniker`, i.`val_addr`, \
              i.`latest_block_height`, i.`latest_block_time`, \
              i.`catching_up`, i.`elapsed`, i.`timestamp` \
          FROM \
              `nodes` n \
              JOIN `node_info` i ON n.`chain_id` = i.`chain_id` \
              AND n.`node_id` = i.`node_id` \
          WHERE n.`chain_id` = ? AND i.`val_addr` = ? \
          AND i.`latest_block_height` <= ? \
          ORDER BY i.`latest_block_height` DESC \
          LIMIT ?, ?";
          query_var = [chain_id, val_addr, anchor, from, num];
        }
        db.query(query_str, query_var, function(err, rows, fields) {
            if (err) {
                return reject(err);
            }
            return resolve(rows);
        });
    });
}

module.exports = {
    getOne: getOne,
    getList: getList,
    getHistory: getHistory,
}
