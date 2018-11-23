<template>
    <section class="order_list_main_box box_sizing">
        <ul class="order_list_main_ul">
            <li class="order_list_main_li box_sizing"
                v-for="(item, index) in orderListData"
                :key="index">
                <div class="order_list_main_li_top box_sizing box_flex">
                    <div class="order_list_main_li_left flex1">
                        订单号：<span>{{item.order_id}}</span>
                    </div>
                    <div class="order_list_main_li_right"
                        :class="{'type_status_color' : getType(item)}">
                        {{typeControl[item.current_node_code]}}
                    </div>
                </div>
                <div class="order_list_main_con box_sizing">
                    <div class="order_list_main_con_li box_sizing box_flex"
                        v-for="(_item, index) in getGoodsList(item)"
                        :key="index"
                        @click.stop="clickOrderList(item)">
                        <div class="order_list_main_con_li_img">
                            <img width="100%" height="100%" alt="" :src="getGoodsListImage(item, _item)" />
                        </div>
                        <div class="order_list_main_con_li_c box_sizing flex1">
                            <div class="order_list_main_con_li_c_h5">{{_item.name}}</div>
                            <p class="order_list_main_con_li_c_p"></p>
                            <div class="order_list_main_con_li_c_pri">￥{{_item.price.toFixed(2)}}
                                <span>数量：<i>{{_item.num}}</i></span>
                            </div>
                        </div>
                    </div>
                </div>
                <p class="order_list_main_total box_sizing">合计：{{getTotalParams(item)}}元（含积分{{item.order_point_sum}}）</p>
                <div class="order_list_main_li_bottom box_sizing box_flex">
                    <div class="order_list_main_li_left flex1">
                        下单时间：<span>{{item.create_time}}</span>
                    </div>
                    <div class="order_list_main_li_right">
                        <span :class="getTypeButton(item)" v-if="typeControlButton[item.current_node_code].length > 0" @click.stop="clickListButton(item, index)">{{typeControlButton[item.current_node_code]}}</span>
                        <span @click.stop="clickListButton(item, index, 'delete')" v-if="item.current_node_code === 'FOR_PAY'">删除</span>
                    </div>
                </div>
            </li>
        </ul>
        <div class="order_list_more" v-if="moreType" @click.stop="nextPageAdd">查看更多...</div>
        <div class="order_list_more" v-else>没有更多了</div>
    </section>
</template>

<script>
    import { getParamsToken, saveCacheToken, getSaveCacheToken } from '@/assets/js/utils'
    export default {
        name : 'orderListMain',
        data() {
            return {
                text : '待支付',
                typeControl : {
                    'FOR_PAY' : '待支付',
                    'FOR_SEND' : '待发货',
                    'FOR_RECV' : '待收货',
                    'FOR_CMT' : '待评价',
                    'ORDER_FINISH' : '已完成'
                },
                typeControlButton : {
                    'FOR_PAY' : '确认支付',
                    'FOR_SEND' : '',
                    'FOR_RECV' : '确认收货',
                    'FOR_CMT' : '去评价',
                    'ORDER_FINISH' : '删除'
                },
            };
        },
        props : {
            orderListData : {
                type : Array,
                default : []
            },
            moreType : {
                type : Boolean
            }
        },
        computed : {

        },
        methods : {
            getType(item) {
                if (Object.prototype.toString.call(item) !== '[object Object]') return false;
                switch (item.current_node_code) {
                    case 'FOR_PAY':
                        return true;
                        break;
                    default:
                        return false
                }
            },
            getGoodsList(item) {
                let result = [];
                if (item && typeof item.jd_order_detail === 'string' && item.jd_order_detail.length > 0) {
                    let resultObj = JSON.parse(item.jd_order_detail);
                    if (Array.isArray(resultObj.sku)) {
                        return resultObj.sku;
                    } else {
                        return result;
                    }
                } else {
                    return result;
                }
            },
            getGoodsListImage(item, _item) {
                let result = '';
                if (item && typeof item.jd_order_detail === 'string' && item.jd_order_detail.length > 0) {
                    let resultObj = JSON.parse(item.jd_order_detail);
                    if (Array.isArray(resultObj[_item.skuId])) {
                        if (resultObj[_item.skuId] && resultObj[_item.skuId][0] && resultObj[_item.skuId][0].path) {
                            return `http://img13.360buyimg.com/n3/${resultObj[_item.skuId][0].path}`;
                        } else {
                            return result;
                        }
                    } else {
                        return result;
                    }
                } else {
                    return result;
                }
            },
            getTotalParams(item) {
                if (Object.prototype.toString.call(item) !== '[object Object]') return '0.00';
                if (item.order_price_sum) {
                    return ((item.order_price_sum * 1) / 100).toFixed(2);
                } else {
                    return '0'.toFixed(2);
                }
            },
            getTypeButton(item) {
                if (Object.prototype.toString.call(item) !== '[object Object]') return '';
                switch (item.current_node_code) {
                    case 'FOR_PAY':
                        return 'type_status_button_pay';
                        break;
                    case 'FOR_SEND':
                        return 'type_status_button_flow'
                        break;
                    case 'FOR_RECV':
                        return 'type_status_button_flow';
                        break;
                    case 'ORDER_FINISH':
                        return '';
                        break;
                    default:
                        return ''
                }
            },
            clickListButton(item, index, type) {
                this.$emit('clickListButton', item, index, type);
            },
            getToken() {
                let res = getParamsToken();
                // 保存近缓存
                saveCacheToken(res);
            },
            nextPageAdd() {
                this.$emit('nextPageAdd');
            },
            // 跳转页面
            clickOrderList(item) {
                if (Object.prototype.toString.call(item) !== '[object Object]') return;
                this.$emit('JumpPageHre', item);
            }
        },
        mounted() {
            this.getToken();
        },
        created() {
            this.getToken();
        },
    }
</script>

<style lang="scss" src="../../../../assets/css/base.css"></style>

<style scoped lang="scss">
    @import url('../../scss/currentBase.css');

    .order_list_main_box {
        width: 100%;
        font-size: .14rem;
        .order_list_main_ul {
            width: 100%;

            .order_list_main_li {
                width: 100%;
                background-color: #fff;
                margin-bottom: .1rem;

                .order_list_main_li_top {
                    width: 100%;
                    height: .4rem;
                    border-bottom: 1px solid #F6F6F6;
                    padding: 0 .15rem;

                    .order_list_main_li_left {
                        font-size: .13rem;
                        color: #333;
                        line-height: .4rem;

                        span {
                            font-size: .12rem;
                            color: #888;
                        }
                    }
                    .order_list_main_li_right {
                        font-size: .13rem;
                        color: #333;
                        line-height: .4rem;
                    }
                }
                .order_list_main_li_bottom {
                    width: 100%;
                    height: .4rem;
                    border-bottom: 1px solid #F6F6F6;
                    padding: 0 .15rem;

                    .order_list_main_li_left {
                        font-size: .13rem;
                        color: #333;
                        line-height: .4rem;

                        span {
                            font-size: .12rem;
                            color: #888;
                        }
                    }
                    .order_list_main_li_right {
                        font-size: .13rem;
                        color: #333;
                        line-height: .4rem;
                        span {
                            padding: 0 .1rem;
                            height: .25rem;
                            display: inline-block;
                            margin-top: .07rem;
                            border-radius: .13rem;
                            font-size: .12rem;
                            border: 1px solid #ccc;
                            line-height: .25rem;
                            color: #888;
                            &.type_status_button_pay {
                                border-color: #E24F37;
                                color: #E24F37;
                            }
                            &.type_status_button_flow {
                                border-color: #FF8641;
                                color: #FF8641;
                            }
                        }
                    }
                }

                .order_list_main_con {
                    padding: .1rem .15rem 0;

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
                .order_list_main_total {
                    width: 100%;
                    padding: .05rem .15rem;
                    text-align: right;
                    height: .3rem;
                    font-size: .13rem;
                    color: #333;
                    line-height: .2rem;
                }
            }
        }
        .order_list_more {
            width: 100%;
            text-align: center;
            line-height: .3rem;
            color: #888;
            font-size: .12rem;
        }
    }
    .type_status_color {
        color: #E24F37!important;
    }
</style>

