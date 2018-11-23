import Vue from 'vue'

function urlParams (payload) {
  if (Object.prototype.toString.call(payload) !== '[object Object]') return ''
  let result = ''
  Object.keys(payload).forEach(v => {
    let res = `${v}=${payload[v]}`
    result += `&${res}`
  })
  return result
}

var u = navigator.userAgent,
  app = navigator.appVersion;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

function setupWKWebViewJavascriptBridge(callback) {
  if (window.WKWebViewJavascriptBridge) { 
    return callback(WKWebViewJavascriptBridge)
  }
  if (window.WKWVJBCallbacks) {
     return window.WKWVJBCallbacks.push(callback)
  }
  window.WKWVJBCallbacks = [callback]
  window.webkit.messageHandlers.iOS_Native_InjectJavascript.postMessage(null)
}
if(isIOS){
  setupWKWebViewJavascriptBridge();
}

function setupWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
  if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
  window.WVJBCallbacks = [callback];
  var WVJBIframe = document.createElement('iframe');
  WVJBIframe.style.display = 'none';
  WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
}

// 跳转调用接口
function JumpPageH (payload) {
  
  // let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
  // let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
 
  if (isAndroid) {
      if (Object.prototype.toString.call(window.JsCallApp.startWebActivity) === '[object Function]') {
          window.JsCallApp.startWebActivity(payload)
      }
  }

  if (isIOS) {
      setupWKWebViewJavascriptBridge(function(bridge) {
          bridge.callHandler('direct', { 'uri' : payload }, function(response) {})
      })
  }
}

// 跳转页面
export const JumpPage = function (payload) {
  // 判断是否有全局跳转方法
  if (Object.prototype.toString.call(JumpPageH) === '[object Function]') {
    let url = `${payload.href}?${payload.cache ? '_r=' + (new Date()).valueOf() : ''}${urlParams(payload.params)}`
    JumpPageH(url)
  } else {
    let url = `${payload.href}?${payload.cache ? '_r=' + (new Date()).valueOf() : ''}${urlParams(payload.params)}`
    window.location.href = url
  }
}

// 获取参数
export const getUrlParams = function (payload) {
  // 判断是否有获取参数的方法
  if (Object.prototype.toString.call(window.getParamsUrl) === '[object Function]') {
    window.getParamsUrl()
  } else {
    let url = window.location.href
    let result = {}
    if (url.indexOf('?') !== -1) {
      let urlArr = url.split('?')
      for (let i = 1; i < urlArr.length; i++) {
        if (urlArr[i] && urlArr[i].indexOf('&') !== -1) {
          let urlArrChild = urlArr[i].split('&')
          urlArrChild.forEach(v => {
            if (v.indexOf('=') !== -1) {
              let paramsStr = v.split('=')
              result[paramsStr[0]] = paramsStr[1]
            }
          })
        } else if (urlArr[i] && urlArr[i].indexOf('=') !== -1) {
          let paramsStr = urlArr[i].split('=')
          result[paramsStr[0]] = paramsStr[1]
        }
      }
    }
    Object.keys(result).forEach(v2 => {
      if (result[v2].indexOf('#/')) {
        result[v2] = result[v2].split('#/')[0]
      }
    })
    return result
  }
}

// 获取参数上的token
export const getParamsToken = function (payload) {
  // 判断是否有获取参数的方法
  if (Object.prototype.toString.call(window.getParamsUrl) === '[object Function]') {
    window.getParamsUrl()
  } else {
    let url = window.location.href
    let result = {}
    if (url.indexOf('?') !== -1) {
      let urlArr = url.split('?')
      for (let i = 1; i < urlArr.length; i++) {
        if (urlArr[i] && urlArr[i].indexOf('&') !== -1) {
          let urlArrChild = urlArr[i].split('&')
          urlArrChild.forEach(v => {
            if (v.indexOf('=') !== -1) {
              let paramsStr = v.split('=')
              result[paramsStr[0]] = paramsStr[1]
            }
          })
        } else if (urlArr[i] && urlArr[i].indexOf('=') !== -1) {
          let paramsStr = urlArr[i].split('=')
          result[paramsStr[0]] = paramsStr[1]
        }
      }
    }
    Object.keys(result).forEach(v2 => {
      if (result[v2].indexOf('#/')) {
        result[v2] = result[v2].split('#/')[0]
      }
    })
    return result.token || ''
  }
}

// 保存缓存token
export const saveCacheToken = function (payload) {
  if (typeof payload !== 'string') return false
  let token = {
    'token': payload
  }
  window.sessionStorage.setItem('_savePageCurrentCacheToken_', JSON.stringify(token))
}

// 获取保存缓存的token
export const getSaveCacheToken = function () {
  let result = ''
  if (window.sessionStorage.getItem('_savePageCurrentCacheToken_')) {
    let getChcheToken = window.sessionStorage.getItem('_savePageCurrentCacheToken_')
    if (getChcheToken && getChcheToken.length > 0 && getChcheToken.indexOf('{') !== -1) {
      let getChcheTokenObj = JSON.parse(getChcheToken)
      if (getChcheTokenObj.token) {
        result = getChcheTokenObj.token
      }
    }
  }
  return result
}

// 通信介质
export const Brige = new Vue()

// 保存sessionStorage
export const SaveSessionStorage = function (payload) {
  if (Object.prototype.toString.call(payload) !== '[object Object]') return false
  if (payload.hasOwnProperty('key') && payload.hasOwnProperty('value')) {
    if (Object.prototype.toString.call(payload.value) === '[object Object]' || Array.isArray(payload.value)) {
      window.sessionStorage.setItem(payload.key, JSON.stringify(payload.value))
    } else {
      window.sessionStorage.setItem(payload.key, payload.value)
    }
  }
}

// 获取sessionStorage
export const getSessionStorage = function (payload) {
  if (Object.prototype.toString.call(payload) !== '[object Object]') return ''
  if (payload.hasOwnProperty('key')) {
    let res = window.sessionStorage.getItem(payload)
    if (res) {
      if (res.indexOf('{') !== -1 || res.indexOf('[') !== -1) {
        return JSON.parse(res)
      } else {
        return res
      }
    } else {
      return ''
    }
  }
}

// 保存localStorage
export const SaveLocalStorage = function (payload) {
  if (Object.prototype.toString.call(payload) !== '[object Object]') return false
  if (payload.hasOwnProperty('key') && payload.hasOwnProperty('value')) {
    if (Object.prototype.toString.call(payload.value) === '[object Object]' || Array.isArray(payload.value)) {
      localStorage.setItem(payload.key, JSON.stringify(payload.value))
    } else {
      localStorage.setItem(payload.key, payload.value)
    }
  }
}

// 获取localStorage
export const getLocalStorage = function (payload) {
  if (Object.prototype.toString.call(payload) !== '[object Object]') return ''
  if (payload.hasOwnProperty('key')) {
    let res = localStorage.getItem(payload)
    if (res) {
      if (res.indexOf('{') !== -1 || res.indexOf('[') !== -1) {
        return JSON.parse(res)
      } else {
        return res
      }
    } else {
      return ''
    }
  }
}

// 拨打电话
export const callPhone = function (payload) {
  if (Object.prototype.toString.call(payload) !== '[object Object]') return false
  if (payload.hasOwnProperty('tel') && typeof payload.tel === 'string') {
    let tela = document.createElement('a')
    tela.href = `tel:${payload.tel}`
    tela.style.display = 'none'
    document.body.appendChild(tela)
    tela.click()
    setTimeout(() => {
      tela.parentNode.removeChild(tela)
    }, 350)
  }
}

// 支付调用接口
export const payFunction = function (item) {
    let u = navigator.userAgent, 
    app = navigator.appVersion;
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
    let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
        if (Object.prototype.toString.call(window.JsCallApp.payByAliPay) === '[object Function]') {
            window.JsCallApp.payByAliPay(item.orderString);
        }
    }
    if (isIOS) {
        setupWKWebViewJavascriptBridge(function(bridge) {
            bridge.callHandler('alipay', { 'order' : item.orderString }, function(response) {})
        });
    }
}

// 复制剪切板（传给原生）
export const copyString = function (payload) {
  let u = navigator.userAgent, app = navigator.appVersion;
  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
  let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  if (isAndroid) {
    if (Object.prototype.toString.call(window.JsCallApp.copyValue) === '[object Function]') {
      window.JsCallApp.copyValue(payload)
    }
  }
  if (isIOS) {
    setupWKWebViewJavascriptBridge(function (bridge) {
      bridge.callHandler('copyValue', { 'str' : payload }, function (response) {})
    })
  }
}

// 跳转调用接口
export const JumpPageBack = function () {
    let u = navigator.userAgent,
    app = navigator.appVersion;
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
    let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
        if (Object.prototype.toString.call(window.JsCallApp.directBack) === '[object Function]') {
            window.JsCallApp.directBack()
        }
    }
    if (isIOS) {
        setupWKWebViewJavascriptBridge(function(bridge) {
            bridge.callHandler('directBack', { 'refresh' : true }, function(response) {})
        })
    }
}
