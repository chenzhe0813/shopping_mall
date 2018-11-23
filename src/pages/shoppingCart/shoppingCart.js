// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './shoppingCart.vue'
import { CellSwipe, MessageBox } from 'mint-ui';
import 'mint-ui/lib/style.min.css'

Vue.component(CellSwipe.name, CellSwipe);
Vue.component('MessageBox', MessageBox);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
