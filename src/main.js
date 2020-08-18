import Vue from 'vue'
import App from './App'
import request from '@/utils/request.js'

Vue.config.productionTip = false

App.mpType = 'app'

Vue.use(request(Vue,{baseURL: 'https://www.uinav.com'})) // 前面Vue实例 , 后面基本接口地址
const app = new Vue({
  ...App
})
app.$mount()
