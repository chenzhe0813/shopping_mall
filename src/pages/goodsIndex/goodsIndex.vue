<template>
  <div class="app-box">
    <div class="g-search-box">
      <div class="g-input-box">
        <div class="g-iconfont">
          <i class="iconfont icon-magnifier"></i>
        </div>
        <div class="g-input">
          <form v-on:submit.prevent="searchKeyword">
            <input type="search" v-model="keyword" placeholder="请输入产品关键字" autocomplete="off"/>
          </form>
        </div>
      </div>
    </div>

    <div class="g-main-box">

      <div class="g-left-box">
        <div 
          v-for="(item, index) in dataList" 
          :key="index"
          v-if="item"
          class="g-item-cell"
          v-on:click="changeCell(item, index)"
          :class="{'g-item-cell-selected': index == count}">
          {{ item ? item.name : '' }}
        </div>
      </div>

      <div id="rightbox" class="g-right-box">
        <div class="g-slide-box">
          <mt-swipe :auto="4000">
            <mt-swipe-item>
              <div class="g-image-box" style="background-color:red">
                <img src="../../assets/images/banner_03.jpg">
              </div>
            </mt-swipe-item>
          </mt-swipe>
        </div>

        <div class="g-category-item" v-for="(itemSecond, index) in getNext(dataList, count)" :key="index">
          <div class="g-item-title">{{ itemSecond.name }}</div>
          <div v-on:click="JumpPageHre(1, itemThrid.catId)" class="g-item-cell" v-for="(itemThrid, _ind) in itemSecond.next" :key="_ind">
            <div class="g-img-box">
              <img :src="itemThrid.url">
            </div>
            <div class="g-img-text">{{ itemThrid.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

// 引入方法
// import { getParamsToken, saveCacheToken, getSaveCacheToken } from '@/assets/js/utils'
import request from '@/assets/js/request'
import { getParamsToken, saveCacheToken, getSaveCacheToken, payFunction, JumpPage } from '@/assets/js/utils'

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
        count: 0,
        dataList: [],
        keyword: ""
      };
  },
  created() {
    this.getToken();
    this.getFirstList();
  },
  methods: {
    getNext(dataList, count) {
      if(dataList[count]) {
        return dataList[count].next;
      }
    },
    searchKeyword: function() {
      if(this.keyword != "") {
        this.JumpPageHre(0, this.keyword);
      }
      return false;
    },
    JumpPageHre(type, value) {
        // window.location.href = "http://192.168.1.101:8080/goodsList.html?token=5459404271a6c5d98c519b18e5f331&catId="+value;
        // return ;
        var result = {
          token : getSaveCacheToken(),
        }
        if(type == 0) { //搜索入口
          result.keyword = encodeURI(value);
        } else if(type == 1) { //三级分类入口
          result.catId = value;
        }
        JumpPage({
            href : `${request.getUrlbefore()}/goodsList.html`,
            cache : true,
            params : result
        })
    },
    getFirstList: function() {
      let submitParams = {
        type: 0
      }
      request.actionUnasync({
          url: 'jd/categoryList',
          method: 'post',
          data: {},
      }).then( result => {
          console.log('----------------------1')
          console.log(result);
          this.dataList = result.data

      }).catch( err => {});
    },
    getToken() {
        let res = getParamsToken();
        // 保存近缓存
        saveCacheToken(res);
    },
    changeCell: function(item, index) {
      this.count = index;
    }
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
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 0px solid red;
        background-color: #f3f3f3;

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

        .g-main-box {
          position: absolute;
          top: 50px;
          left: 0;
          right: 0;
          bottom: 0;
          border: 0px solid blue;

          .g-left-box {
            position: absolute;
            width: 100px;
            top: 0;
            left: 0;
            bottom: 0;
            border-right: 1px solid #d6d6d6;
            background-color: #ffffff;

            .g-item-cell {
              height: 40px;
              border: 0px solid red;

              color: #666;
              font-size: 15px;
              text-align: center;
              line-height: 40px;
            }

            .g-item-cell-selected {
              font-weight: 500;
              color: #000;
              background-color: #f9f9f9;
              border-right: 2px solid #df2300;
            }
          }

          .g-right-box {
            position: absolute;
            top: 0;
            left: 100px;
            right: 0;
            bottom: 0;
            overflow-y:auto;

            .g-slide-box {
              height: 100px;
              margin: 0 10px 0 10px;
              border: 0px solid green;

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

            .g-category-item {
              /*height: 1000px;*/
              margin: 10px 10px 0 10px;
              border: 0px solid red;
              background-color: #ffffff;
              overflow: hidden;

              .g-item-title {
                height: 35px;
                border: 0px solid blue;
                line-height: 40px;
                padding-left: 10px;
                font-size: 14px;
                color: #000;
              }

              .g-item-cell {
                width: 33.33%;
                height: 110px;
                float: left;
                border: 0px solid blue;
                overflow: hidden;
                text-align: center;

                .g-img-box {
                  width: 60px;
                  height: 60px;
                  border: 0px dashed red;                  
                  margin: auto;
                  margin-top: 10px;

                  img {
                    border: 0;
                    width: 100%;
                    height: 100%;
                  }
                }

                .g-img-text {
                  width: 65px;
                  height: 20px;
                  border: 0px solid red;
                  margin: auto;
                  margin-top: 8px;
                  overflow: hidden;
                  font-size: 13px;
                  color: #555;
                }
              }
            }
          }
        }
    }
</style>

<style type="text/css">

 
  body {
    margin: 0 0 0 0;
  }
</style>
