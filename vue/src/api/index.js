import axios from 'axios'

// axios.defaults.withCredentials = true;
const server = 'http://localhost:3000';
const options = { headers: { 
  // for CORS
  'Access-Control-Allow-Origin': '*',
} };

export default {

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
