<template>
  <div class="app-box">
    <div class="main-box">
      <div class="first-title">
        发票类型
        <mt-button size="small" class="cancelBtn" v-on:click="cancelInvoice">取消发票</mt-button>
      </div>
      <div class="first-text">
        <i v-if="!isInvoice" class="iconfont icon-yuanquan1 icon-unselected"></i>
        <i v-if="isInvoice" class="iconfont icon-yuanquangou icon-selected"></i>
        &nbsp;<span>增值税普通发票</span>
      </div>

      <div class="second-title">发票抬头</div>
      <div class="second-text">
        <label v-on:click="changeSelected(false)">
          <i v-if="isCompany" class="iconfont icon-yuanquan1 icon-unselected"></i>
          <i v-if="!isCompany" class="iconfont icon-yuanquangou icon-selected"></i>
          &nbsp;<span>个人</span>
        </label>
        <label v-on:click="changeSelected(true)" style="margin-left: 30px;">
          <i v-if="!isCompany" class="iconfont icon-yuanquan1 icon-unselected"></i>
          <i v-if="isCompany" class="iconfont icon-yuanquangou icon-selected"></i>
          &nbsp;<span>公司</span>
        </label>
      </div>

      <div v-if="isCompany" class="name-input-text">
        <span>*</span><input v-model="comanyName" placeholder="请填写单位名称" type="text" name="company" />
      </div>
      <div v-if="isCompany" class="name-input-text">
        <span>*</span><input v-model="taxpayerTags" placeholder="请填写纳税人识别号" type="text" name="company" />
      </div>

      <div class="phone-input-text">
        <span>*&nbsp;收票人手机</span><input v-model="phone" placeholder="请填写手机号码" type="text" name="company" />
      </div>
      <div style="padding-bottom:10px;" class="phone-input-text">
        <span class="email-label">收票人邮箱</span><input v-model="email" placeholder="用于接收电子发票，可选填" type="text" name="company" />
      </div>

      <div class="second-title">发票内容</div>
      <div class="goods-details">
        <i v-if="!goodsDetails" class="iconfont icon-yuanquan1 icon-unselected"></i>
        <i v-if="goodsDetails" class="iconfont icon-yuanquangou icon-selected"></i>
        &nbsp;<span>商品明细</span>
      </div>
      <div class="goods-details-comments">发票内容显示详细商品名称及价格信息</div>

    </div>
    <div v-on:click="saveInfo" class="footer-box">
      保存
    </div>

  </div>
</template>

<script>

import { JumpPage } from '@/assets/js/utils'
import request from '@/assets/js/request';
import { Indicator, Toast } from 'mint-ui';
export default {
  name: 'App',
  data() {
    return {
      isInvoice: true,
      isCompany: true,
      goodsDetails: true,

      comanyName: '',
      taxpayerTags: '',
      phone: '',
      email: ''
    };
  },
  created() {
    self = this;
    if(JSON.parse(localStorage.getItem("_invoice_")) && JSON.parse(localStorage.getItem("_invoice_")).data){
      let invoice = JSON.parse(localStorage.getItem("_invoice_")).data;  
      self.isCompany = invoice.order_invoice_title === 'company';
      self.comanyName = invoice.company_name || '';
      self.taxpayerTags = invoice.company_tax_no || '';
      self.phone = invoice.invoice_recver_mobile || '';
      self.email = invoice.invoice_recver_email || '';
    }
  },
  methods: {
    changeSelected: function(isCompany) {
      this.isCompany = isCompany;
    },
    cancelInvoice: function(){
      localStorage.setItem('_invoice_', JSON.stringify({}));
      this.jumpBack();
    },
    saveInfo: function() {
      if(this.isCompany) {
        if(this.comanyName.trim() == "") {
          Toast('单位名称不能为空！');
          return ;
        }
        if(this.taxpayerTags.trim() == "") {
          Toast('纳税人识别号不能为空！')
          return ;
        }
      }
      var telReg = !!this.phone.trim().match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
      if(!telReg) {
        Toast('请输入正确的手机号码!')
        return ;
      }

      var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
      if(this.email.trim() != "" && !reg.test(this.email.trim())) {
        Toast('可以不填写邮箱，如果填写请使用正确邮箱格式！');
        return ;
      }
      var self = this;
      var invoiceData = {};
      if(this.isCompany){
        invoiceData = {
          data: {
          order_invoice_title: 'company',
            invoice_recver_mobile: self.phone,
            invoice_recver_email: self.email,
            order_invoice_detail: '商品明细',
            company_name: self.comanyName,
            company_tax_no: self.taxpayerTags
          }
        }
      }else{
        invoiceData = {
          data: {
            order_invoice_title: 'personal',
            invoice_recver_mobile: self.phone,
            invoice_recver_email: self.email,
            order_invoice_detail: '商品明细',
          }
        }
      }

      localStorage.setItem('_invoice_', JSON.stringify(invoiceData));
      this.jumpBack();
    },
    jumpBack: function(){
      // window.location.href = "http://localhost:8080/submitOrder.html?token=25e629247c683ae1dff49192323333";
      // return ;
      var result = {
        token : getSaveCacheToken(),
      }
 
      JumpPage({
          href : `${request.getUrlbefore()}/submitOrder.html`,
          cache : true,
          params : result
      })
    }
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

      .cancelBtn{
        float: right;
        font-size: 13px;
        margin-top: 7px;
        margin-right: 20px;
        height: 26px;
        background-color: #e03c45;
        color: #FFF;
      }

      .main-box {
        position: absolute;
        border: 0px solid blue;
        top: 0;
        left: 0;
        right: 0;
        bottom: 50px;
        overflow-y: auto;

        .first-title {
          height: 40px;
          font-size: 15px;
          padding-left: 20px;
          background-color: #ffffff;
          line-height: 40px;
          border-bottom: 1px solid #d6d6d6;
        }

        .first-text {
          height: 40px;
          font-size: 14px;
          line-height: 40px;
          padding-left: 20px;
          background-color: #ffffff;

          .icon-unselected {
            color: #828282;
          }

          .icon-selected {
            color: #dc2400;
          }
        }

        .second-title {
          height: 40px;
          font-size: 15px;
          padding-left: 20px;
          background-color: #ffffff;
          line-height: 40px;
          border-bottom: 1px solid #d6d6d6;
          margin-top: 10px;
        }

        .second-text {
          height: 40px;
          font-size: 14px;
          line-height: 40px;
          padding-left: 20px;
          background-color: #ffffff;
          border-bottom: 1px solid #d6d6d6;

          .icon-unselected {
            color: #828282;
          }

          .icon-selected {
            color: #dc2400;
          }
        }

        .name-input-text {
          height: 40px;
          padding-left: 20px;
          padding-right: 30px;
          background-color: #ffffff;
          line-height: 40px;

          input {
            height: 25px;
            background-color: #f6f6f6;
            border: 0;
            border-radius: 5px;
            width: 95%;
            outline: none;
            text-indent: 15px;
          }

          input::-webkit-input-placeholder {
            /* placeholder颜色  */
            color: #bbbbbb;
            /* placeholder字体大小  */
            /* placeholder位置  */
            text-align: left;
          }

          span {
            display: inline-block;
            width: 5%;
            font-size: 14px;
          }
        }

        .phone-input-text {
          height: 40px;
          padding-left: 20px;
          padding-right: 30px;
          background-color: #ffffff;
          line-height: 40px;

          input {
            height: 25px;
            background-color: #f6f6f6;
            border: 0;
            border-radius: 5px;
            width: 69%;
            outline: none;
            text-indent: 15px;
          }

          input::-webkit-input-placeholder {
            /* placeholder颜色  */
            color: #bbbbbb;
            /* placeholder字体大小  */
            /* placeholder位置  */
            text-align: left;
          }

          span {
            display: inline-block;
            width: 31%;
            font-size: 14px;
          }
          .email-label{
            text-indent: 11px;
          }
        }

        .goods-details {
          padding-top: 20px;
          padding-bottom: 5px;
          font-size: 14px;
          padding-left: 20px;
          background-color: #ffffff;

          .icon-unselected {
            color: #828282;
          }

          .icon-selected {
            color: #dc2400;
          }
        }

        .goods-details-comments {
          padding-bottom: 20px;
          padding-top: 5px;
          font-size: 13px;
          padding-left: 42px;
          background-color: #ffffff;
          color: #b7b7b7;
        }

      }

      .footer-box {
        position: absolute;
        height: 50px;
        left: 0;
        right: 0;
        bottom: 0;
        border-top: 1px solid #cdcdcd;
        padding-left: 10px;
        padding-right: 10px;
        background-color: #ffffff;
        font-size: 17px;
        line-height: 50px;
        text-align: center;
        color: #fffffd;
        background-color: #e03c45;
      }
    }
</style>

<style>
  body {
    margin: 0 0 0 0;
  }
</style>
