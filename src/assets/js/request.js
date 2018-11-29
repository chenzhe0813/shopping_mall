import axios from 'axios'
import { getSaveCacheToken } from './utils'

const instance = axios.create({
  withCredentials: true
})
// 设置超时
instance.defaults.timeout = 0;
// 默认请求方式
instance.defaults.method = 'get'
let token = { 'token': '' }

const baseURL = 'http://findfocus.shangjinlantu.com/';
// const baseURL = 'http://fxjd.jurenchina.net/findfocus/public/index.php/';
export default {
  async actionUnasync (payload) {
    let result
    payload = payload || {}
    if (token.token.length === 0 && getSaveCacheToken()) {
      token = { 'token': getSaveCacheToken() }
    }
    try {
      result = new Promise(async (resolve, reject) => {
        let paramsData = {}
        if (payload.type === true) {
          paramsData = {}
        } else if (payload.method.toLowerCase() === 'get') {
          paramsData.params = {
            ...payload.data,
            ...token
          }
        } else {
          paramsData.data = {
            ...payload.data,
            ...token,
            // token:'25e629247c683ae1dff49192323333'
          }
        }
        await axios({
          url: `${baseURL}${payload.url}`,
          method: payload.method.toLowerCase(),
          ...paramsData
        }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    } catch (e) {
      throw Error('错误：请求报错')
    }
    return result
  },
  updateToken (newToken) {
    token = { 'token': newToken }
  },
  getUrlbefore () {
    // return 'http://fxjd.jurenchina.net/dist';
    return 'http://websource.shangjinlantu.com/jd/dist'
    // return 'http://192.168.2.141:8080/'
  }
}
