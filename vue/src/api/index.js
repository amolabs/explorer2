import axios from 'axios'
import camelcaseKeys from 'camelcase-keys'

// axios.defaults.withCredentials = true;
const server = 'http://localhost:3000';
const options = { headers: { 
  // for CORS
  'Access-Control-Allow-Origin': '*',
} };

export default {
  getBlock(height) {
    return axios.get(`${server}/chain/amo-testnet-200306/blocks/${height}`,
      options)
      .then(res => {
        var block = camelcaseKeys(res.data);
        if (!block.txBytes) block.txBytes = 0;
        if (!block.numTxs) block.numTxs = 0;
        if (!block.numTxsValid) block.numTxsValid = 0;
        if (!block.numTxsInvalid) block.numTxsInvalid = 0;
        return Promise.resolve(block);
      });
  },

  getBlocks(from, num, order) {
    return axios.get(`${server}/chain/amo-testnet-200306/blocks?from=${from}&num=${num}&order=${order}`,
      options)
      .then(res => {
        return Promise.resolve(res.data);
      });
  },

  getChain() {
    return axios.get(`${server}/chain/amo-testnet-200306`,
      options)
      .then(res => {
        var chain = camelcaseKeys(res.data); 
        if (!chain.avgInterval) chain.Interval = 0;
        if (!chain.avgIncentive) chain.avgIncentive = 0;
        if (!chain.avgNumTxs) chain.avgNumTxs = 0;
        if (!chain.avgTxBytes) chain.avgTxBytes = 0;
        if (!chain.avgTxFee) chain.avgTxFee = 0;
        return Promise.resolve(chain);
      });
  },
}
