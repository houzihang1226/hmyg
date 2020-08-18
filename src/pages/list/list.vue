<template>
  <view>
    <!-- 筛选 -->
    <view class="filter">
      <text class="active">综合</text>
      <text>销量</text>
      <text>价格</text>
    </view>
    <!-- 商品列表 -->
    <scroll-view class="goods" scroll-y @scrolltolower="scrollBo">
      <view 
      class="item" 
      @click="goDetail(goods.goods_id)"  
      v-for="goods in pageList" 
      :key="goods.goods_id">
        <!-- 商品图片 -->
        <image class="pic" :src="goods.goods_small_logo"></image>
        <!-- 商品信息 -->
        <view class="meta">
          <view class="name">{{goods.goods_name}}</view>
          <view class="price">
            <text>￥</text>{{goods.goods_price}}<text>.00</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
  export default {
    data(){
      return {
        pagenum: 1,
        pagesize: 5,
        pageList:[]
      }
    },
    onLoad(config){
      this.config = config
      console.log(this.config)
      this.goodsList()
      // 退出提示框
      uni.hideLoading()
    },
    methods: {
      scrollBo () {
        this.pagenum += 1
        this.goodsList()
      },
      goDetail (id) {
        uni.navigateTo({
          url: `/pages/goods/goods?id=${id}`
        })
      },
      // 搜索结果列表请求
     async goodsList () {
      const {message:{goods}} = await this.request({
          url:'/api/public/v1/goods/search',
          data:{
            query: this.config.query,
            pagenum: this.pagenum, // 页数
            pagesize: this.pagesize // 一页多少个
          }
        })
       this.pageList =this.pageList.concat( goods ) 
       // 数组方法，合并  例如 [1,2,3].push([4,5,6]) === [1,2,3,[4,5,6]]  [1,2,3].concat([4,5,6]) === [1,2,3,4,5,6]
      }
    }
  }
</script>

<style scoped lang="less">
  .filter {
    display: flex;
    height: 96rpx;
    line-height: 96rpx;
    border-bottom: 1rpx solid #ddd;

    /* #ifdef H5 */
    position: relative;
    z-index: 99;
    /* #endif */

    text {
      flex: 1;
      text-align: center;
      font-size: 30rpx;
      color: #333;

      &.active {
        color: #ea4451;
      }
    }
  }
  
  .goods {
    position: absolute;
    width: 100%;
    top: 97rpx;
    bottom: 0;
  }

  .item {
    display: flex;
    padding: 30rpx 20rpx 30rpx 0;
    margin-left: 20rpx;
    border-bottom: 1rpx solid #eee;

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
  }
</style>
