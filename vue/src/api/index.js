import axios from 'axios'
import camelcaseKeys from 'camelcase-keys'

// axios.defaults.withCredentials = true;
const server = 'http://explorer.amolabs.io/api';
const options = { headers: { // for CORS
  'Access-Control-Allow-Origin': '*',
} };

export default {
  getNetworks() {
    return axios.get(`${server}/networks`, options)
      .then(res => {
        var networks = [];
        for (var i = 0; i < res.data.length; i++) {
          var net = camelcaseKeys(res.data[i]);
          networks.push(net);
        }
        return networks;
      });
  },

  getChainStat(chainId, num_blks) {
    num_blks = num_blks || 1000;
    return axios.get(`${server}/chain/${chainId}?num_blks=${num_blks}`,
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

  getBlockStat(chainId, statRange) {
    return axios.get(`${server}/chain/${chainId}/blocks?stat&num_blks=${statRange}`,
      options)
      .then(res => {
        var stat = camelcaseKeys(res.data); 
        if (!stat.lastHeight) stat.lastHeight = 0;
        if (!stat.avgInterval) stat.Interval = 0;
        if (!stat.avgIncentive) stat.avgIncentive = 0;
        if (!stat.avgNumTxs) stat.avgNumTxs = 0;
        if (!stat.avgTxBytes) stat.avgTxBytes = 0;
        return Promise.resolve(stat);
      });
  },

  getBlock(chainId, height) {
    return axios.get(`${server}/chain/${chainId}/blocks/${height}`,
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

  getBlocks(chainId, from, num, order) {
    return axios.get(`${server}/chain/${chainId}/blocks?from=${from}&num=${num}&order=${order}`,
      options)
      .then(res => {
        return Promise.resolve(res.data);
      });
  },

  getTxStat(chainId) { // TODO: statRange
    return axios.get(`${server}/chain/${chainId}`,
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

  getTx(chainId, hash) {
    return axios.get(`${server}/chain/${chainId}/txs/${hash}`,
      options)
      .then(res => {
        var tx = camelcaseKeys(res.data);
        return Promise.resolve(tx[0]);
      });
  },

  getTxs(chainId, top, from, num) {
    return axios.get(`${server}/chain/${chainId}/txs?top=${top}&from=${from}&num=${num}`,
      options)
      .then(res => {
        return Promise.resolve(res.data);
      });
  },

  getTxsByBlock(chainId, height, from, num) {
    return axios.get(`${server}/chain/${chainId}/blocks/${height}/txs?from=${from}&num=${num}`,
      options)
      .then(res => {
        return Promise.resolve(res.data);
      });
  },

  getAccount(chainId, address) {
    return axios.get(`${server}/chain/${chainId}/accounts/${address}`,
      options)
      .then(res => {
        return Promise.resolve(res.data);
      });
  },

  getTxsBySender(chainId, address, top, from, num) {
    return axios.get(`${server}/chain/${chainId}/accounts/${address}/txs?top=${top}&from=${from}&num=${num}`,
      options)
      .then(res => {
        return Promise.resolve(res.data);
      });
  },

  getValidatorStat(chainId) {
    return axios.get(`${server}/chain/${chainId}`,
      options)
      .then(res => {
        var chain = camelcaseKeys(res.data); 
        if (!chain.num) chain.num = 0;
        if (!chain.avgOnline) chain.avgOnline = 0;
        if (!chain.totalEffStakes) chain.totalEffStakes = 0;
        if (!chain.avgEffStake) chain.avgEffStake = 0;
        return Promise.resolve(chain);
      });
  },

  getIncentiveStat(chainId) {
    return axios.get(`${server}/chain/${chainId}`,
      options)
      .then(res => {
        var chain = camelcaseKeys(res.data); 
        if (!chain.avgIncentive) chain.avgIncentive = 0;
        if (!chain.avgReward) chain.avgReward = 0;
        if (!chain.avgTxFee) chain.avgTxFee = 0;
        if (!chain.estInterest) chain.estInterest = 0;
        return Promise.resolve(chain);
      });
  },

  getValidators(chainId, from, num) {
    return axios.get(`${server}/chain/${chainId}/accounts?validators&from=${from}&num=${num}`,
      options)
      .then(res => {
        //var vals = camelcaseKeys(res.data);
        var vals = [];
        for (var i = 0; i < res.data.length; i++) {
          var val = camelcaseKeys(res.data[i]);
          val['activity'] = 100;
          vals.push(val);
        }
        return Promise.resolve(vals);
      });
  },
}
