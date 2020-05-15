/* vim: set sw=2 ts=2 expandtab : */
const db = require('../db/db');

async function getOne(chain_id, node_id) {
  return new Promise(function(resolve, reject) {
    var query_str = "SELECT \
        n.`node_id`, n.`moniker`, \
        INET_NTOA(n.`ip_addr`) `ip_addr`, i.`n_peers`, i.`val_addr`, \
        i.`latest_block_height`, i.`latest_block_time`, i.`catching_up` \
      FROM \
        `nodes` n, `node_info` i \
        JOIN ( \
          SELECT \
            `chain_id`, `node_id`, \
            MAX(`latest_block_height`) `latest_block_height` \
          FROM `node_info` \
          WHERE `chain_id` = ? AND `node_id` = ? \
          GROUP BY `node_id` \
        ) m ON i.`chain_id` = m.`chain_id` \
        AND i.`node_id` = m.`node_id` \
        AND i.`latest_block_height` = m.`latest_block_height` \
      WHERE n.`chain_id` = m.`chain_id` AND n.`node_id` = m.`node_id`";
    query_var = [chain_id, node_id];
    val = {};
    db.query(query_str, query_var, function(err, rows, fields) {
        if(err) {
            return reject(err);
        }
        return resolve(rows[0]);
    });
  });
}

async function getList(chain_id, from, num) {
    return new Promise(function(resolve, reject) {
        from = Number(from);
        num = Number(num);
        var query_str = "SELECT \
            n.`node_id`, n.`moniker`, \
            INET_NTOA(n.`ip_addr`) `ip_addr`, i.`n_peers`, i.`val_addr`, \
            i.`latest_block_height`, i.`latest_block_time`, i.`catching_up` \
          FROM \
            `nodes` n, `node_info` i \
            JOIN ( \
              SELECT \
                `chain_id`, `node_id`, \
                MAX(`latest_block_height`) `latest_block_height` \
              FROM `node_info` \
              WHERE `chain_id` = ? \
              GROUP BY `node_id` \
            ) m ON i.`chain_id` = m.`chain_id` \
            AND i.`node_id` = m.`node_id` \
            AND i.`latest_block_height` = m.`latest_block_height` \
          WHERE n.`chain_id` = m.`chain_id` AND n.`node_id` = m.`node_id` \
          ORDER BY n.`moniker` \
          LIMIT ?, ?";
        var query_var = [chain_id, from, num];
        db.query(query_str, query_var, function(err, rows, fields) {
            if (err) {
                return reject(err);
            }
            return resolve(rows);
        });
    });
}

async function getHistory(chain_id, node_id, anchor, from, num) {
    return new Promise(function(resolve, resect) {
        from = Number(from);
        num = Number(num);
        var query_str;
        var query_var;
        if (anchor == 0) {
          query_str = "SELECT \
            n.`node_id`, n.`moniker`, \
            INET_NTOA(n.`ip_addr`) `ip_addr`, i.`n_peers`, i.`val_addr`, \
            i.`latest_block_height`, i.`latest_block_time`, i.`catching_up` \
        FROM \
            `nodes` n \
            JOIN `node_info` i ON n.`chain_id` = i.`chain_id` \
            AND n.`node_id` = i.`node_id` \
        WHERE n.`chain_id` = ? AND n.`node_id` = ? \
        ORDER BY i.`latest_block_height` DESC \
        LIMIT ?, ?";
        query_var = [chain_id, node_id, from, num];
        } else { 
          query_str = "SELECT \
              n.`node_id`, n.`moniker`, \
              INET_NTOA(n.`ip_addr`) `ip_addr`, i.`n_peers`, i.`val_addr`, \
              i.`latest_block_height`, i.`latest_block_time`, i.`catching_up` \
          FROM \
              `nodes` n \
              JOIN `node_info` i ON n.`chain_id` = i.`chain_id` \
              AND n.`node_id` = i.`node_id` \
          WHERE n.`chain_id` = ? AND n.`node_id` = ? \
          AND i.`latest_block_height` <= ? \
          ORDER BY i.`latest_block_height` DESC \
          LIMIT ?, ?";
          query_var = [chain_id, node_id, anchor, from, num];
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
