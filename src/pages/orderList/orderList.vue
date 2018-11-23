<template>
  <section class="orderList box_sizing box_flex box_flex_col">
      <div class="order_list_box">
          <order-header 
            @initPageTab="clickTabList"
            @clickTabList="clickTabList"
            ref="updateTabList"/>
      </div>
      <div class="order_list_main">
          <orderListMain 
            :orderListData="orderListData"
            :moreType="moreType"
            @nextPageAdd="nextPageAdd"
            @clickListButton="clickListButton"
            @JumpPageHre="JumpPageHre" />
      </div>
  </section>
</template>

<script>
    // 引入组件
    import orderHeader from './components/orderHeader'
    import orderListMain from './components/orderListMain'
    // 引入方法
    import { getParamsToken, saveCacheToken, getSaveCacheToken, payFunction, JumpPage } from '@/assets/js/utils'
    import request from '@/assets/js/request'
import orderDetailsVue from '../orderDetails/orderDetails.vue';

    function setupWKWebViewJavascriptBridge(callback) {
        if (window.WKWebViewJavascriptBridge) { return callback(WKWebViewJavascriptBridge) }
        if (window.WKWVJBCallbacks) { return window.WKWVJBCallbacks.push(callback) }
        window.WKWVJBCallbacks = [callback]
        window.webkit.messageHandlers.iOS_Native_InjectJavascript.postMessage(null)
    }

    let currentVue = null;

    let u = navigator.userAgent,
    app = navigator.appVersion;
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
    let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if(isIOS) {
        setupWKWebViewJavascriptBridge(function(bridge) {
            //把WEB中要注册的方法注册到bridge里面
            bridge.registerHandler('refreshOrderCallback', function(data, responseCallback) {
                window.refreshOrderCallback(data)
            })
        })
    }
    window.refreshOrderCallback = function(data) {
        if (currentVue && currentVue.$refs) {
            currentVue.$refs.updateTabList.updatePageTab('DeliverGoods');
        }
    }

    export default {
        name: 'App',
        data() {
            return {
                pageData : {
                    page : 1,
                    pagenumber : 10
                },
                chooseTab : {},
                orderListData : [],
                moreType: true
            };
        },
        components : {
            orderHeader,
            orderListMain
        },
        methods : {
            clickTabList(item) { // 头部选项卡
                if (Object.prototype.toString.call(item) !== '[object Object]') return;
                // 初始化页码
                this.$set(this.pageData, 'page', 1);
                // 选择的页签
                this.$set(this.$data, 'chooseTab', item);
                // 初始化列表加载更多
                this.moreType = true;
                this.getOrderList(item);
            },
            getOrderList(item, type) {
                let submitParams = {
                    ...this.pageData
                };
                const _self = this;
                switch (item.type) {
                    case 'all':
                        submitParams.type = 0;
                        break;
                    case 'pendingPay':
                        submitParams.type = 1;
                        break;
                    case 'DeliverGoods':
                        submitParams.type = 2;
                        break;
                    case 'pendingGoods':
                        submitParams.type = 3;
                        break;
                    case 'completed':
                        submitParams.type = 5;
                        break;
                    default:
                        submitParams.type = 0;
                        break;
                }
                request.actionUnasync({
                    url: 'jd/orderList',
                    method: 'post',
                    data: {
                        ...submitParams
                    },
                }).then( result => {
                    if (result.status * 1 === 200 && result.data && result.data.code * 1 === 1000) {
                        if (Array.isArray(result.data.data)) {
                            if (type === 'add' && Array.isArray(_self.orderListData)) {
                                _self.orderListData.splice(_self.orderListData.length, 0, ...result.data.data);
                            } else {
                                _self.$set(_self.$data, 'orderListData', result.data.data);
                            }
                            if (result.data.data.length < _self.pageData.pagenumber) {
                                _self.moreType = false;
                            } else {
                                _self.moreType = true;
                            }
                        }
                    } else if (result && result.data) {
                        alert(result.data.msg);
                    }
                }).catch( err => {});
            },
            clickListButton(item, index, type) {
                if (Object.prototype.toString.call(item) !== '[object Object]') return;
                // 定义删除按钮
                if (type === 'delete') {
                    this.deleteOrderList(item, index);
                    return;
                }
                // 已完成订单删除
                if (item && item.current_node_code === 'ORDER_FINISH') {
                    this.deleteOrderList(item, index);
                    return;
                };
                // 确认收货处理
                if (item && item.current_node_code === 'FOR_RECV') {
                    this.confirmReceiptOrderList(item, index);
                    return;
                }
                // 确认支付
                if (item && item.current_node_code === 'FOR_PAY') {
                    this.confirmPay(item, index);
                    return;
                }
            },
            deleteOrderList(item, index) {
                if (Object.prototype.toString.call(item) !== '[object Object]') return;
                let submitParams = {
                    order_id : item.order_id
                };
                request.actionUnasync({
                    url: 'jd/moveOrder',
                    method: 'post',
                    data: {
                        ...submitParams
                    },
                }).then( result => {
                    if (result.status * 1 === 200 && result.data && result.data.code * 1 === 1000) {
                        if (this.orderListData[index]) {
                            this.orderListData.splice(index, 1);
                        }
                    }
                }).catch( err => {});
            },
            confirmReceiptOrderList(item, index) {
                if (Object.prototype.toString.call(item) !== '[object Object]') return;
                let submitParams = {
                    order_id : item.order_id
                };
                request.actionUnasync({
                    url: 'jd/moveOrder',
                    method: 'post',
                    data: {
                        ...submitParams
                    },
                }).then( result => {
                    if (result.status * 1 === 200 && result.data && result.data.code * 1 === 1000) {
                        if (this.orderListData[i]) {
                            item.current_node_code = 'ORDER_FINISH'
                        }
                    }
                }).catch( err => {});
            },
            confirmPay(item, index) {
                if (Object.prototype.toString.call(item) !== '[object Object]') return;
                let submitParams = {
                    order_id : item.order_id
                };
                request.actionUnasync({
                    url: 'jd/addOrder',
                    method: 'post',
                    data: {
                        ...submitParams
                    },
                }).then( result => {
                    if (result.status * 1 === 200 && result.data && result.data.code * 1 === 1000) {
                        payFunction(result.data.data);
                    } else {
                        alert(res.data.msg);
                    }
                }).catch( err => {});
            },
            getToken() {
                let res = getParamsToken();
                // 保存近缓存
                saveCacheToken(res);
            },
            nextPageAdd() {
                if (this.moreType) {
                    this.pageData.page += 1;
                    this.getOrderList(this.chooseTab, 'add');
                }
            },
            updatedTitle() {
                document.title = "我的订单";
            },
            JumpPageHre(item) {
                if (Object.prototype.toString.call(item) !== '[object Object]') return;
                JumpPage({
                    href : `${request.getUrlbefore()}/orderDetails.html`,
                    cache : true,
                    params : {
                        token : getSaveCacheToken(),
                        order_id : item.order_id
                    }
                })
            }
        },
        mounted() {
            this.getToken();
            this.updatedTitle();
        },
        created() {
            currentVue = this;
            this.getToken();
            this.updatedTitle();
        },
    }
</script>
<style lang="scss" src="@/assets/css/base.css"></style>
<style lang="scss" src="@/assets/font/iconfont.css"></style>

<style lang="scss" scoped>
    @import url('./scss/orderList.scss');
</style>

