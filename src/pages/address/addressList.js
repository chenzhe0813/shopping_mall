// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './addressList.vue'
import 'mint-ui/lib/style.min.css'
import { Popup } from 'mint-ui';

Vue.component(Popup.name, Popup);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
