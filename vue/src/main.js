import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './components'
import vuetify from './plugins/vuetify';
import api from './api';
import store from './store'
import plugin from './plugin'

Vue.config.productionTip = false;
Vue.prototype.$api = api;
Vue.use(plugin);

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
