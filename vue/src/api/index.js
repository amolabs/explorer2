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
        //block.txBytes = 0;
        //block.numTxs = 0;
        //block.numTxsValid = 0;
        //block.numTxsInvalid = 0;
        return Promise.resolve(block);
      });
  },

  getChain() {
    return axios.get(`${server}/chain/amo-testnet-200306`,
      options)
      .then(res => {
        var chain = camelcaseKeys(res.data); 
        if (!chain.avgTxFee) chain.avgTxFee = 0;
        return Promise.resolve(chain);
      });
  },
}
