<template>
  <div class="app-box"> 
    <div class="g-main-box">
      <div class="g-slide-box">
        <!-- <div class="g-left-btn"><i class="iconfont icon-zuojiantou6"></i></div> -->
        <!-- <div class="g-right-btn"><i class="iconfont icon-gouwuche"></i></div> -->
        <mt-swipe :auto="4000">
          <mt-swipe-item>
            <div class="g-image-box">
              <img :src="'http://img13.360buyimg.com/n1/'+goodsDetails.imagePath">
            </div>
          </mt-swipe-item>

        </mt-swipe>

      </div>

      <div class="g-price-details">
        <div class="g-price-box">
          <span>优惠价</span>
          <span class="g-ptext">￥{{ goodsDetails.price.price }}</span>
          <span class="g-pnative">原价：{{ goodsDetails.price.jdPrice }} </span>
          <span class="p-rspan">积分可抵扣：￥0.00</span>
        </div>
        <div class="g-goods-description">{{ goodsDetails.name }}</div>
      </div>

      <!-- <div class="g-selet-text">
        <span class="g-left-text">已选</span>
        <span class="g-center-text">开心果100G, 1件</span>
        <span class="g-right-icon"><i class="iconfont icon-youjiantou1"></i></span>
      </div> -->

      <div class="g-address-box">
        <div class="g-selet-text" v-on:click="callNative">
          <span class="g-left-text">送至</span>
          <span class="g-point-icon"><i class="iconfont icon-dingwei003"></i></span>
          <!-- <span class="g-center-text">广东  深圳市  罗湖区</span> -->
          <span class="g-center-text">{{ addressList[0] }}  {{addressList[1]}}  {{addressList[2]}}</span>
          <span class="g-right-icon"><i class="iconfont icon-youjiantou1"></i></span>
        </div>

        <!-- <div class="g-to-time">
          <span class="g-first-text">现货</span>
          <span>23:00前下单,预计明天(10月23日)送达</span>
        </div> -->

        <!-- <div class="g-go-price">
          <span class="g-left-text">运费</span>
          <span class="g-center-text">免运费</span>
        </div> -->
      </div>

      <div class="g-comment-box">
        <div class="g-first-box">
          <span class="g-left-cell">评价</span>
          <span class="g-right-cell">好评度  <span style="color:red;">{{ commentsValue }}%</span></span>
        </div>
        <!-- <div style="height:15px;"></div> -->

        <!-- <div class="g-cell-box" v-for="o in [1, 1, 1, 1, 1]">
          <div class="g-cell-btext">美味可口6598</div>
        </div> -->
      </div>
      <div class="g-tab-box">
        <div class="g-tab-nav">
          <div class="g-tab-cell" v-for="(tab, _in) in tabdata" :key="_in">
            <div class="g-tab-text" 
                v-on:click="changeTab(tab)"
                :class="{'g-tab-selected-text':tab.isSelected}">
                {{tab.text}}
            </div>
          </div>
        </div>

        <div v-for="(tab, _in) in tabdata" v-show="tab.isSelected" v-html="tab.content" :key="_in" class="g-tab-content-box"></div>
      </div>

    </div>

    <div class="g-footer-box">
      <div v-on:click="JumpPageHre()" class="g-button by-btn">立即购买</div>
      <div v-on:click="addShoppingCart()" class="g-button add-btn">加入购物车</div>
      <div class="g-button-call" @click.stop="applySela">
        <i class="iconfont icon-dianhua"></i>
        <br/>
        <span class="g-call-text">联系客服</span>
      </div>
    </div>
    <!-- 添加客服弹窗 -->
    <contactTel v-if="contactTelnameData.status" :data="contactTelnameData"></contactTel>
  </div>
</template>

<script>
import { getUrlParams, getParamsToken, saveCacheToken, getSaveCacheToken, payFunction, JumpPage } from '@/assets/js/utils'

import request from '@/assets/js/request'
import { MessageBox, Indicator, Toast } from 'mint-ui';
import contactTel from '@/components/contactTel'

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
  watchData.addressList = data.split('-')
}



export default {
  name: 'App',
  data() {
      return {
        tabdata: [
          {text: '商品介绍', isSelected: true, content: ""},
          {text: '规格参数', isSelected: false, content: ""},
          {text: '售后保障', isSelected: false, content: ""}
        ],
        goodsDetails: {
          price: {
            price: "",
            jdPrice: ""
          }
        },
        commentsValue: 0,
        addressList: ['广东', '深圳市', '罗湖区'],
        sku: "209954",
        // sku: "217570",
        contactTelnameData: {
            status : false,
            messageText : '需要咨询请联系客服，客服提供周到的咨询服务，希望你能支持和理解。'
        },
      };
  },
  components : {
    contactTel
  },
  created() {
    this.getToken();
    var params = getUrlParams();
    if(params.sku) {
      this.sku = params.sku;
    }
    this.getGoodsDetails();
    this.getComments()
    watchData = this;
  },
  methods: {
    addShoppingCart: function() {
      // Indicator.open();
      request.actionUnasync({
          url: 'jd/addShoppingCat',
          method: 'post',
          data: {
            sku: this.sku, 
            num: 1
          }
      }).then( result => {
          console.log(result);
          console.log(JSON.stringify(result))
          // result.data.data;
          Indicator.close();

          Toast('加入购物车成功！');
      }).catch( err => {
        console.log(err)
        // Indicator.close();

        Toast('加入购物车失败！');
      });
    },
    changeTab: function(item) {
      for(var i = 0; i < this.tabdata.length; i++) {
        this.tabdata[i].isSelected = false;
      }
      item.isSelected = true;
    },
    getGoodsDetails: function() {
      // Indicator.open();
      request.actionUnasync({
          url: 'jd/goodsInfo',
          method: 'post',
          data: {
            sku: this.sku
          }
      }).then( result => {
          console.log(result);
          // console.log(JSON.stringify(result))
          if(result.data.code == 1000) {
            result.data.data.count = 1;
            this.goodsDetails = result.data.data;
            // localStorage.setItem("_goodsDetails_",JSON.stringify(result.data.data));
            

            this.tabdata[0].content = result.data.data.introduction;
            this.tabdata[1].content = result.data.data.param;
          }
          // Indicator.close();
      }).catch( err => {
        console.log(err)
      });

    },
    applySela() {
        this.contactTelnameData.status = true;
    },
    JumpPageHre() {
        localStorage.setItem("_goodsDetails_",JSON.stringify({
          access: 'goodsDetails',
          data: [this.goodsDetails]
        }));
        // window.location.href = "http://192.168.1.101:8080/submitOrder.html?token=25e629247c683ae1dff49192323333";
        // return ;
        var result = {
          token : getSaveCacheToken()
        }
        JumpPage({
            href : `${request.getUrlbefore()}/submitOrder.html`,
            cache : true,
            params : result
        })
    },

    getToken() {
      let res = getParamsToken();
      // 保存近缓存
      saveCacheToken(res);
    },

    callNative: function() {
        return ;
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

    getComments: function() {
      // Indicator.open();
      request.actionUnasync({
          url: 'jd/goodCommentSummary',
          method: 'post',
          data: {
            sku: this.sku
          }
      }).then( result => {
          console.log(result);
          // Indicator.close();
          this.commentsValue = result.data.data[0].goodRate * 100;
      }).catch( err => {
        console.log(err)
      });
    }
  }
}

</script>

<style src="@/assets/css/base.css"></style>
<style src="../iconfont/iconfont.css"></style>
<style src="./css/jdcss.css"></style>


<style lang="scss" scoped type="text/css">
    .app-box {
      font-size: 14px;
      border: 0px solid red;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      .g-main-box {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 50px;
        border: 0px solid blue;
        background-color: #f3f3f3;
        overflow-y: auto;   

        .g-slide-box {
          height: 380px;
          border: 0px solid red;

          .g-left-btn {
            position: absolute;
            width: 30px;
            height: 30px;
            left: 20px;
            top: 20px;            
            z-index: 9;
            opacity: .4;

            i {
              font-size: 30px;
            }
          }

          .g-right-btn {
            position: absolute;
            width: 30px;
            height: 30px;
            right: 20px;
            top: 20px;
            z-index: 9;
            opacity: .4;

            i {
              font-size: 30px;
            }

          }


          .g-image-box {
            width: 100%;
            height: 100%;

            img {
              width: 100%;
              height: 100%;
              border: 0;
            }
          }
        }   

        .g-price-details {
          margin-top: 10px;
          background-color: #ffffff;
          overflow: hidden;

          .g-price-box {
            height: 40px;
            border: 0px solid red;
            font-size: 12px;
            padding-left: 5px;
            padding-right: 5px;

            span {
              line-height: 50px;
            }

            .g-ptext {
              color: #dc2400;
              font-weight: bold;
              font-size: 16px;
            }

            .g-pnative {
              color: #b9b9b9;
              text-decoration: line-through;
            }

            .p-rspan {
              float: right;
              margin-right: 0;
            }
          }

          .g-goods-description {
            font-size: 14px;
            font-weight: 500;
            padding-left: 5px;
            padding-right: 5px;
            padding-bottom: 15px;
            line-height: 20px;
            border: 0px solid red;
            text-align:justify;
            -webkit-text-align-last:justify;
          }
        }

        .g-selet-text {
          height: 45px;
          margin-top: 0px;
          background-color: #ffffff;
          padding-left: 5px;
          padding-right: 5px;

          span {
            line-height: 45px;
          }

          .g-left-text {
            font-size: 14px;
            color: #979797;
          }

          .g-center-text {
            font-size: 16px;
            font-weight: bold;
            color: #333333;
            margin-left: 5px;
          }

          .g-right-icon {
            float: right;
          }
        }

        .g-address-box {
          background-color: #ffffff;
          margin-top: 10px;
          border: 0px solid red;
          overflow: hidden;

          .g-selet-text {
            height: 45px;
            margin-top: 0px;
            background-color: #ffffff;
            padding-left: 5px;
            padding-right: 5px;

            span {
              line-height: 45px;
            }

            .g-left-text {
              font-size: 14px;
              color: #979797;
            }

            .g-point-icon {
              i {
                font-size: 20px;
                color : rgb(153, 153, 153);
              }
            }

            .g-center-text {
              font-size: 14px;
              font-weight: 500;
              color: rgb(51, 51, 51);
              margin-left: -3px;
            }

            .g-right-icon {
              float: right;
              color: #999;
            }
          }

          .g-to-time {
            height: 30px;
            border: 0px solid red;
            margin-left: 40px;
            line-height: 30px;
            font-size: 14px;
            overflow: hidden;

            .g-first-text {
              font-weight: bold;
              color: #dc2400;
            }
          }

          .g-go-price {
            height: 30px;            
            background-color: #ffffff;
            padding-left: 5px;
            padding-right: 5px;
            padding-bottom: 5px;
            border: 0px solid red;

            span {
              line-height: 30px;
            }

            .g-left-text {
              font-size: 14px;
              color: #979797;
            }

            .g-center-text {
              font-size: 16px;
              font-weight: bold;
              color: #333333;
              margin-left: 5px;
            }
          }
        }

        .g-comment-box {
          margin-top: 10px;
          background-color: #ffffff;
          border: 1px solid  #ffffff;
          overflow: hidden;
          padding-bottom: 10px;

          .g-first-box {
            height: 18px;
            margin: 13px 5px 0 5px;
            border-left: 4px solid #df2300;
            line-height: 18px;

            .g-left-cell {
              font-weight: 500;
              margin-left: 8px;
              font-size: 14px;
            }

            .g-right-cell {
              float: right;
              color: #7b7b7b;
              font-size: 14px;
            }
          }

          .g-cell-box {
            width: 33.33%;
            border: 0px solid red;
            height: 30px;
            float: left;

            .g-cell-btext {
              height: 25px;
              width: 75%;
              overflow: hidden;
              margin: auto;
              border-radius: 10px;
              color: #7b7b7b;
              background-color: #f6f6f6;
              font-size: 13px;
              line-height: 25px;
              text-align: center;
            }
          }
        }

        .g-tab-box {
          background-color: #ffffff;
          margin-top: 10px;
          overflow: hidden;

          .g-tab-nav {
            height: 50px;
            border-bottom: 1px solid #e3e3e3;

            .g-tab-cell {
              width: 33.33%;
              height: 50px;
              text-align: center;
              float: left;

              .g-tab-text {
                color: #323232;
                font-size: 14px;
                margin: auto;
                line-height: 49px;
                height: 49px;
                width: 65%;
              }

              .g-tab-selected-text {
                border-bottom: 2px solid red;
                color: #df363d;
              }
            }
          }

          .g-tab-content-box {
            height: auto;
            border: 0px solid green;
            overflow-x: auto;
            img{
              max-width: 100%;
            }
          }
        }
      }

      .g-footer-box {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 50px;
        border: 0px solid red;

        .g-button {
          width: 30%;
          float: right;
          height: 50px;
          line-height: 50px;
          text-align: center;
          font-size: 16px;
        }

        .by-btn {
          color: #fefffd;
          background-color: #e03c45;
        }

        .add-btn {
          color: #fff9fa;
          background-color: #ff9c1a;
          margin-right: 1px;
        }

        .g-button-call {
          height: 50px;
          width: 70px;
          border: 0px solid red;
          float: right;
          font-size: 12px;
          text-align: center;
          color: #7b7e8d;

          i {
            font-size: 30px;
            color: #7b7e8d;
          }

          span {
            margin-top: -3px;
            display: block;
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
