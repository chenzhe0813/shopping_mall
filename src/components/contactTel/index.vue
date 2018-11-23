<template>
    <section class="contactTel">
        <div class="contactTel_box">
            <div class="close_contactTel" @click.stop="closeContactTel"></div>
            <header class="contactTel_box_header">
                <div class="contactTel_box_header_icon"></div>
            </header>
            <div class="contactTel_box_title">
                联系客服
            </div>
            <div class="contactTel_box_text box_sizing">
                {{ data.messageText }}
            </div>
            <div class="contactTel_box_button" @click.stop="closeContactTel">
                <a :href="tel">拨打客服热线</a>
            </div>
        </div>
    </section>
</template>

<script>
import request from '@/assets/js/request'

export default {
    name: 'contactTel',
    data() {
        return {
            tel: 'tel:'
        };
    },
    props: {
        data : {
            type : Object,
            default : {}
        }
    },
    methods: {
        getTel() {
            const _self = this;
            request.actionUnasync({
                   url: 'home/service_phone',
                   method: 'post',
                   data: {}
               }).then( result => {
                    if (result.data.code * 1 === 1000) {
                       this.tel = `tel:${result.data.data}`;
                    }
                    // if (results.code * 1 === 1000 && Object.prototype.toString.call(result.data) === '[object Array]') {
                    //    this.tel = `tel:${result.data[0]}`;
                    // }
               }).catch( err => {});
        },
        closeContactTel() {
            this.data.status = false;
        }
    },
    activated() {
        this.getTel();
    },
    mounted() {
        this.getTel();
    },
}
</script>


<style lang="scss" scoped>
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
    .contactTel {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 99999999;
        background-color: rgba(0, 0, 0, .5);
    }
    .contactTel_box {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        -webkit-transform: translate(-50%, -50%);
        -moz-transform: translate(-50%, -50%);
        width: 80%;
        background-color: #fff;
        border-radius: .05rem;
        -webkit-border-radius: .05rem;
        -moz-border-radius: .05rem;
    }
    .contactTel_box_header {
        width: 100%;
        height: 1rem;
        background-color: #E03C45;
        position: relative;
        border-top-left-radius: .05rem;
        -webkit-border-top-left-radius: .05rem;
        -moz-border-top-left-radius: .05rem;
        border-top-right-radius: .05rem;
        -webkit-border-top-right-radius: .05rem;
        -moz-border-top-right-radius: .05rem;
    }
    .contactTel_box_header_icon{
        width: .8rem;
        height: .8rem;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        -webkit-transform: translate(-50%, -50%);
        -moz-transform: translate(-50%, -50%);
        background-position: left top;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-image: url('../../assets/images/contactHeader.png');
    }
    .close_contactTel {
        position: absolute;
        right: -0.1rem;
        top: -0.5rem;
        width: .3rem;
        height: .3rem;
        background-position: left top;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-image: url('../../assets/images/guanbi.png');
    }
    .contactTel_box_text {
        width: 100%;
        padding: .2rem .2rem;
        font-size: .12rem;
        color: #666;
    }
    .contactTel_box_title {
        width: 100%;
        font-size: .2rem;
        text-align: center;
        padding-top: .35rem;
    }
    .contactTel_box_button {
        margin-bottom: .35rem;
        margin-left: auto;
        margin-right: auto;
        width: 70%;
        background-color: #E03C45;
        height: .4rem;
        font-size: .14rem;
        text-align: center;
        color: #fff;
        line-height: .4rem;
        border-radius: .2rem;
        -webkit-border-radius: .2rem;
        -moz-border-radius: .2rem;
    }
    .contactTel_box_button a {
        font-size: .14rem;
        text-align: center;
        color: #fff;
        line-height: .4rem;
        display: block;
        width: 100%;
        height: 100%;
    }
</style>

