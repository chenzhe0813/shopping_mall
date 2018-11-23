<template>
  <div class="app-box">
    <div class="main-box">
      <div class="item-box">
        <div class="left-icon">
            <i style="font-size: 25px;" class="iconfont icon-dingwei003"></i>
        </div>
        <div class="right-icon">
          <i class="iconfont icon-youjiantou1"></i>
        </div>
        <div v-on:click="JumpPageHre()" class="center-box">
          <span>{{ address.data.recver_name }}&nbsp;&nbsp;&nbsp;&nbsp;{{ address.data.recver_tel }}</span><br/>
          <label>{{ address.data.user_addr_detail }}</label>
        </div>
      </div>

      <div class="line-style"></div>

      <div v-for="(item, index) in goodsList" class="goods-item-box">
        <div class="seleted-box">
        </div>
        <div class="image-box">
          <img :src="'http://img13.360buyimg.com/n4/'+item.imagePath" width="100%" height="100%">
        </div>
        <div class="content-box">
          <div class="goods-comments">{{ item.name }}</div>
          <div class="discount-text">积分可抵扣：￥0.00</div>
          <div class="count-price-box">
            <div class="left-text">￥{{ item.price.price }}</div>
            <div class="right-counter-box">
              <span v-on:click="addition(item, index)">+</span>
              <span class="conut-vlue">{{ item.count }}</span>
              <span v-on:click="subtraction(item, index)">-</span>
              <span class="count-title">数量：</span>
            </div>
          </div>
        </div>
      </div>

      <div class="g-address-box">
        <div class="g-left-text">运费</div>
        <div class="g-right-text">
          <span>￥{{ delivery_fee }}.00</span>
        </div>
      </div>
      <div class="g-address-box">
        <div class="g-left-text">使用积分</div>
        <div class="g-right-text">
          <span>0</span>
        </div>
      </div>
      <div class="g-address-box">
        <div class="g-left-text"></div>
        <div class="g-right-text">
          <span style="color:#989898;">积分可抵扣￥0.00</span>
          <span>小计</span>
          <span style="color: #d62a06;">￥{{ sumPriceText }}</span>
        </div>
      </div>

      <div style="margin-top: 8px;" class="g-address-box">
        <div class="g-left-text">支付方式</div>
        <div style="padding-right:0;" class="g-right-text">
          <span>支付宝</span>
          <i class="iconfont icon-iconfontjiantou5"></i>
        </div>
      </div>

      <div class="g-address-box">
        <div class="g-left-text">发票信息</div>
        <div style="padding-right:0;" class="g-right-text">
          <span>不开</span>
          <i class="iconfont icon-iconfontjiantou5"></i>
        </div>
      </div>

      <div class="remark-info">
        <span>备注</span>
        <textarea rows="3" cols="30">
          
        </textarea>

      </div>
    </div>

    <div @click="placeOrder" class="footer-box">
      立即支付
    </div>

  </div>
</template>

<script>
import { getUrlParams, getParamsToken, saveCacheToken, getSaveCacheToken, payFunction, JumpPage } from '@/assets/js/utils'
import request from '@/assets/js/request'
import { Indicator, Toast } from 'mint-ui';

window.setupWKWebViewJavascriptBridge = function(callback) {
  if (window.WKWebViewJavascriptBridge) { return callback(WKWebViewJavascriptBridge) }
  if (window.WKWVJBCallbacks) { return window.WKWVJBCallbacks.push(callback) }
  window.WKWVJBCallbacks = [callback]
  // window.webkit.messageHandlers.iOS_Native_InjectJavascript.postMessage(null)
}

let u = navigator.userAgent,
app = navigator.appVersion;
let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
if(isIOS) {
  setupWKWebViewJavascriptBridge(function(bridge) {
    //把WEB中要注册的方法注册到bridge里面
    bridge.registerHandler('refreshAddressCallback', function(data, responseCallback) {
        window.refreshAddressCallback(data)
    })
  })
}
var self = null;
window.refreshAddressCallback = function(data) {
  // watchData.addressList = data.split('-')

  // if (isIOS) {
  //   this.getAddressIos(data.params);

  // } else {
  //   self.getAddress()
  // }
  
  self.getAddress()
}


export default {
  name: 'App',
  data() {
    return {
      count: 1,
      sumPriceText: 0,
      delivery_fee: 0,
      address: {isFill: false, data: {
        recver_name: '',
        recver_tel: '',
        user_addr_detail: '',
        address_id: ""
      }},
      goodsList: []
    };
  },
  created() {
    this.getToken();
    this.address.isFill = false;
    self = this;
    this.goodsList = JSON.parse(localStorage.getItem("_goodsDetails_")).data;  
    self.getDefualtAddress();
   
    // console.log('================================');
    // console.log(localStorage.getItem("_goodsDetails_"));
    
    
  },
  methods: {
    placeOrder: function() {
     
      if(!this.address.isFill) {
        alert('请先选择收获地址！');
        return ;
      }
      if (!(this.address && this.address.data && this.address.data.address_id)) {
        alert('请先选择收获地址！');
        return ;
      }
      var data = JSON.parse(localStorage.getItem("_goodsDetails_")).data;
      var _address = JSON.parse(localStorage.getItem("_address_"))
      // alert(_address.data.address_id)

      var goods_jsons = []
      for(var i = 0 ; i < data.length ; i++) {
        goods_jsons.push({
          skuId: data[i].sku,
          num: data[i].count
        })
      }
      var nums = (this.sumPriceText - this.delivery_fee).toFixed(2);
      Indicator.open();
      request.actionUnasync({
          url: 'jd/addOrder',
          method: 'post',
          data: {
            goods_json: goods_jsons,
            delivery_fee: this.delivery_fee,
            total_amount: nums,
            user_addr_id: _address.data.address_id
          }
      }).then( result => {
          Indicator.close();
          if(result.data.code == 1000) {
            payFunction(result.data.data)
          } else {
            alert(result.data.msg);
            console.log(err);
          }
      }).catch( err => {
        alert(result.data.msg);
        console.log(err)
      });

    },
    getDeliveryFee: function(ops) {
      var data = JSON.parse(localStorage.getItem("_goodsDetails_")).data;
      var goods_jsons = []
      for(var i = 0 ; i < data.length ; i++) {
        goods_jsons.push({
          skuId: data[i].sku,
          num: data[i].count
        })
      }
      request.actionUnasync({
          url: 'jd/freight',
          method: 'post',
          data: {
            skuNums: JSON.stringify(goods_jsons),
            provinceId: ops.province_id,
            cityId: ops.city_id,
            countyId: ops.county_id
          }
      }).then( result => {
          console.log('=================================');
          console.log(result);
          Indicator.close();
          if(result.data.code == 1000) {
            this.delivery_fee = result.data.data.freight;
            this.sumPrice() 
          }
      }).catch( err => {
        console.log(err)
      });

    },
    addition: function(item, index) {
      item.count += 1;
      this.sumPrice();
    },
    subtraction: function(item, index) {
      if(item.count >= 2) {
        item.count -= 1;
        this.sumPrice()
      }
    },
    sumPrice: function() {
      this.sumPriceText = 0;

      for(var i = 0 ; i < this.goodsList.length ; i++) {
        this.sumPriceText += this.goodsList[i].count * this.goodsList[i].price.price;
      }
      
      if(this.sumPriceText > 0){
        this.sumPriceText = (this.sumPriceText += this.delivery_fee).toFixed(2) ;
      }
    },
    getAddressIos: function(address) {
      // alert(JSON.stringify(addAddress));
      if(address && address.isFill) {
        this.address.isFill = true;
        this.address.data = address.data;
      }
    },
    getAddress: function() {
      var result = localStorage.getItem("_address_");
      var address = JSON.parse(result);
      if(address && address.isFill) {
        this.address.isFill = true;
        this.address.data = address.data;
      }
    },
    getDefualtAddress: function() {
      Indicator.open();
      request.actionUnasync({
          url: 'jd/addrList',
          method: 'post',
          data: {}
      }).then( result => {
          console.log(result);
          Indicator.close();
          if(result.data.code == 1000) {
            var list = result.data.data;
            
            for(var i = 0 ; i < list.length ; i++) {
              if(list[i].is_default == "Y") {
                this.getDeliveryFee(list[i]);
                localStorage.setItem('_address_', JSON.stringify({
                  isFill: true,
                  data: {
                    recver_name: list[i].recver_name,
                    recver_tel: list[i].recver_tel,
                    user_addr_detail: list[i].user_addr_detail,
                    address_id: list[i].user_addr_id
                  }
                }));
                this.address.isFill = true;
                this.address.data = {
                  recver_name: list[i].recver_name,
                  recver_tel: list[i].recver_tel,
                  user_addr_detail: list[i].user_addr_detail,
                  address_id: list[i].user_addr_id
                }
              }
            }
          } else {
            Toast('请求默认地址失败！');
          }

          
      }).catch( err => {
        Toast('获取地址失败！');
        console.log(err)
      });
    },
    JumpPageHre() {
      
      var result = {
        token : getSaveCacheToken(),
        callback: "getAddress"
      }
 
      JumpPage({
          href : `${request.getUrlbefore()}/addAddress.html`,
          // href : `${request.getUrlbefore()}/addressList.html`,
          cache : true,
          params : result
      })
    },
    getToken() {
      let res = getParamsToken();
      // 保存近缓存
      saveCacheToken(res);
    },

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
          padding-left: 20px;
          padding-right: 20px;

          .left-icon {
            width: 20px;
            border: 0px solid red;
            height: 70px;
            float: left;
            line-height: 70px;

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
            margin: 5px 25px 0 35px;
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

        .line-style {
          border:0px solid black;
          height: 10px;
          margin-top: 8px;
          background-color: #ffffff;
          overflow: hidden;
          background-image:url('../../assets/images/line.png')
        }

        .goods-item-box {
          height: 120px;
          border-bottom: 1px solid #d7d7d7;
          background-color: #ffffff;

          .seleted-box {
            width: 10px;
            text-align: center;
            height: 120px;
            line-height: 120px;
            float: left;
            border: 0px solid blue;

            .icon-unselected {
              font-size: 18px;
              color: #656565;
            }

            .icon-selected {
              font-size: 18px;
              color: #e03c45;
            }
          }

          .image-box {
            height: 90px;
            width: 90px;
            margin-top: 15px;
            margin-left: 5px;
            border: 1px solid #d6d6d6;
            float: left;
          }

          .content-box {
            height: 120px;
            border: 0px solid red;
            margin-left: 120px;
            padding-top: 15px;
            padding-right: 15px;
            padding-bottom: 15px;
            overflow: hidden;

            .goods-comments {
              height: 40px;
              line-height: 20px;
              border: 0px solid red;
              font-size: 14px;
              overflow: hidden;
            }

            .discount-text {
              height: 14px;
              border: 0px solid red;
              line-height: 15px;
              font-size: 12px;
              color: #9a9a9a;
              margin-top: 10px;
            }

            .count-price-box {
              height: 20px;
              border: 0px solid red;
              margin-top: 5px;

              .left-text {
                font-size: 14px;
                font-weight: bold;
                color: #e03c45;
                line-height: 25px;
                float: left;
              }

              .right-counter-box {
                float: right;
                height: 15px;
                width: auto;
                border: 0px solid red;
                text-align: center;
                margin-top: 5px;
                font-size: 18px;

                span {
                  display: inline-block;
                  height: 15px;
                  width: 15px;
                  border: 1px solid #d6d6d6;
                  float: right;
                  margin-right: 3px;
                  line-height: 15px;
                }

                .conut-vlue {
                  font-size: 13px;
                  width: 25px;
                  line-height: 17px;
                  background-color: #d6d6d6;
                }

                .count-title {
                  width: auto;
                  font-size: 12px;
                  line-height: 18px;
                  border: 0;
                }
              }
            }
          }
        }

        .g-address-box {
          height: 50px;
          background-color: #ffffff;
          border-bottom: 1px solid #d7d7d7;

          .g-left-text {
            width: 60px;
            height: 50px;
            line-height: 50px;
            font-size: 14px;
            padding-left: 18px;
            color: #333333;
            float: left;
          }

          .g-right-text {
            margin-left: 70px;
            height: 50px;
            border: 0px solid red;
            color: #676767;
            font-size: 14px;
            line-height: 50px;
            text-align: right;
            overflow: hidden;
            padding-right: 15px;

            i {
              font-size: 23px;
              margin-right: 5px;
              vertical-align: 5px;
              color: #999;
            }

            span {
              vertical-align: 10px;
            }
          }
        }

        .remark-info {
          padding: 18px 18px 18px 18px;
          background-color: #ffffff;

          textarea {
            background-color: #f4f4f4;
            border: 0;
            height: 80px;
            width: 80%;
            border-radius: 5px;
          }

          span {
            font-size: 14px;
            vertical-align: 70px;
          }
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
