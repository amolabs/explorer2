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

  getTest_2() {
    return axios.get(`/api/test2`)
  },

  getCurTime(){
    return axios.get(`/api/test3`)
  },

  watchTest(){
    return axios.get(`/api/watchTest`)
  },

  getTest_3() {
    return axios.get(`/api/test2`)
  },
}
