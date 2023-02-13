import Vue from 'vue'
import moment from 'moment'
import { toLower } from 'lodash'

import App from './App.vue'
import router from './router'
import store from './store'
/* Styles import */
import '@/assets/styles/_global.scss'

/* Plugins import */
import '@/plugins/bootstrapConfig'
import '@/plugins/fontawesomeConfig'
import '@/plugins/veeValidateConfig'
import '@/plugins/registerServiceWorker'
import '@/plugins/vSelectConfig'
import '@/plugins/vueAwesomeCountdownConfig'
import '@/plugins/accountingConfig'

Vue.config.productionTip = false
Vue.config.silent = true
Vue.mixin({
  methods: {
    moment,
    toLower
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
