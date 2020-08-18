<template>
  <view class="wrapper">
    <!-- 订单状态 -->
    <view class="tabs">
      <text
        :class="{active: type === 1}"
        @click="getOrderList(1)">全部</text>
      <text
        :class="{active: type === 2}"
        @click="getOrderList(2)">待付款</text>
      <text
        :class="{active: type === 3}"
        @click="getOrderList(3)">已付款</text>
      <text
        :class="{active: type === 4}"
        @click="getOrderList(4)">退款/退货</text>
    </view>
    <!-- 订单 -->
    <scroll-view class="orders" scroll-y>
      <view class="item" :key="order.order_id" v-for="order in orders">

        <block :key="goods.id" v-for="goods in order.goods">
          <!-- 商品图片 -->
          <image class="pic" :src="goods.goods_small_logo"></image>
          <!-- 商品信息 -->
          <view class="meta">
            <view class="name">{{goods.goods_name}}</view>
            <view class="price">
              <text>￥</text>{{goods.goods_price}}<text>.00</text>
            </view>
            <view class="num">x{{goods.goods_number}}</view>
          </view>
        </block>
        <!-- 总价 -->
        <view class="amount">
          共1件商品 总计: ￥{{order.order_price}}(含运费0.00)
        </view>
        <!-- 其它 -->
        <view class="extra">
          订单号: {{order.order_number}}
          <button
            @click="payment(order.order_number)"
            v-if="order.pay_status == 0"
            size="mini"
            type="primary">支付</button>
          <button v-else size="mini" type="primary">已支付</button>
        </view>
      </view>
    </scroll-view>
    <!-- <view class="">没有找到相关的数据</view> -->
  </view>
</template>

<script>
  export default {

    data () {
      return {
        // 初始订单列表
        orders: [],
        type: 1
      }
    },

    methods: {

      // 支付
      async payment (order_number) {
        // 1. 调用后端接口
        const {message} = await this.request({
          url: '/api/public/v1/my/orders/req_unifiedorder',
          method: 'post',
          // 登录状态
          header: {Authorization: uni.getStorageSync('token')},
          data: {
            order_number
          }
        })
        
        // console.log(message);

        // 2. 通过 API 调用支付窗口
        uni.requestPayment(message.pay);

      },

      async getOrderList (type) {
        // 修改订单类型
        this.type = type || 1;

        // 调用后端接口
        const {message} = await this.request({
          url: '/api/public/v1/my/orders/all',
          method: 'get',
          // 登录状态
          header: {Authorization: uni.getStorageSync('token')},
          data: {type: type || 1}
        })

        // console.log(message);
        // 更新订单列表
        this.orders = message.orders;
      }
    },
    
    onLoad () {
      this.getOrderList();
    }
  }
</script>

<style scoped lang="less">
  .tabs {
    display: flex;
    height: 96rpx;
    line-height: 96rpx;
    background-color: #fff;
    box-shadow: 0 4rpx 10rpx #ccc;

    text {
      flex: 1;
      text-align: center;
      font-size: 27rpx;
      color: #333;

      &.active {
        color: #ea4451;
      }
    }
  }

  .orders {
    width: 100%;
    background-color: #f4f4f4;

    position: absolute;
    top: 97rpx;
    bottom: 0;
  }

  .item {
    padding: 30rpx 20rpx 0;
    margin-top: 16rpx;
    background-color: #fff;

    .pic {
      width: 200rpx;
      height: 200rpx;
      float: left;
    }

    .meta {
      height: 200rpx;
      margin-left: 230rpx;
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

    .num {
      position: absolute;
      bottom: 0;
      right: 20rpx;
      color: #333;
    }

    .amount {
      text-align: right;
      padding: 20rpx;
      font-size: 24rpx;
      border-top: 1rpx solid #eee;
      border-bottom: 1rpx solid #eee;
      margin-top: 20rpx;
      color: #999;
    }

    .extra {
      padding: 30rpx;
      font-size: 24rpx;
      color: #999;
      position: relative;

      button {
        position: absolute;
        right: 20rpx;
        font-size: 24rpx;
        margin-top: -10rpx;
      }
    }
  }
</style>
