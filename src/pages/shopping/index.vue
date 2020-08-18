<template>
  <view class="wrapper">
    <!-- 收货信息 -->
    <view class="shipment">
      <block v-if="address">
      <view class="dt">收货人: </view>
      <view class="dd meta">
        <text class="name">{{address.userName}}</text>
        <text class="phone">{{address.telNumber}}</text>
      </view>
      <view class="dt">收货地址:</view>
      <view class="dd">{{detailAddress}}</view>
      </block>
      <button v-else type="primary" @click="addre">获取收货地址</button>
    </view>
    <!-- 购物车 -->
    <view class="carts">
      <view class="item">
        <!-- 店铺名称 -->
        <view class="shopname">优购生活馆</view>
         <view v-if="!carts.length" style="text-align:center">
          <text>请添加商品到购物车</text>
          <image style="width:700rpx;height:600rpx" src="http://pic.51yuansu.com/pic2/cover/00/33/74/58112f1439894_610.jpg" />
        </view>
        <view class="goods" v-else :key="cart.goods_id" v-for="(cart,index) in carts">
          <!-- 商品图片 -->
          <image class="pic" :src="cart.goods_small_logo"></image>
          <!-- 商品信息 -->
          <view class="meta">
            <view class="name">{{cart.goods_name}}</view>
            <view class="price">
              <text>￥</text>{{cart.goods_price}}<text>.00</text>
            </view>
            <!-- 加减 -->
            <view class="amount">
              <text class="reduce" @click="cartsNum(-1,index)">-</text>
              <input type="number" :value="cart.goods_number" class="number" disabled>
              <text class="plus" @click="cartsNum(1,index)">+</text>
            </view>
          </view>
          <!-- 选框 -->
          <view class="checkbox" @click="toggle(index)">
            <icon type="success" size="20" :color='cart.goods_cheboxed ? "#ea4451" : "#ccc"'></icon>
          </view>
        </view>
       
      </view>
    </view>
    <!-- 其它 -->
    <view class="extra">
      <label class="checkall" @click="cheboxList">
        <icon type="success" :color="all ? '#ea4451' : '#ccc'" size="20"></icon>
        全选
      </label>
      <view class="total">
        合计: <text>￥</text><label>{{allAmoun}}</label><text>.00</text>
      </view>
      <view class="pay" @click="close">结算({{cheboxedCart.length}})</view>
    </view>
  </view>
</template>

<script>
  export default {
    data(){
      return {
        // 购物车
        carts: [],
        // 全选的状态
        step: true,
        // 收货地址
        address: null
      }
    },
    onShow () {
      this.getCarts()
    },
    onLoad () {
      // uni.hideLoading()
    },
    methods: {
      toggle (index) {// 切换选中状态
      this.carts[index].goods_cheboxed = !this.carts[index].goods_cheboxed
      uni.setStorageSync('carts',this.carts)
      },
      // 加减商品数量操作
      cartsNum (step,index) {
        if(step === -1 && this.carts[index].goods_number <= 1) return; // 减号操作 不能为负数和零
        if(step === 1 && this.carts[index].goods_number >= 15) return; // 加号操作 不能超过库存 15为死值 没有数据库支持用死值
        this.carts[index].goods_number += step
        uni.setStorageSync('carts',this.carts) // 存储本地(更新本地)
      },
      // 拿本地存储购物车信息
      getCarts () {
        this.carts = uni.getStorageSync('carts') || []
      },
      cheboxList () {
        this.step = !this.step
        if(this.step === true) this.carts.forEach(item=>{
          return item.goods_cheboxed = true
        })
        if(this.step === false) this.carts.forEach(item=>{
          return item.goods_cheboxed = false
        })
       uni.setStorageSync('carts',this.carts)
      },
      addre () {
        uni.chooseAddress({
          success: (info)=>{
            console.log(info)
            this.address = info
          }
        })
      },
      // 结算
      close () {
        if (!this.address) return uni.showToast({title:'请先获取收货地址'})
        if(!this.cheboxedCart.length) return uni.showToast({title:'选择商品'})
        if(!uni.getStorageSync('token')){
          return uni.navigateTo({
            url:'/pages/auth/auth'
          })
        }
        this.request({
          url:'/api/public/v1/my/orders/create',
          method:'post',
          data:{
            order_price:this.allAmoun,
            consignee_addr:this.detailAddress,
            goods:this.cheboxedCart
          }
        })
      }
    },
    computed: {
      // 处理收货地址
      detailAddress () {
        return this.address && this.address.provinceName + this.address.cityName + this.address.countyName + this.address.detailInfo;
      },
      all () { // 全选
        return this.carts.length === this.cheboxedCart.length
      },
      cheboxedCart(){ // 获得选中的商品
        return this.carts.filter(item =>{
          return item.goods_cheboxed;
        })
      },
      allAmoun () { // 总金额计算 = 选中商品的单个金额 * 选中商品数量
        let money = 0
        this.cheboxedCart.forEach(item=>{
          money += item.goods_price * item.goods_number
        })
        return money
      }
    }
  }
</script>

<style scoped lang="less">
  .shipment {
    height: 120rpx;
    line-height: 2;
    padding: 30rpx 30rpx 40rpx 30rpx;
    font-size: 27rpx;
    color: #333;
    background-color: #fff;
    background-image: url(http://static.botue.com/ugo/images/cart_border%402x.png);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom;

    .dt {
      width: 140rpx;
      float: left;
      clear: both;
    }

    .dd {
      padding-left: 160rpx;
    }

    .meta {
      padding-right: 50rpx;
    }

    text.phone {
      float: right;
    }
  }

  .carts {
    background-color: #f4f4f4;
    padding-bottom: 110rpx;
    overflow: hidden;

    .shopname {
      padding: 30rpx;
      margin-top: 20rpx;
      font-size: 30rpx;
      color: #333;
      background-color: #fff;
      border-top: 1rpx solid #eee;
      border-bottom: 1rpx solid #eee;
    }

    .goods {
      display: flex;
      padding: 30rpx 20rpx 30rpx 0;
      margin-left: 100rpx;
      border-bottom: 1rpx solid #eee;
      background-color: #fff;
  
      position: relative;

      .checkbox {
        width: 101rpx;
        height: 100%;
        background-color: #fff;

        display: flex;
        justify-content: center;
        align-items: center;

        position: absolute;
        left: -100rpx;
        top: 0;
      }

      &:last-child {
        border-bottom: none;
      }

      .pic {
        width: 200rpx;
        height: 200rpx;
        margin-right: 30rpx;
      }

      .meta {
        flex: 1;
        font-size: 27rpx;
        color: #333;
        position: relative;
      }

      .name {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .price {
        position: absolute;
        bottom: 0;

        color: #ea4451;
        font-size: 33rpx;

        text {
          font-size: 22rpx;
        }
      }

      .amount {
        position: absolute;
        bottom: 0;
        right: 20rpx;

        height: 48rpx;
        text-align: center;
        border: 1rpx solid #ddd;
        border-radius: 8rpx;

        display: flex;
        align-items: center;

        text {
          display: block;
          width: 60rpx;
          line-height: 48rpx;
          font-size: 36rpx;
          color: #ddd;
          text-align: center;
        }

        input {
          width: 60rpx;
          height: 48rpx;
          min-height: 48rpx;
          font-size: 27rpx;
          border-left: 1rpx solid #ddd;
          border-right: 1rpx solid #ddd;
        }
      }
    }
  }

  .extra {
    position: fixed;
    bottom: 0;
    /* #ifdef H5 */
    bottom: 50px;
    /* #endif */
    left: 0;
    z-index: 9;

    width: 750rpx;
    height: 96rpx;
    text-align: center;
    line-height: 96rpx;
    font-size: 36rpx;
    border-top: 1rpx solid #eee;
    background-color: #fff;
    color: #333;
    display: flex;

    .checkall {
      width: 140rpx;
      line-height: 1;
      margin-left: 25rpx;
      display: flex;
      align-items: center;

      icon {
        margin-right: 20rpx;
      }
    }

    .total {
      display: flex;
      justify-content: center;
      flex: 1;

      label, text {
        color: #ea4451;
        vertical-align: bottom;
        position: relative;
        bottom: -2rpx;
      }

      text {
        position: relative;
        bottom: -3rpx;
        font-size: 24rpx;

        &:first-child {
          margin-left: 10rpx;
        }
      }
    }

    .pay {
      width: 200rpx;
      background-color: #ea4451;
      color: #fff;
    }
  }
</style>

