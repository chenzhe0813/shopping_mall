<template>
  <div class="app-box">
    <div class="main-box">
      <mt-cell-swipe style="margin-top: 5px;"
      title=""
      v-for="(item, index) in shoppingList"
      :key="(item, index)"
      :right="[{
        content: '<i style=\'font-size: 28px;vertical-align:-30px;\'class=\'iconfont icon-shanchu1\'></i><br/><span style=\'display:block;margin-top:-10px;height:20px;line-height: 20px;\'>删除</span>', 
        style: {background: '#e03c45', color: '#fff'}, 
        handler: ()=> deleteItem(item, index)
      }]">
        <div slot="title" class="item-box">
          <div v-on:click="selectedOne(item, index)" class="seleted-box">
            <i v-if="item.isSelected" class="iconfont icon-yuanquangou icon-selected"></i>
            <i v-if="!item.isSelected" class="iconfont icon-yuanquan1 icon-unselected"></i>
          </div>
          <div class="image-box">
            <img :src="'http://img13.360buyimg.com/n3/'+item.data.url">
          </div>
          <div class="content-box">
            <div class="goods-comments"> {{ item.data.goods_name }} </div>
            <div class="discount-text">积分可抵扣：￥0.00</div>
            <div class="count-price-box">
              <div class="left-text">￥{{ item.data.price }}</div>
              <div class="right-counter-box">
                <span v-on:click="addition(item, index)">+</span>
                <span class="conut-vlue">{{ item.count }}</span>
                <span v-on:click="subtraction(item, index)">-</span>
                <span class="count-title">数量：</span>
              </div>
            </div>
          </div>
        </div>
      </mt-cell-swipe>

    </div>

    <div class="footer-box">
      <div v-on:click="selectedAll" class="footer-box-left">
        <i v-if="!isAllSelected" class="iconfont icon-yuanquan1 icon-unselected"></i>
        <i v-if="isAllSelected" class="iconfont icon-yuanquangou icon-selected"></i>
        <span>全选</span>
      </div>

      <div class="footer-box-center">
        <div class="count-text">合计：</div>

        <div class="count-price-box">
          <span>￥{{ sumPriceText }}</span><br/>
          <label>积分抵扣:￥0.00</label>
        </div>
      </div>

      <div v-on:click="settlementPrice()" class="footer-box-right">结算</div>

    </div>

  </div>
</template>

<script>
import { getUrlParams, getParamsToken, saveCacheToken, getSaveCacheToken, payFunction, JumpPage } from '@/assets/js/utils'
import request from '@/assets/js/request'

import { MessageBox, Indicator, Toast } from 'mint-ui';
export default {
  name: 'App',
  data() {
    return {
      isAllSelected: false,
      sumPriceText: 0.00,
      shoppingList: [
        // {isSelected: false, count:1, data:{}}
      ]
    };
  },
  created() {
    this.getToken();
    this.getShoppingCartList();
  },
  methods: {
    settlementPrice: function() {
      var list = [];
      for(var i = 0 ; i < this.shoppingList.length ; i++) {
        if(this.shoppingList[i].isSelected) {
          list.push({
            imagePath: this.shoppingList[i].data.url,
            name: this.shoppingList[i].data.goods_name,
            price: {
              jdPrice: this.shoppingList[i].data.jdPrice,
              price: this.shoppingList[i].data.price
            },
            count: this.shoppingList[i].data.qty,
            sku: this.shoppingList[i].data.sku
          });
        }
      }
      if(list.length <= 0) {
        Toast('请选中你要购买的清单！');
        return ;
      }
      localStorage.setItem("_goodsDetails_",JSON.stringify({
        access: 'shoppingCart',
        data: list
      }));

      this.JumpPageHre()
    },
    JumpPageHre() {
        // window.location.href = "http://192.168.1.101:8080/submitOrder.html?token=25e629247c683ae1dff49192323333";
        // return ;

        var result = {
          token : getSaveCacheToken()
        }
        JumpPage({
            href : `${request.getUrlbefore()}/submitOrder.html`,
            cache : true,
            params : result
        })
    },
    getShoppingCartList: function() {
      Indicator.open();
      request.actionUnasync({
          url: 'jd/shoppingCatList',
          method: 'post',
          data: {
            page: 1, 
            pagenumber: 999
          }
      }).then( result => {
          console.log(result);
          Indicator.close();
          if(result.data.code == 1000) {
            var list = result.data.data;
            for(var i = 0 ; i < list.length ; i++) {
              this.shoppingList.push({
                  isSelected: false,
                  count: list[i].qty,
                  data: list[i]
              });
            }
          }
          this.sumPrice();
      }).catch( err => {
          console.log(err)
      });

    },
    changeTab: function(index) {
      
    },
    deleteItem: function(item, index) {
      MessageBox({
        title: '温馨提示',
        message: '确定要删除此订单？',
        showCancelButton: true,
        confirmButtonText:"确定删除",
        cancelButtonText:"在等等"
      }).then(action => {
        if(action =='confirm') {
          Indicator.open();
          request.actionUnasync({
              url: 'jd/moveShoppingCat',
              method: 'post',
              data: {
                shoppingCatId: item.data.scid
              }
          }).then( result => {
              console.log(result);
              Indicator.close();
              if(result.data.code == 1000) {
                this.shoppingList.splice(index, 1);
                this.sumPrice();
                Toast('删除成功！');
              }
          }).catch( err => {
              console.log(err)
              Toast('删除失败！');
          });
        }
      }); 
    },
    selectedOne: function(item, index) {
      item.isSelected = !item.isSelected;
      var count = 0;
      for(var i = 0 ; i < this.shoppingList.length ; i++) {
        if(this.shoppingList[i].isSelected) {
          count++;
        }
      }
      if(count == this.shoppingList.length) {
        this.isAllSelected = true;
      } else {
        this.isAllSelected = false;
      }
      console.log(this.shoppingList)
      this.sumPrice();
    },
    selectedAll: function() {
      this.isAllSelected = !this.isAllSelected;
      if(this.isAllSelected) {
        for(var i = 0 ; i < this.shoppingList.length ; i++) {
          this.shoppingList[i].isSelected = true;
        }
      } else {
        for(var i = 0 ; i < this.shoppingList.length ; i++) {
          this.shoppingList[i].isSelected = false;
        }
      }
      this.sumPrice();
    },
    addition: function(item, index) {
      // item.count += 1;
      var tempCount = item.count;
      tempCount += 1;
      Indicator.open();
      request.actionUnasync({
          url: 'jd/updateShoppingCat',
          method: 'post',
          data: {
            shoppingCatId: item.data.scid, 
            num: tempCount
          }
      }).then( result => {
          console.log(result);
          Indicator.close();
          if(result.data.code == 1000) {
            item.count = tempCount;
            item.data.qty = tempCount;
            this.sumPrice();
          }
      }).catch( err => {
          console.log(err)
      });
    },
    subtraction: function(item, index) {
      if(item.count > 1) {
        // item.count -= 1;

        var tempCount = item.count;
        tempCount -= 1;
        Indicator.open();
        request.actionUnasync({
            url: 'jd/updateShoppingCat',
            method: 'post',
            data: {
              shoppingCatId: item.data.scid, 
              num: tempCount
            }
        }).then( result => {
            console.log(result);
            Indicator.close();
            if(result.data.code == 1000) {
              item.count = tempCount;
              item.data.qty = tempCount;
              this.sumPrice();
            }
        }).catch( err => {
            console.log(err)
        });

      }
    },
    //价格汇总
    sumPrice: function() {
      this.sumPriceText = 0;
      for(var i = 0 ; i < this.shoppingList.length ; i++) {
        if(this.shoppingList[i].isSelected) {
          this.sumPriceText += this.shoppingList[i].data.price * this.shoppingList[i].data.qty;
        }
      }
    },
    getToken() {
      let res = getParamsToken();
      // 保存近缓存
      saveCacheToken(res);
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

      .main-box {
        position: absolute;
        border: 0px solid blue;
        top: 0;
        left: 0;
        right: 0;
        bottom: 50px;
        overflow-y: auto;

        .item-box {
          height: 120px;
          border: 0px solid red;

          .seleted-box {
            width: 25px;
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
            border: 0px solid #d6d6d6;
            float: left;

            img {
              border: 0;
              width: 100%;
              height: 100%;
            }
          }

          .content-box {
            height: 120px;
            border: 0px solid red;
            margin-left: 130px;
            padding-top: 15px;
            padding-bottom: 15px;
            overflow: hidden;

            .goods-comments {
              height: 40px;
              line-height: 20px;
              border: 0px solid red;
              font-size: 15px;
              overflow: hidden;
            }

            .discount-text {
              height: 15px;
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
                font-size: 15px;
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

        .footer-box-left {
          height: 50px;
          border: 0px solid red;
          float: left;
          line-height: 50px;
          font-size: 14px;

          .icon-unselected {
            color: #676767;
          }

          .icon-selected {
            color: #e03c45;
          }
        }

        .footer-box-center {
          height: 50px;
          border: 0px solid red;
          margin-left:20px;
          float: left;

          .count-text {
            height: 50px;
            float: left;
            font-size: 16px;
            line-height: 50px;
          }

          .count-price-box {
            height: 50px;
            float: left;
            border: 0px solid red;
            font-size: 12px;

            span {
              font-size: 15px;
              font-weight: bold;
              color: #e03c45;
              vertical-align: -12px;
            }

            label {
              color: #cdcdcd;
              vertical-align: -6px;
            }
          }
        }

        .footer-box-right {
            width: 80px;
            height: 30px;
            background-color: #e03c45;
            color: white;
            text-align: center;
            line-height: 30px;
            font-size: 14px;
            float: right;
            margin-top: 10px;
            border-radius: 15px;
          }
      }
    }
</style>

<style>
  body {
    margin: 0 0 0 0;
  }
</style>
