<template>
  <div class="app-box">
    <div class="main-box">
      <!-- <x-address style="display:none;" title="title" v-model="value" :list="ChinaAddressV4Data" placeholder="请选择地址" :show.sync="showAddress"></x-address> -->

      <div class="consignee-box">
        <span>收货人&nbsp;&nbsp;&nbsp;&nbsp;</span><input v-model="userName" placeholder="姓名" type="text" name="" />
      </div>
      <div class="consignee-box">
        <span>联系方式</span><input v-model="phone" placeholder="手机号码" type="text" name="" />
      </div>
      <div v-on:click="callNative" class="consignee-box">
        <!-- <span>所在地区</span><input placeholder="---请选择---" type="text" name="" /> -->
        <span>所在地区</span>
        <label  v-if="addressList.length <= 0">---请选择---</label>
        <span v-for="text in addressList" style="margin-left:8px;">{{ text }}</span>
      </div>
      <div style="overflow: hidden;" class="consignee-box">
        <span>详细地址</span><input v-model="addressText" placeholder="详细地址需填写到楼栋楼层楼号" type="text" name="" />
      </div>

      <div v-on:click="saveInfo" class="save-btn">确定</div>
    </div>

    <div class="footer-box">
    +新增地址
    </div>

  </div>
</template>

<script>
import { getUrlParams, getParamsToken, saveCacheToken, getSaveCacheToken, payFunction, JumpPage } from '@/assets/js/utils'
import request from '@/assets/js/request';
import { Indicator, Toast } from 'mint-ui';

window.setupWKWebViewJavascriptBridge = function(callback) {
  if (window.WKWebViewJavascriptBridge) { return callback(WKWebViewJavascriptBridge) }
  if (window.WKWVJBCallbacks) { return window.WKWVJBCallbacks.push(callback) }
  window.WKWVJBCallbacks = [callback]
  window.webkit.messageHandlers.iOS_Native_InjectJavascript.postMessage(null)
}


let u = navigator.userAgent,
app = navigator.appVersion;
let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

if(isIOS) {
  setupWKWebViewJavascriptBridge(function(bridge) {
    bridge.registerHandler('getAddressCallback', function(data, responseCallback) {
        window.getAddressCallback(data)
    })
  })
}

var watchData = null;
window.getAddressCallback = function(data) {
    watchData.addressList = data.split('-');
    watchData.addressListText = data.split('-').join("");
 }




export default {
  name: 'App',
  data() {
    return {
      isAllSelected: false,
      showAddress: true,
      value: "",
      title: "",
      addressList: [],
      addressListText: "",
      userName: "",
      phone: "",
      addressText: ""
    };
  },
  created() {
    this.getToken();
    this.addressListText = "";
    this.userName = "";
    this.phone = "";
    this.addressText = "";
    watchData = this;
  },
  methods: {
    changeTab: function(index) {
      
    },
    callNative: function() {

        let u = navigator.userAgent,
        app = navigator.appVersion;
        let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
        let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isAndroid) {
            if (Object.prototype.toString.call(window.JsCallApp.startWebActivity) === '[object Function]') {
                window.JsCallApp.showAddressPicker()
            }
        }
        if (isIOS) {
            setupWKWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler('address', {}, function(response) {
                })
            })
        }
    },
    closeWindow: function(params) {
        let u = navigator.userAgent,
        app = navigator.appVersion;
        let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
        let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isAndroid) {
            if (Object.prototype.toString.call(window.JsCallApp.directBack) === '[object Function]') {
                window.JsCallApp.refreshAddress('refreshAddressCallback')
            }
        }
        if (isIOS) {
            setupWKWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler('directBack', {func: 'refreshAddressCallback', params:params}, function(response) {})
            })
        }
    },
    getToken() {
      let res = getParamsToken();
      // 保存近缓存
      saveCacheToken(res);
    },
    saveInfo: function() {
      if(this.userName.trim() == "") {
        Toast('姓名不能为空！');
        return ;
      }
      var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
      if(!myreg.test(this.phone.trim())) {
        Toast('手机号格式不对！');
        return ;
      }
      // if(this.addressList.length <= 0) {
      //   Toast('请选择省市区！');
      //   return ;
      // }
      if(this.addressText.trim() == "") {
        Toast('请输入详细地址！');
        return ;
      }
      var self = this;

      Indicator.open();
      request.actionUnasync({
          url: 'jd/addAddr',
          method: 'post',
          data: {
            recver_name: this.userName,
            recver_tel: this.phone,
            user_addr_detail: this.addressListText+this.addressText,
            // user_addr_detail: '广东省深证市罗湖区xxxxxxxxxxx',
            is_default: 'Y'
          }
      }).then( result => {
          console.log(result);
          Indicator.close();
          localStorage.setItem('_address_', JSON.stringify({
            isFill: true,
            data: {
              recver_name: this.userName,
              recver_tel: this.phone,
              user_addr_detail: this.addressListText+this.addressText,
              address_id: result.data.data.address_id
            }
          }));
          Toast('添加地址成功！');
          var self = this;
          setTimeout(function(){
            self.closeWindow( {
              recver_name: self.userName,
              recver_tel: self.phone,
              user_addr_detail: self.addressListText+self.addressText,
              address_id: result.data.data.address_id
            });
          }, 1000);
      }).catch( err => {

          // alert(JSON.stringify({
          //     recver_name: this.userName,
          //     recver_tel: this.phone,
          //     user_addr_detail: this.addressListText+this.addressText,
          //     // address_id: result.data.data.address_id
          //   }));

          console.log(err)
          Toast('添加地址失败！');
      });
    }
  }
}
</script>

<style lang="scss" scoped type="text/css">
    .app-box {
      position: absolute;
      border: 0px solid red;
      background-color: #f3f3f3;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      .main-box {
        position: absolute;
        border: 0px solid blue;
        top: 0;
        left: 0;
        right: 0;
        bottom: 50px;
        overflow-y: auto;

        .consignee-box {
          height: 50px;
          border-bottom: 1px solid #d6d6d6;
          padding-left: 20px;
          font-size: 15px;
          line-height: 50px;
          background-color: #ffffff;

          input {
            height: 25px;
            line-height: 30px;
            background-color: #ffffff;
            border: 0;
            border-radius: 5px;
            width: 70%;
            outline: none;
            padding-left: 15px;
            font-size: 15px;
            vertical-align: -1px;
            -webkit-tap-highlight-color:rgba(255,0,0,0);
          }

          input::-webkit-input-placeholder {
            /* placeholder颜色  */
            color: #bbbbbb;
            /* color: #568fe9; */
            /* placeholder字体大小  */
            /* placeholder位置  */
            text-align: left;
            font-size: 15px;
          }

          label {
            margin-left: 10px;
            color: #bbbbbb;
          }

        }

        .save-btn {
          height: 45px;
          line-height: 45px;
          text-align: center;
          border-radius: 25px;
          background-color: #e03c45;
          width: 88%;
          margin: auto;
          margin-top: 50px;
          font-size: 17px;
          color: #f9e1ee;
        }
      }

      .footer-box {
        position: absolute;
        height: 50px;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #e03c45;
        font-size: 17px;
        text-align: center;
        line-height: 50px;
        color: #fffeff;
      }
    }
</style>

<style>
  body {
    margin: 0 0 0 0;
  }
</style>
