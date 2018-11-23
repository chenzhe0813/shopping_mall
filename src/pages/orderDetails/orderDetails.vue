<template>
  <section class="orderDetails box_sizing box_flex box_flex_col">
      <div class="orderDetails_address box_sizing">
          <div class="orderDetails_address_box box_flex">
              <div class="orderDetails_address_box_left orderDetils_addres_icon"></div>
              <div class="orderDetails_address_box_right flex1">
                  <div class="orderDetails_address_box_p1">
                      {{detailsData.recver_name}} <span>{{detailsData.recver_tel}}</span>
                  </div>
                  <p class="orderDetails_address_box_p2">
                      {{detailsData.delivery_addr}}
                  </p>
              </div>
          </div>
      </div>
      <div class="goodslist_box box_sizing">
             <div class="order_list_main_con_li box_sizing box_flex"
                v-for="(item, index) in getskuList(detailsData)"
                :key="index"
             >
                <div class="order_list_main_con_li_img">
                    <img width="100%" height="100%" alt="" :src="getGoodsListImage(detailsData, item)" />
                </div>
                <div class="order_list_main_con_li_c box_sizing flex1">
                    <div class="order_list_main_con_li_c_h5">{{item.name}}</div>
                    <p class="order_list_main_con_li_c_p"></p>
                    <div class="order_list_main_con_li_c_pri">￥{{(Number(item.price)).toFixed(2)}}
                        <span>数量：<i>{{item.num}}</i></span>
                    </div>
                </div>
            </div>
      </div>
      <ul class="orderGoods_details_box">
          <li class="orderGoods_details_box_li box_flex box_sizing"
            v-for="(item, index) in dateilsList"
            :key="index">
              <div class="orderGoods_details_box_li_left">
                  {{item.title}}
              </div>
              <div class="orderGoods_details_box_li_right flex1">
                  {{item.text}}
                  <span v-if="item.button" @click.stop="clickButton(item.button, item.text)">
                      {{item.button}}
                  </span>
                  <span v-if="item.buttonOrderTrack" @click.stop="clickButtonOrderTrack(item.text)">
                      {{item.buttonOrderTrack}}
                  </span>
              </div>
          </li>
      </ul>
      <div class="orderGoods_details_box">
          <li class="orderGoods_details_box_li box_flex box_sizing"
            v-for="(item, index) in invoiceList"
            :key="index">
              <div class="orderGoods_details_box_li_left">
                  {{item.title}}
              </div>
              <div class="orderGoods_details_box_li_right flex1">
                  {{item.text}}
                  <span v-if="item.button">
                      {{item.button}}
                  </span>
              </div>
          </li>
          <p class="orderGoods_invoice_pro box_sizing">
              发票将在订单完成后1-2天内开具
          </p>
      </div>
      <div class="orderGoods_price">
          <div class="orderGoods_price_li box_sizing box_flex">
              <div class="orderGoods_price_li_left flex1">商品金额</div>
              <div class="orderGoods_price_li_right flex1">￥{{(Number(detailsData.order_price_sum) / 100).toFixed(2)}}</div>
          </div>
          <div class="orderGoods_price_li box_sizing box_flex">
              <div class="orderGoods_price_li_left flex1">运费</div>
              <div class="orderGoods_price_li_right flex1">￥{{(Number(detailsData.delivery_fee) / 100).toFixed(2)}}</div>
          </div>
          <div class="orderGoods_price_li box_sizing box_flex">
              <div class="orderGoods_price_li_left flex1">积分抵扣</div>
              <div class="orderGoods_price_li_right flex1">￥0.00</div>
          </div>
          <div class="orderGoods_price_total">
              实际付款金额：<span>￥{{(Number(detailsData.order_price_sum) / 100 + Number(detailsData.delivery_fee) / 100).toFixed(2)}}</span>
          </div>
      </div>
      <div class="orderGoods_fixed">
          <span @click.stop="cancelOrder" v-if="detailsData.current_node_code === 'FOR_PAY'">取消订单</span>
          <span @click.stop="applySela" v-if="detailsData.current_node_code === 'ORDER_FINISH'">申请售后</span>
          <span @click.stop="deleteOrder" v-if="detailsData.current_node_code === 'ORDER_FINISH' || detailsData.current_node_code === 'FOR_CMT'">删除订单</span>
          <!-- <span>再次购买</span> -->
          <span class="is-active" @click.stop="contactTelconfirmPay" v-if="detailsData.current_node_code === 'FOR_PAY'">立即支付</span>
      </div>
      <!-- 添加客服弹窗 -->
        <contactTel v-if="contactTelnameData.status" :data="contactTelnameData"></contactTel>
        <!-- 提示弹框 -->
        <orderPrompt v-if="orderPromptData.status" 
            :data="orderPromptData"
            @ok_fn="confirmPrompt" />
  </section>
</template>

<script>
    // 引入组件
    import contactTel from '@/components/contactTel'
    import orderPrompt from '@/components/orderPrompt'

    // 引入方法
    import { getParamsToken, saveCacheToken, getSaveCacheToken, payFunction, getUrlParams, copyString, JumpPageBack } from '@/assets/js/utils'
    import request from '@/assets/js/request'

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
        if (currentVue && currentVue.getOrderDateils) {
            currentVue.getOrderDateils();
        }
    }

    export default {
        name: 'App',
        data() {
            return {
                detailsData : {},
                dateilsList : [
                    {
                        title : '订单编号：',
                        text : '',
                        button : '复制',
                        buttonOrderTrack:"物流信息",
                    },
                    {
                        title : '支付方式：',
                        text : '支付宝'
                    },
                    // {
                    //     title : '配送方式：',
                    //     text : ''
                    // },
                    {
                        title : '支付金额：',
                        text : ''
                    },
                    {
                        title : '钱包金额：',
                        text : '0'
                    },
                    {
                        title : '使用积分：',
                        text : '0'
                    },
                    {
                        title : '下单时间：',
                        text : ''
                    },
                    {
                        title : '支付时间：',
                        text : ''
                    }
                ],
                invoiceList : [
                    {
                        title : '发票类型：',
                        text : '',
                    },
                    {
                        title : '发票抬头：',
                        text : '',
                    },
                    {
                        title : '发票内容：',
                        text : '',
                    },
                ],
                contactTelnameData: {
                    status : false,
                    messageText : '需要售后请联系客服，客服提供周到的咨询服务，希望你能支持和理解。'
                },
                orderPromptData : {
                    status : false,
                    title : '确认删除此订单？',
                    text : '删除后订单无法恢复，是否确认删除？',
                    cancelText : '否',
                    okText : '是',
                    type : 'cancelOrder'
                }
            };
        },
        components : {
            contactTel,
            orderPrompt
        },
        methods : {
            getGoodsListImage(item, _item) {
                let result = '';
                let resultObj = item;
                if (Array.isArray(resultObj[_item.skuId.toString()])) {
                    if (resultObj[_item.skuId.toString()] && resultObj[_item.skuId.toString()][0] && resultObj[_item.skuId.toString()][0].path) {
                        return `http://img13.360buyimg.com/n3/${resultObj[_item.skuId.toString()][0].path}`;
                    } else {
                        return result;
                    }
                } else {
                    return result;
                }
            },
            getskuList(item) {
                if (Object.prototype.toString.call(item) !== '[object Object]') return [];
                if (Array.isArray(item.sku)) {
                    return item.sku;
                } else {
                    return [];
                }
            },
            getOrderDateils() {
                let submitParams = {
                    order_id : getUrlParams().order_id
                };
                request.actionUnasync({
                    url: 'jd/orderDetail',
                    method: 'post',
                    data: {
                        ...submitParams
                    },
                }).then( result => {
                    if (result.status * 1 === 200 && result.data && result.data.code * 1 === 1000) {
                        let requestObj = result.data.data;
                        this.$set(this.$data, 'detailsData', requestObj);
                        this.dateilsList.forEach(element => {
                            switch (element.title) {
                                case '订单编号：':
                                    element.text = requestObj.order_id;
                                    break;
                                case '支付金额：':
                                    element.text = (Number(requestObj.order_price_sum) / 100).toFixed(2);
                                    break;
                                case '下单时间：':
                                    element.text = requestObj.create_time;
                                    break;
                                case '支付方式：':
                                    element.text = '支付宝';
                                    break;
                                case '钱包金额：':
                                    element.text = (Number(requestObj.user_account_amt) / 100).toFixed(2);
                                    break;
                                case '支付时间：':
                                    element.text = requestObj.pay_time;
                                    break;
                                default:
                                    break;
                            }
                        });
                        this.invoiceList.forEach(el => {
                            switch (element.title) {
                                case '发票类型：':
                                    element.text = requestObj.order_invoice_type;
                                    break;
                                case '发票抬头：':
                                    element.text = requestObj.order_invoice_title;
                                    break;
                                case '发票内容：':
                                    element.text = requestObj.order_invoice_detail;
                                    break;
                                default:
                                    break;
                            }
                        });
                    } else {
                        alert(res.data.msg);
                    }
                }).catch( err => {});
            },
            // 点击按钮
            clickButton(el, text) {
                if (el === '复制') {
                    copyString(text);
                }
            },
            clickButtonOrderTrack(text){
                console.log(text);
                this.queryOrderTrack();
            },
            getToken() {
                let res = getParamsToken();
                // 保存近缓存
                saveCacheToken(res);
            },
            updatedTitle() {
                document.title = "订单详情";
            },
            cancelOrder() {
                this.orderPromptData = {
                    status : true,
                    title : '确认取消此订单？',
                    text : '取消后订单无法恢复，是否确认取消？',
                    cancelText : '否',
                    okText : '是',
                    type : 'cancelOrder'
                }
            },
            deleteOrder() {
                this.orderPromptData = {
                    status : true,
                    title : '确认删除此订单？',
                    text : '删除后订单无法恢复，是否确认删除？',
                    cancelText : '否',
                    okText : '是',
                    type : 'deleteOrder'
                }
            },
            confirmPrompt(item) {
                if (Object.prototype.toString.call(item) !== '[object Object]') return;
                if (item.type === 'cancelOrder') {
                    this.deleteOrderList();
                }
                if (item.type === 'deleteOrder') {
                    this.deleteOrderList();
                }
            },
            deleteOrderList() {
                let submitParams = {
                    order_id : getUrlParams().order_id
                };
                request.actionUnasync({
                    url: 'jd/moveOrder',
                    method: 'post',
                    data: {
                        ...submitParams
                    },
                }).then( result => {
                    if (result.status * 1 === 200 && result.data && result.data.code * 1 === 1000) {
                        JumpPageBack();
                    }
                }).catch( err => {});
            },
            applySela() {
                this.contactTelnameData.status = true;
            },
            contactTelconfirmPay() {
                let submitParams = {
                    order_id : getUrlParams().order_id
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
            queryOrderTrack(){
                let that = this;
                request.actionUnasync({
                    url: 'jd/orderTrack?order_id='+getUrlParams().order_id+'&token='+getUrlParams().token,
                    method: 'get',
                    data: {
                    },
                }).then( result => {
                    if (result.status * 1 === 200 && result.data && result.data.code * 1 === 1000) {
                        console.log(result.data.data);
                        let infoData = result.data.data.orderTrack;
                        let info="";
                        for(let i=0;i<infoData.length;i++){
                            if(info == ""){
                                info = infoData[i].content;
                            }else{
                                info = info+'-'+infoData[i].content;
                            }
                        }
                        that.orderPromptData = {
                            status : true,
                            title : '物流信息',
                            text : info,
                            cancelText : '关闭',
                            okText : '确定'
                        }
                    } else {
                        alert(res.data.msg);
                    }
                }).catch( err => {});
            },
        },
        mounted() {
            this.getToken();
            this.updatedTitle();
            this.getOrderDateils();
        },
        created() {
            currentVue = this;
            this.getToken();
            this.updatedTitle();
        },
    }
</script>
<style lang="scss" src="../../assets/css/base.css"></style>
<style lang="scss" src="../../assets/font/iconfont.css"></style>

<style lang="scss" scoped>
    @import url('./scss/orderDetails.scss');
    .orderDetails {
        width: 100%;
        height: 100%;
        background-color: #f6f6f6;
        overflow-y: auto;
        padding-bottom: .4rem;
        .orderDetails_address {
            width: 100%;
            padding: .1rem .15rem;
            background-color: #fff;
            margin-bottom: .1rem;
            .orderDetails_address_box{
                width: 100%;
                .orderDetails_address_box_left {
                    width: .3rem;
                    font-size: .14rem;
                    text-align: center;
                    &.orderDetils_addres_icon {
                        background-image: url('../../assets/images/weizhi.png');
                        background-position: center center;
                        background-size: .15rem;
                        background-repeat: no-repeat;
                    }
                }
                .orderDetails_address_box_right {
                    .orderDetails_address_box_p1 {
                        font-size: .14rem;
                        color: #000;
                        line-height: .25rem;
                        span{
                            margin-left: .1rem;
                        }
                    }
                    .orderDetails_address_box_p2 {
                        font-size: .12rem;
                        color: #666;
                        line-height: .25rem;
                    }
                }
            }
        }
        .goodslist_box {
            width: 100%;
            padding: .1rem .15rem 0;
            background-color: #fff;
            margin-bottom: .1rem;
            font-size: .14rem;
            .order_list_main_con_li {
                margin-bottom: .1rem;
                position: relative;
                min-height: .8rem;

                .order_list_main_con_li_img {
                    width: .8rem;
                    height: .8rem;
                    position: absolute;
                    left: 0;
                    top: 0;
                }
                .order_list_main_con_li_c {
                    padding-left : .9rem;
                    width: 100%;

                    .order_list_main_con_li_c_h5 {
                        width: 100%;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 2;  //这里是在第二行有省略号
                        overflow: hidden;
                        line-height: .2rem;
                        height: .4rem;
                        word-wrap: break-word;
                        word-break: normal;
                    }
                    .order_list_main_con_li_c_p {
                        font-size: .12rem;
                        line-height: .2rem;
                        color: #888;
                        height: .2rem;
                    }
                    .order_list_main_con_li_c_pri {
                        font-size: .12rem;
                        line-height: .2rem;
                        color: #E1492D;
                        position: relative;
                        span {
                            position: absolute;
                            display: block;
                            height: .2rem;
                            top: 0;
                            right: 0;
                            font-size: .12rem;
                            color: #333;
                            i {
                                vertical-align: top;
                                display: inline-block;
                                height: .2rem;
                                line-height: .2rem;
                                font-style: normal;
                                padding: 0 .06rem;
                                background-color: #D6D6D6;
                            }
                        }
                    }
                }
            }
        }
        .orderGoods_details_box {
            background-color: #fff;
            margin-bottom: .1rem;
            .orderGoods_details_box_li {
                width: 100%;
                height: .4rem;
                border-bottom: 1px solid #f3f3f3;
                font-size: .14rem;
                padding: 0 .15rem;
                .orderGoods_details_box_li_left {
                    height: .4rem;
                    color: #333;
                    font-size: .13rem;
                    line-height: .4rem;
                }
                .orderGoods_details_box_li_right {
                    height: .4rem;
                    color: #888;
                    font-size: .12rem;
                    line-height: .4rem;
                    span {
                        display: inline-block;
                        padding: .0rem .08rem;
                        height: .16rem;
                        border: 1px solid #eee;
                        border-radius: .08rem;
                        line-height: .16rem;
                        margin-top: .12rem;
                        vertical-align: top;
                    }
                }
            }
            .orderGoods_invoice_pro {
                padding: .05rem .15rem .1rem;
                font-size: .12rem;
                color: #888;
            }
        }
        .orderGoods_price {
            background-color: #fff;
            margin-bottom: .1rem;
            .orderGoods_price_li {
                padding: 0 .15rem;
                height: .4rem;
                font-size: .14rem;
                color: #333;
                line-height: .4rem;
                .orderGoods_price_li_left {
                    text-align: left;
                    color: #333;
                }
                .orderGoods_price_li_right {
                    text-align: right;
                    color: #333;
                }
            }
            .orderGoods_price_total {
                padding: 0 .15rem;
                height: .4rem;
                font-size: .14rem;
                color: #333;
                line-height: .4rem;
                text-align: right;
                border-top:1px solid #f3f3f3;
                span {
                    color: #E1492D;
                }
            }
        }
        .orderGoods_fixed {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            height: .4rem;
            background-color: #fff;
            text-align: right;
            font-size: 0;
            padding: 0 .15rem;
            span {
                display: inline-block;
                padding: 0 .1rem;
                height: .2rem;
                border: 1px solid #eee;
                font-size: .12rem;
                line-height: .2rem;
                vertical-align: top;
                margin-top: .1rem;
                color: #888;
                border-radius: .1rem;
                margin-left: .1rem;
                &.is-active{
                    color: #fff;
                    border: 1px solid #E1492D;
                    background-color: #E1492D;
                }
            }
        }
    }
</style>
