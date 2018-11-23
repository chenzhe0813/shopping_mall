<template>
  <div class="app-box">
    <div class="main-box">
      <div v-for="item in addrList" class="item-box">
        <div v-on:click="changeTab(item)" class="left-icon">
            <i v-if="item.is_default == 'Y'" class="iconfont icon-yuanquangou icon-selected"></i>
            <i v-if="!(item.is_default == 'Y')" class="iconfont icon-yuanquan1 icon-unselected"></i>
        </div>
        <div class="right-icon">
          <i class="iconfont icon-youjiantou1"></i>
        </div>
        <div v-on:click="seletedAddress(item)" class="center-box">
          <span>{{ item.recver_name }}&nbsp;&nbsp;&nbsp;&nbsp;{{ item.recver_tel }}</span><br/>
          <label>{{ item.user_addr_detail }}</label>
        </div>
      </div>
      <div v-if="addrList.length <= 0" class="undefined-address-box">还没地址，请新增地址</div>
    </div>

    <div v-on:click="showAddPanel" class="footer-box">
    +新增地址
    </div>
    <mt-popup 
      class="mint-popup-3"
      v-model="popupVisible"
      :modal="false"
      position="right">
      <div class="add-address-box">
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
    </mt-popup>

  </div>
</template>

<script>
import { getUrlParams, getParamsToken, saveCacheToken, getSaveCacheToken, payFunction, JumpPage } from '@/assets/js/utils'
import request from '@/assets/js/request';
import { Indicator, Toast, MessageBox } from 'mint-ui';
import 'mint-ui/lib/style.min.css';


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
    //把WEB中要注册的方法注册到bridge里面
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
      current_user_addr_id: '',
      addrList: [],
      popupVisible: false,
      userName: "",
      phone: "",
      addressText: "",
      addressListText: "",
      addressList: []
    };
  },
  created() {
    this.getToken();
    this.getAddressList()  
  },

  methods: {
    seletedAddress: function(item) {
      localStorage.setItem('_address_', JSON.stringify({
        isFill: true,
        data: {
          recver_name: item.recver_name,
          recver_tel: item.recver_tel,
          user_addr_detail: item.user_addr_detail,
          address_id: item.user_addr_id
        }
      }));
      this.closeWindow( {
        recver_name: item.recver_name,
        recver_tel: item.recver_tel,
        user_addr_detail: item.user_addr_detail,
        address_id: item.user_addr_id
      });
    },
    saveInfo: function() {

      
      if(this.userName.trim() == "") {
        // Toast('姓名不能为空！');
        MessageBox('提示', '姓名不能为空！');
        return ;
      }
      var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
      if(!myreg.test(this.phone.trim())) {
        // Toast('手机号格式不对！');
        MessageBox('提示', '手机号格式不对！');
        return ;
      }
      if(this.addressList.length <= 0) {
        // Toast('请选择省市区！');
        MessageBox('提示', '请选择省市区！');
        return ;
      }
      if(this.addressText.trim() == "") {
        // Toast('请输入详细地址！');
        MessageBox('提示', '请输入详细地址！');
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
          this.popupVisible = false;
          this.getAddressList();
          Toast('添加地址成功！');
      }).catch( err => {
          console.log(err)
          Toast('添加地址失败！');
      });
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
                bridge.callHandler('address', {}, function(response) {})
            })
        }
    },
    showAddPanel: function() {
      this.popupVisible = true;
    },
    changeTab: function(item) {
      if(this.current_user_addr_id == item.user_addr_id) {
        return ;
      }
      Indicator.open();
      request.actionUnasync({
          url: 'jd/addrDefault',
          method: 'post',
          data: {
            user_addr_id: item.user_addr_id
          }
      }).then( result => {
          console.log(result);
          Indicator.close();
          Toast('设置默认地址成功！');
          for(var i = 0 ; i < this.addrList.length ; i++) {
            this.addrList[i].is_default = 'N';
          }
          item.is_default = 'Y';
          this.current_user_addr_id = item.user_addr_id;
      }).catch( err => {
          console.log(err)
          Indicator.close();
          Toast('网络异常！');
      });
    },
    getAddressList: function() {
      Indicator.open();
      request.actionUnasync({
          url: 'jd/addrList',
          method: 'post',
          data: {}
      }).then( result => {
          console.log(result);
          Indicator.close();
          this.addrList = result.data.data;
          for(var i = 0 ; i < this.addrList.length ; i++) {
            if(this.addrList[i].is_default == 'Y') {
              this.current_user_addr_id = this.addrList[i].user_addr_id;
            }
          }
      }).catch( err => {
          console.log(err)
          Indicator.close();
          Toast('网络异常！');
      });
    },
    getToken() {
      let res = getParamsToken();
      // 保存近缓存
      saveCacheToken(res);
    }
  }
}
</script>

<style src="../iconfont/iconfont.css"></style>
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

        .item-box {
          height: 70px;
          background-color: #ffffff;
          margin-top: 7px;
          padding-left: 20px;
          padding-right: 20px;

          .left-icon {
            width: 20px;
            border: 0px solid red;
            height: 70px;
            float: left;
            line-height: 70px;

            .icon-unselected {
              font-size: 18px;
              color: #656565;
            }

            .icon-selected {
              font-size: 18px;
              color: #e03c45;
            }

          }

          .right-icon {
            width: 20px;
            border: 0px solid red;
            height: 70px;
            float: right;
            font-size: 20px;
            line-height: 70px;
            color: #7a7d84;
          }

          .center-box {
            margin: 5px 25px 0 25px;
            height: 70px;
            border: 0px solid blue;

            span {
              font-size: 14px;
              vertical-align: -18px;
              color: #303030;
            }

            label {
              font-size: 12px;
              color: #656565;
              vertical-align: -5px;
            }
          }
        }

        .undefined-address-box {
          height: 50px;
          text-align: center;
          padding-top: 20px;
          font-size: 15px;
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

      
      .mint-popup-3 {
        width: 100%;
        height: 100%;
        background-color: #fff;

        .add-address-box {
          border: 0px solid red;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;

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

      }
    }
</style>

<style>
  body {
    margin: 0 0 0 0;
  }
</style>
