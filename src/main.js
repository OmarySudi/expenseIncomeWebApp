import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuelidate from 'vuelidate'
import {auth} from './firebase'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false
Vue.use(Vuelidate)
let app;

auth.onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }
})
