import axios from 'axios'
import camelcaseKeys from 'camelcase-keys'

// axios.defaults.withCredentials = true;
const server = 'http://localhost:3000';
const options = { headers: { 
  // for CORS
  'Access-Control-Allow-Origin': '*',
} };

export default {
  getBlockStat() {
    return axios.get(`${server}/chain/amo-testnet-200306`,
      options)
      .then(res => {
        var chain = camelcaseKeys(res.data); 
        if (!chain.height) chain.height = 0;
        if (!chain.avgInterval) chain.Interval = 0;
        if (!chain.avgIncentive) chain.avgIncentive = 0;
        if (!chain.avgNumTxs) chain.avgNumTxs = 0;
        if (!chain.avgTxBytes) chain.avgTxBytes = 0;
        if (!chain.avgTxFee) chain.avgTxFee = 0;
        return Promise.resolve(chain);
      });
  },

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

  getTxStat() {
    return axios.get(`${server}/chain/amo-testnet-200306`,
      options)
      .then(res => {
        var chain = camelcaseKeys(res.data); 
        if (!chain.height) chain.height = 0;
        if (!chain.txHeight) chain.txHeight = 0;
        if (!chain.txIndex) chain.txIndex = 0;
        if (!chain.avgTxBytes) chain.avgTxBytes  = 0;
        if (!chain.avgTxFee) chain.avgTxFee  = 0;
        if (!chain.avgBindingLag) chain.avgBindingLag = 0;
        if (!chain.maxBindingLag) chain.maxBindingLag = 0;
        if (!chain.numTxsInvalid) chain.numTxsInvalid = 0;
        if (!chain.numTxs) chain.numTxs = 0;
        if (!chain.ratioInvalid) chain.ratioInvalid = 0;
        return Promise.resolve(chain);
      });
  },

  getTxs(from, num, order) {
    return axios.get(`${server}/chain/amo-testnet-200306/txs?from=${from}&num=${num}&order=${order}`,
      options)
      .then(res => {
        return Promise.resolve(res.data);
      });
  },
}
