import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store/index';
// 全局css
import './assets/css/global.css'
import './plugins/element.js'
// nprogress 请求进度条导入
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)
import '../public/UEditor/ueditor.config.js'
import '../public/UEditor/ueditor.all.js'
// import '../public/UEditor/ueditor.all.min.js'
import '../public/UEditor/lang/zh-cn/zh-cn.js'
import '../public/UEditor/ueditor.parse'
import '../public/UEditor/themes/default/css/ueditor.css'
import axiosUtils from './assets/js/configAxios'
// 禁止使用浏览器后退
// window.addEventListener('popstate', function() {
//   history.pushState(null, null, document.URL)
// })
// 打印功能
import Print from 'vue-print-nb'
Vue.use(Print);
// 引入md5加密
import md5 from 'js-md5'
Vue.prototype.$md5 = md5
import animated from 'animate.css' // npm install animate.css --save安装，在引入
Vue.use(animated)
// 导入axios
import axios from 'axios'
// 配置axios
let http = axios.create({
  // 测试
  // baseURL: 'http://192.168.0.111:8085/zhuoya-web/',
  // 正式
  baseURL: 'http://www.phmzykj.com/zhuoya-final/',
  timeout: 30000
});
let sheet = axios.create({
  // 测试
  // baseURL: 'http://192.168.0.111:8086/zhuoya-sheet/',
  // 正式
  baseURL: 'http://www.phmzykj.com/zhuoya-sheet-final/',
  timeout: 30000
});
axiosUtils.httpRequest(http);
axiosUtils.httpRequest(sheet);
Vue.prototype.$http = http
Vue.prototype.$sheet = sheet
// 二维码跳转地址
Vue.prototype.$code = 'http://192.168.0.120:8080/#/userInfo'
// 文件上传地址
Vue.prototype.UPLOAD_IMG = 'http://www.phmzykj.com/zhuoya_manager/oss/fileUpload.do'
Vue.prototype.SHEET_IMG = 'http://www.phmzykj.com/zhuoya-sheet-final/upload'
Vue.config.productionTip = false

// 弹框拖拽功能
import './assets/js/directives.js'
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')