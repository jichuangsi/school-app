import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Mint from 'mint-ui';
import api from './api/api'
import VueCorvova from 'vue-cordova'
import echarts from 'echarts'
import '@/assets/styles/reset.css'
import '@/assets/styles/iconfont/iconfont.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
/* eslint-disable no-unused-vars */
// import vConsole from './utils/log'

Vue.use(VueAwesomeSwiper);
Vue.prototype.$echarts = echarts
Vue.use(VueCorvova);
Vue.use(Mint);
Vue.prototype.api = api;

Vue.config.productionTip = false;

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});
