<template>
  <div class="app-box">
    <div class="g-search-box">
      <div class="g-input-box">
        <div class="g-iconfont">
          <i class="iconfont icon-magnifier"></i>
        </div>
        <div class="g-input">
          <form v-on:submit.prevent="searchKeyword">
          
            <input type="text" placeholder="请输入产品关键字" v-model="keyword"/>
          </form>
        </div>
      </div>
    </div>

    <!-- <div class="g-tab-box">
      <div v-on:click="changeTab(1)" :class="{'g-selected-tab': tabIndex==1}" class="g-cell-box">
         <i class="iconfont icon-arrDown"></i> 
      </div>
      <div v-on:click="changeTab(2)" :class="{'g-selected-tab': tabIndex==2}" class="g-cell-box">
      </div>
      <div v-on:click="changeTab(3)" :class="{'g-selected-tab': tabIndex==3}" class="g-cell-box">
         <span>价格</span>
        <span>
          <i v-if="isTopOrder" class="iconfont icon-arrDown"></i>
          <i v-if="!isTopOrder" class="iconfont icon-arr-top"></i>
        </span>
      </div>
      <div v-on:click="changeTab(4)" :class="{'g-selected-tab': tabIndex==4}" class="g-cell-box">
        筛选<i class="iconfont icon-filter"></i>
      </div>
    </div> -->

    <div style="position:absolute;top: 55px;left:0;right:0;bottom:0;overflow-y:auto">
      <!-- <div class="g-types-box">
        <div v-for="item in [1, 3, 3, 3, 3, 3, 3]" class="g-type-box">
          <div class="g-cell">品牌</div>
        </div>
      </div> -->

      <div v-on:click="JumpPageHre(item.sku)" v-for="(item, index) in goodsList"
        :key="index"
        :class="{'g-gds-right-box':index % 2 != 0}"
        class="g-goods-box">
        <div class="g-image-box">
          <img :src="'http://img13.360buyimg.com/n3/'+item.url"/>
        </div>
        <div class="g-comments-text"> {{item.goods_name}} </div>
        <!-- <div class="g-tags-box">
          <div class="g-tags-cell">奶油味</div>
          <div class="g-tags-cell">坚果</div>
        </div> -->
        <div class="g-price-box">
          <span class="g-left-text">￥{{ item.price }}</span>
          <span class="g-right-text">积分可抵扣￥0</span>
        </div>
      </div>
      
      <div v-on:click="nextPage()" class="more-goods-btn">点击加载更多...</div>

      <div v-on:click="JumpPageHreShopCart()" class="shopping-cart-box">
        <i class="iconfont icon-gouwuche"></i>
      </div>
    </div>
  </div>
</template>

<script>
// 引入方法
import { getUrlParams, getParamsToken, saveCacheToken, getSaveCacheToken, payFunction, JumpPage } from '@/assets/js/utils'
import request from '@/assets/js/request'
import { Indicator } from 'mint-ui';

import 'mint-ui/lib/style.min.css';

function setupWKWebViewJavascriptBridge(callback) {
  if (window.WKWebViewJavascriptBridge) { return callback(WKWebViewJavascriptBridge) }
  if (window.WKWVJBCallbacks) { return window.WKWVJBCallbacks.push(callback) }
  window.WKWVJBCallbacks = [callback]
  window.webkit.messageHandlers.iOS_Native_InjectJavascript.postMessage(null)
}


export default {
  name: 'App',
  data() {
      return {
        tabIndex: 1,
        isTopOrder: true,
        goodsList: [],
        keyword: "",
        catId: "",
        pageCount: 1
      };
  },
  created() {
    var params = getUrlParams();
    if(params.keyword) {
      this.keyword = decodeURI(params.keyword);
    }
    if(params.catId) {
      this.catId = params.catId;
    }

    this.getToken();
    this.getDoodsList(1);
    
  },
  methods: {
    searchKeyword: function() {
      this.getDoodsList(1);
      return false;
    },
    JumpPageHre(sku) {

        var result = {
          token : getSaveCacheToken(),
          sku: sku
        }
        JumpPage({
            href : `${request.getUrlbefore()}/goodsDetails.html`,
            cache : true,
            params : result
        })
    },
    JumpPageHreShopCart() {
        var result = {
          token : getSaveCacheToken()
        }
        JumpPage({
            href : `${request.getUrlbefore()}/shoppingCart.html`,
            cache : true,
            params : result
        })
    },

    changeTab: function(index) {
      if(index == 1) {

      } else if(index == 2) {

      } else if(index == 3) {
        if(this.tabIndex == 3) {
          this.isTopOrder = !this.isTopOrder;
        }
      } else{

      }
      this.tabIndex = index;
    },
    nextPage: function() {
      this.pageCount += 1;
      this.getDoodsList(0);
    },
    getDoodsList: function(active) {
      var params = {
        type: 0,
        page: this.pageCount
      }

      if(active == 1) {
        this.goodsList = [];
      }
      if(this.keyword && this.keyword.trim() != "") {
        params.keyWord = this.keyword;
      }

      if(this.catId) {
        params.cid = this.catId;
      }
      

      // Indicator.open();
      request.actionUnasync({
          url: 'jd/goodsList',
          method: 'post',
          data: params
      }).then( result => {
          var arr = result.data.data;
          for(var i = 0 ; i < arr.length ; i++) {
            this.goodsList.push(arr[i]);
          }
          // Indicator.close();
      }).catch( err => {
        console.log(err)
      });
    },
    getToken() {
      let res = getParamsToken();
      // 保存近缓存
      saveCacheToken(res);
    },
  }
}
</script>

<style src="@/assets/css/base.css"></style>
<style src="../iconfont/iconfont.css"></style>
<style lang="scss" scoped type="text/css">
::-webkit-input-placeholder { /* WebKit, Blink, Edge */
    color:    #ccc;
    }
    :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
      color:    #ccc;
    }
    ::-moz-placeholder { /* Mozilla Firefox 19+ */
      color:    #ccc;
    }
    :-ms-input-placeholder { /* Internet Explorer 10-11 */
      color:    #ccc;
    }
    .app-box {
      font-size: 14px;
      position: absolute;
      border: 0px solid red;
      background-color: #f3f3f3;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      .g-search-box {
        height: 50px;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;

        .g-input-box {
          height: 35px;
          margin: 7px 10px 7px 10px;
          border: 1px solid #ffffff;
          border-radius: 17px;
          background-color: #ffffff;

          .g-iconfont {
            width: 35px;
            border: 0px solid red;
            height: 35px;
            float: left;

            i {
              font-size: 25px;
              margin: 0 10px 0 10px;
              vertical-align: -13px;
              font-size: 23px;
              color: rgb(217, 217, 217); 
            }
          }

          .g-input {
            height: 35px;
            margin-left: 35px;
            border:0px solid blue;

            input {
              width: 90%;
              height: 35px;
              border: 0;
              outline:none;
              font-size: 13px;
              color: #333;
            }
          }
        }
      }

      .g-tab-box {
        position: absolute;
        height: 50px;
        border-bottom: 1px solid #d6d6d6;
        top: 53px;
        left: 0;
        right: 0;
        background-color: #ffffff;
        overflow: hidden;

        .g-cell-box {
          width: 25%;
          border: 0px solid red;
          height: 50px;
          float: left;
          line-height: 50px;
          text-align: center;
          font-size: 14px;
          color: #555;
        }

        .g-selected-tab {
          color: #e12605;
        }
      }

      .g-types-box {
        overflow: hidden;
        background-color: #ffffff;
        padding-bottom: 5px;

        .g-type-box {
          width: 25%;
          height: 40px;
          float: left;
          border: 0px solid red;

          .g-cell {
            width: 80%;
            height: 25px;
            margin: auto;
            margin-top: 7px;
            border: 1px solid #d1260a;
            border-radius: 18px;
            text-align: center;
            line-height: 25px;
            color: #d1260a;
            font-size: 15px;
            background-color: #fff5f4;
          }
        }
      }

      .g-goods-box {
        margin-top: 10px;
        height: 280px;
        border: 0px solid red;
        width: 49%;
        background-color: #ffffff;
        float: left;

        .g-image-box {
          height: 210px;
          border: 0px dashed blue;
          text-align: center;
          width: 100%;

          img {
            margin-top: 13px;
            width: 100%;
            border: 0;
          }
        }

        .g-comments-text {
          height: 20px;
          border: 0px solid red;
          padding-left: 5px;
          padding-right: 5px;
          line-height: 20px;
          font-size: 14px;
          font-weight: 500;
          overflow: hidden;
          margin-top: 5px;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }

        .g-tags-box {
          height: 18px;
          border: 0px solid red;

          .g-tags-cell {
            width: 50px;
            height: 18px;
            font-size: 12px;
            line-height: 18px;
            color: #b2b2b2;
            border-radius: 8px;
            background-color: #f6f6f6;
            margin-left: 5px;
            float: left;
            margin-top:2px;
            text-align: center;
          }
        }

        .g-price-box {
          height: 20px;
          border: 0px solid red;
          margin: 3px;
          font-size: 13px;
          color: #9a9a9a;
          line-height: 27px;
          padding-left: 5px;
          padding-right: 5px;

          .g-left-text{
            float: left;
            font-size: 15px;
            color: #df2300;
          }

          .g-right-text {
            float: right;
          }
        }
      }

      .more-goods-btn {
        height: 30px;
        font-size: 13px;
        line-height: 30px;
        text-align: center;
        float: left;
        width: 100%;
      }

      .shopping-cart-box {
        border: 0px solid red;
        width: 30px;
        height: 30px;
        right: 20px;
        bottom: 35px;
        position: fixed;

        i {
          font-size: 30px;
          color: #e12605;
        }
      }

      .g-gds-right-box {
        float: right
      }
    }
</style>

<style>
  body {
    margin: 0 0 0 0;
  }
</style>
