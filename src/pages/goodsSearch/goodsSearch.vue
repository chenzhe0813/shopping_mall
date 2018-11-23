<template>
  <div class="app-box">

    <div class="g-main-box">
      <div class="g-address-box">
        <div class="g-left-text">配送至</div>
        <div class="g-right-text">
          <span>广东省深圳市罗湖区地王大厦主楼1311室</span>
          <i class="iconfont icon-iconfontjiantou5"></i>
        </div>
      </div>

      <div class="g-item-box" v-for="item in categoryList">
        <div class="g-title"> {{ item.text }} </div>
        <div class="g-item-cell" v-for="itm in item.list">
          <div class="g-icell" 
              :class="{'g-cell-selected':itm.isSelected}" 
              v-on:click="selectedCell(itm)"> 
              {{ itm.text}} 
          </div>
        </div>
      </div>
    </div>

    <div class="g-footer-box">
      <div v-on:click="resetSelect" class="g-left-btn">重置</div>
      <div class="g-right-btn">确定</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
      return {
        categoryList: [
          {
            text: '品牌',
            list: [
              {
                text: '三只松鼠',
                isSelected: true
              },
              {
                text: '西域美龙',
                isSelected: false
              },
              {
                text: '良品铺子',
                isSelected: false
              },
              {
                text: '三只松鼠1',
                isSelected: false
              },
              {
                text: '三只松鼠2',
                isSelected: false
              }

            ]
          },
          {
            text: '品牌',
            list: [
              {
                text: '三只松鼠',
                isSelected: true
              },
              {
                text: '西域美龙',
                isSelected: false
              },
              {
                text: '良品铺子',
                isSelected: false
              },
              {
                text: '三只松鼠1',
                isSelected: false
              },
              {
                text: '三只松鼠2',
                isSelected: false
              }

            ]
          },
          {
            text: '品牌',
            list: [
              {
                text: '三只松鼠',
                isSelected: true
              },
              {
                text: '西域美龙',
                isSelected: false
              },
              {
                text: '良品铺子',
                isSelected: false
              },
              {
                text: '三只松鼠1',
                isSelected: false
              },
              {
                text: '三只松鼠2',
                isSelected: false
              }

            ]
          }
        ]
      };
  },
  methods: {
    selectedCell: function(item) {
      item.isSelected = !item.isSelected;
    },
    resetSelect: function() {
      for(var i = 0 ; i < this.categoryList.length; i++) {
        for(var j = 0 ; j < this.categoryList[i].list.length; j++) {
          this.categoryList[i].list[j].isSelected = false;
        }
      }
    }
  }
}
</script>


<style src="../iconfont/iconfont.css"></style>

<style lang="scss" scoped type="text/css">
    .app-box {
      position: absolute;
      border: 0px solid red;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #f3f3f3;

      .g-main-box {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 50px;
        border: 0px solid blue;
        overflow-y: auto;

        .g-address-box {
          height: 50px;
          background-color: #ffffff;

          .g-left-text {
            width: 60px;
            height: 50px;
            line-height: 50px;
            font-size: 17px;
            font-weight: bold;
            padding-left: 18px;
            color: #333333;
            float: left;
          }

          .g-right-text {
            margin-left: 70px;
            height: 50px;
            border: 0px solid red;
            color: #676767;
            font-size: 13px;
            line-height: 50px;
            text-align: right;
            overflow: hidden;

            i {
              font-size: 25px;
              margin-right: 5px;
              vertical-align: 5px;
            }

            span {
              vertical-align: 10px;
            }
          }
        }

        .g-item-box {
          margin-top: 12px;
          background-color: #ffffff;
          padding-bottom: 15px;
          overflow: hidden;

          .g-title {
            height: 45px;
            font-size: 17px;
            font-weight: bold;
            line-height: 45px;
            padding-left: 18px;
          }

          .g-item-cell {
            width: 33.33%;
            height: 50px;
            border: 0px solid red;
            float: left;

            .g-icell {
              width: 85px;
              height: 35px;
              border: 1px solid #f7f7f7;
              margin: auto;
              margin-top: 8px;
              text-align: center;
              line-height: 35px;
              border-radius: 5px;
              background-color: #f7f7f7;
              color: #969291;
            }

            .g-cell-selected {
              border: 1px solid #de2302;
              background-color: #fef2f2;
            }
          }
        }
      }

      .g-footer-box {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 50px;
        border: 0px solid red;

        .g-left-btn {
          width:50%;
          height: 50px;
          float: left;
          background-color: #ffffff;
          font-size: 20px;
          font-weight: bold;
          text-align: center;
          line-height: 50px;
        }

        .g-right-btn {
          width:50%;
          height: 50px;
          float: right;
          background-color: #e03c45;
          font-size: 20px;
          font-weight: bold;
          text-align: center;
          line-height: 50px;
          color: #fbfffa;
        }
      }
    }
</style>

<style>
  body {
    margin: 0 0 0 0;
  }
</style>
