import axios from 'axios'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

function httpRequest(http) {
  http.interceptors.request.use(function (config) {
    Nprogress.start()
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  }, function (error) {
    console.log(error);
  })
  // axios响应拦截器
  http.interceptors.response.use(function (config) {
    if (config.status != 200) return this.$message.error('服务器异常')
    Nprogress.done()
    return config
  }, function (error) {
    console.log(error)
  })
}

export default {
  httpRequest
}