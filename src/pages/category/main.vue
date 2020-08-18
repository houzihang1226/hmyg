<template>
<!-- 如果数据追加到getTopList中则会显示整个页面 -->
  <view v-if="getTopList.length">
    <!-- 搜索 -->
    <search />
    <!-- 分类 -->
    <view class="category">
      <!-- 顶级分类 -->
      <view class="sup">
        <scroll-view scroll-y>
          <!-- childList 二级菜单的索引值  点击某个索引给那个索引添加样式-->
          <text :class="{active: childList === index}" 
          @click="getchildList(index)" 
          :key="Toplist.cat_id" 
          v-for="(Toplist,index) in getTopList">
          {{Toplist.cat_name}}
          </text>
        </scroll-view>
      </view>
      <!-- 子级分类 -->
      <view class="sub">
        <scroll-view scroll-y>
          <!-- 封面图 -->
          <image src="http://static.botue.com/ugo/uploads/category.png" class="thumb"></image>
          <view class="children" :key="item.cat_id" v-for="item in children">
            <view class="title">{{item.cat_name}}</view>
            <!-- 品牌 -->
            <view class="brands">
              <navigator :url="`/pages/list/list?query=${child.cat_name}`" :key="child.cat_id" v-for="child in item.children">
                <image :src="child.cat_icon"></image>
                <text>{{child.cat_name}}</text>
              </navigator>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>

import search from '@/components/search';

  export default {
    
    data() {
      return {
        getTopList: [],
        // 二级菜单  子菜单 索引
        childList:0
      }
    },
    computed: {
      children(){
        return this.getTopList.length && this.getTopList[this.childList].children //通常每个计算属性中的函数返回的都是计算过后的值
        // 子菜单
      }
    },
    components: {
      search
    },
    methods: {
      async getTop(){
        const {message} =await this.request({
          url:'/api/public/v1/categories'
        })
        // console.log(message)
        this.getTopList = message
      },
      getchildList(index) {
        this.childList = index
        console.log(index)
      }
    },
    onLoad () {
      this.getTop()
    }
  }

</script>

<style lang="less">
  scroll-view {
    height: 100%;
  }

  .category {
    display: flex;
    width: 100%;
    position: absolute;
    top: 100rpx;
    bottom: 0;

    .sup {
      width: 196rpx;
      background-color: #f4f4f4;

      text {
        display: block;
        height: 100rpx;
        text-align: center;
        line-height: 100rpx;
        font-size: 27rpx;
        color: #333;
        border-bottom: 1rpx solid #eee;

        &:last-child {
          border-bottom: none;
        }
        
        &.active {
          background-color: #FFF;
          color: #ea4451;
          position: relative;

          &::before {
            content: '';
            display: block;
            width: 8rpx;
            height: 60rpx;
            transform: translateY(-50%);
            background-color: #ea4451;

            position: absolute;
            left: 0;
            top: 50%;
          }
        }
      }
    }

    .sub {
      flex: 1;
      padding: 20rpx 18rpx;

      .thumb {
        width: 100%;
        height: 180rpx;
      }

      .children {
        text-align: center;
        color: #333;

        .title {
          display: inline-block;
          margin: 40rpx 0 20rpx;
          font-size: 30rpx;

          &::before {
            content: '/';
            margin-right: 20rpx;
            color: #666;
          }

          &::after {
            content: '/';
            margin-left: 20rpx;
            color: #666;
          }
        }
      }

      .brands {
        display: flex;
        flex-wrap: wrap;

        navigator {
          width: 33%;
          margin-bottom: 20rpx;
        }

        image {
          width: 120rpx;
          height: 120rpx;
        }

        text {
          display: block;
          font-size: 24rpx;
        }
      }
    }
  }
</style>

