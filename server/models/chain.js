/* vim: set sw=2 ts=2 expandtab : */
const db = require('../db/db');
const block = require('./block');
const tx = require('./tx');

async function getSummary(chain_id) {
  return Promise.all([
    block.getStat(chain_id),
    block.getLast(chain_id),
    tx.getStat(chain_id),
    tx.getLast(chain_id),
  ])
    .then((res) => {
      ret = res[0];
      ret.height = res[1].height;
      ret.time = res[1].time;
      ret.num_txs_valid = res[2]?res[2].num_txs_valid:0
      ret.num_txs_invalid = res[2]?res[2].num_txs_invalid:0;
      ret.avg_binding_lag = res[2]?res[2].avg_binding_lag:0;
      ret.max_binding_lag = res[2]?res[2].max_binding_lag:0;
      ret.tx_height = res[3]?res[3].height:0;
      ret.tx_index = res[3]?res[3].index:0;
      return ret;
    });
}

module.exports = {
  getSummary: getSummary,
}
