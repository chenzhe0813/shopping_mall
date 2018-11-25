<template>
    <section class="flowPrompt">
        <div class="flowPrompt_box">
            <div class="flowPrompt_box_top">
                <h5>{{data.title}}</h5>
                <ul>
                    <li v-for="item in data.html">
                        <p>{{item.msgTime}}</p>
                        <p>{{item.content}}</p>
                    </li>
                </ul>
            </div>
            <div class="flowPrompt_box_button box_sizing box_flex">
                <div class="flowPrompt_box_button_left flex1" @click.stop="cancelFn">{{data.cancelText}}</div>
                <div class="flowPrompt_box_button_right flex1" @click.stop="okFn">{{data.okText}}</div>
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        name : 'flowPrompt',
        data() {
            return {};
        },
        props : {
            data : {
                type : Object
            }
        },
        methods : {
            cancelFn() {
                this.data.status = false;
            },
            okFn() {
                this.$emit('ok_fn', this.data);
                this.data.status = false;
            }
        }
    }
</script>

<style src="../../assets/css/base.css"></style>
<style scoped lang="scss">
.box_sizing {
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
}
.box_flex{
    display: -webkit-box;  /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
    display: -moz-box;     /* 老版本语法: Firefox (buggy) */
    display: -ms-flexbox;  /* 混合版本语法: IE 10 */
    display: -webkit-flex; /* 新版本语法: Chrome 21+ */
    display: flex;         /* 新版本语法: Opera 12.1, Firefox 22+ */
}
.box_flex_col {
    flex-direction: column;
    -webkit-flex-direction: column;
    -moz-flex-direction: column;
    box-orient:horizontal;
    -webkit-box-orient:horizontal;
    -moz-box-orient:horizontal;
}
.flex1 {  
    -webkit-box-flex: 1;   /* OLD - iOS 6-, Safari 3.1-6 */  
    -moz-box-flex: 1;     /* OLD - Firefox 19- */              
    -webkit-flex: 1;      /* Chrome */  
    -ms-flex: 1;           /* IE 10 */  
    flex: 1;              /* NEW, Spec - Opera 12.1, Firefox 20+ */
}
.flex2 {  
    -webkit-box-flex: 2;   /* OLD - iOS 6-, Safari 3.1-6 */  
    -moz-box-flex: 2;     /* OLD - Firefox 19- */              
    -webkit-flex: 2;      /* Chrome */  
    -ms-flex: 2;           /* IE 10 */  
    flex: 2;              /* NEW, Spec - Opera 12.1, Firefox 20+ */
}
.flex3 {  
    -webkit-box-flex: 3;   /* OLD - iOS 6-, Safari 3.1-6 */  
    -moz-box-flex: 3;     /* OLD - Firefox 19- */              
    -webkit-flex: 3;      /* Chrome */  
    -ms-flex: 3;           /* IE 10 */  
    flex: 3;              /* NEW, Spec - Opera 12.1, Firefox 20+ */
}
.flex4 {  
    -webkit-box-flex: 4;   /* OLD - iOS 6-, Safari 3.1-6 */  
    -moz-box-flex: 4;     /* OLD - Firefox 19- */              
    -webkit-flex: 4;      /* Chrome */  
    -ms-flex: 4;           /* IE 10 */  
    flex: 4;              /* NEW, Spec - Opera 12.1, Firefox 20+ */
}
    .flowPrompt {
        position: fixed;
        z-index: 9999999999;
        top: 0;
        right: 0;
        left: 0;
        bottom : 0;
        background-color: rgba(0, 0, 0, .4);
        .flowPrompt_box {
            width: 75%;
            background-color: #fff;
            border-radius: .05rem;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            -webkit-transform: translate(-50%, -50%);
            -moz-transform: translate(-50%, -50%);
            .flowPrompt_box_top {
                padding: .1rem .15rem;
                h5 {
                    font-size: .14rem;
                    line-height: .4rem;
                    font-weight: 500;
                    text-align: center;
                }
                ul {
                    max-height: 3rem;
                    overflow: auto;
                    padding: .15rem .1rem;
                    font-size: .12rem;
                    line-height: .2rem;
                    color: #888;
                    li{
                        height: auto;
                        min-height: .4px;
                        border-left: 1px solid #d9d9d9;
                        padding-bottom: .1rem;
                        position: relative;
                        p{
                            padding-left: .15rem;
                        }
                        &:before{
                            content: '';
                            border: 3px solid #f3f3f3;
                            background-color: #d9d9d9;
                            display: inline-block;
                            width: 5px;
                            height: 5px;
                            border-radius: 5px;
                            position: absolute;
                            left: -6px;
                            top: 5px;
                        }
                    }
                    li:last-child{
                        &:before{
                            border-color: #f8e9e4;
                            background-color: #E1492D;
                        }
                    }
                }
            }
            .flowPrompt_box_button {
                border-top:1px solid #eee;
                height: .4rem;
                text-align: center;
                color: #333;
                line-height: .4rem;
                font-size: .14rem;
                .flowPrompt_box_button_left {
                    height: .4rem;
                    border-right: 1px solid #eee;
                }
                .flowPrompt_box_button_right {
                    height: .4rem;
                    background-color: #E1492D;
                    color: #fff;
                }
            }
        }
    }
</style>


