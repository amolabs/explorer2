import axios from 'axios'

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
