import axios from 'axios'

// axios.defaults.withCredentials = true;

export default {

  getTest_2() {
    return axios.get(`/api/test2`)
  },

  getCurTime(){
    return axios.get(`/api/test3`)
  }
}
