<template>
    <section class="order_header_box box_sizing box_flex">
        <li class="order_header_box_li flex1"
            v-for="(item, index) in orderStatusArr"
            :key="index"
            @click.stop="clickLabPage(item, index)"
            >
                <span class="order_header_box_span box_sizing"
                    :class="{'is-active' : item.status}">{{item.name}}</span>
            </li>
    </section>
</template>

<script>
    export default {
        name : 'orderHeader',
        data() {
            return {
                orderStatusArr : [
                    {
                        status : false,
                        name : '全部',
                        type : 'all'
                    },
                    {
                        status : false,
                        name : '待付款',
                        type : 'pendingPay'
                    },
                    {
                        status : false,
                        name : '待发货',
                        type : 'DeliverGoods'
                    },
                    {
                        status : false,
                        name : '待收货',
                        type : 'pendingGoods'
                    },
                    {
                        status : false,
                        name : '已完成',
                        type : 'completed'
                    }
                ]
            };
        },
        methods : {
            clickLabPage(item, index) {
                // 广播事件
                this.$emit('clickTabList', item);
                // 初始化所有也签
                this.orderStatusArr.forEach(v => {
                    v.status = false;
                });
                // 标记当前
                this.orderStatusArr[index].status = true;
            },
            // 初始化标签
            initPageTab() {
                let res = true;
                this.orderStatusArr.every(v => {
                    if (v.status) {
                        res = false;
                        return false;
                    }
                    return true;
                })
                if (res) {
                    this.orderStatusArr[0].status = true;
                    this.$emit('initPageTab', this.orderStatusArr[0]);
                }
            },
            updatePageTab(el) {
                let res = {};
                this.orderStatusArr.forEach(v => {
                    if (v.type === el) {
                        res = v;
                        v.status = true;
                    } else {
                        v.status = false;
                    }
                })
                this.$emit('initPageTab', res);
            }
        },
        created() {
            this.initPageTab();
        },
        mounted() {
            this.initPageTab();
        }
    }
</script>

<style lang="scss" src="@/assets/css/base.css"></style>

<style scoped lang="scss">
    @import url('../../scss/currentBase.css');
    @import url('./scss/orderHeader.scss');
</style>

