<template>
  <!-- 搜索框 -->
  <view class="search" :class="{focused: focused}">
    <!-- 输入框 -->
    <view class="input-box">
      <input
        type="text"
        :placeholder="placeholder"
        @focus="goSearch"
        @input="search"
        @confirm="goList"
        v-model="keyWord"
      />
      <text class="cancel" @click="cancelSearch">取消</text>
    </view>
    <!-- 搜索结果 -->
    <view class="content">
      <view class="title" v-if="!keyWord && historyList.length">
        搜索历史
        <text @click="removeList" class="clear"></text>
      </view>
      <view class="history" v-if="!keyWord && historyList.length">
        <navigator
          style="font-size:40rpx"
          v-for="item in historyList"
          :key="item"
          :url="'/pages/list/list?query='+item"
        >{{item}}</navigator>
      </view>
      <!-- 结果 -->
      <scroll-view 
      v-if="keyWord" scroll-y style="width:750rpx">
        <navigator
          :url="'/pages/goods/goods?id=' + item.goods_id "
          v-for="item in searchList"
          :key="item.goods_id"
          class="searchList"
        >{{item.goods_name}}</navigator>
      </scroll-view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 是否获得焦点的状态值
      focused: false,
      placeholder: "",
      // 搜索列表
      searchList: [],
      // 搜索内容
      keyWord: "",
      // 搜索历史记录
      historyList: uni.getStorageSync("historyList") || []
    };
  },
  methods: {
    // 删除历史记录
    removeList() {
      uni.removeStorageSync("historyList");
      this.historyList = [];
      uni.showToast({
        title: "清空记录成功"
      });
    },
    // 回车添加搜索历史
    goList() {
      if(!this.keyWord) return false
      this.historyList.push(this.keyWord);
      this.historyList = [...new Set(this.historyList)];
      uni.setStorageSync("historyList", this.historyList);
      uni.navigateTo({
        url:'/pages/list/list?query=' + this.keyWord
      })
    },
    // 建议搜索 模糊搜索
    async search() {
      // console.log(this.keyWord)
      // 发请求
      const { message } = await this.request({
        url: "/api/public/v1/goods/qsearch",
        data: {
          query: this.keyWord
        }
      });
      // console.log(message)
      this.searchList = message;
      console.log(this.searchList)
    },
    // 监听输入框的焦点事件
    goSearch(ev) {
      // 改变焦点状态值
      this.focused = true;
      this.placeholder = "请输入您想要的商品";

      // 调用 API 可以获得屏幕大小
      // 原生生中的 API 使用 wx 来调用，
      // 如果在 uni-app 统一更换为 uni
      const { windowHeight } = uni.getSystemInfoSync();
      // console.log(windowHeight)
      uni.hideTabBar(); //隐藏tabBar
      // 触发父组件自定义的 search 事件 禁用滚动
      this.$emit("search", {
        windowHeight: windowHeight + "px"
      });
    },

    cancelSearch() {
      // 改变焦点状态值
      this.focused = false;
      this.placeholder = "";
      this.keyWord = ""; // 清空输入框文字
      this.searchList = []; // 清空搜索列表
      uni.hideLoading(); // 隐藏加载框
      uni.showTabBar(); // 显示tabBar
      // 取消父组件自定义的 search 事件 将高度返回原样 恢复滚动
      this.$emit("search", {
        windowHeight: "auto"
      });
    }
  }
};
</script>

<style lang="less">
.search {
  .input-box {
    padding: 20rpx;
    background-color: #ea4451;
    position: relative;
    display: flex;

    &::after {
      content: "搜索";
      display: block;
      transform: translate(-50%, -50%);
      color: #bbb;
      font-size: 24rpx;
      background-image: url(http://static.botue.com/ugo/images/icon_search%402x.png);
      background-size: 32rpx auto;
      padding-left: 50rpx;
      background-position: left center;
      background-repeat: no-repeat;

      position: absolute;
      top: 50%;
      left: 50%;
    }

    &::before {
      content: "";
      display: none;
      width: 33rpx;
      height: 33rpx;
      transform: translate(20rpx, -50%);
      background-image: url(http://static.botue.com/ugo/images/icon_search%402x.png);
      background-size: 33rpx auto;
      position: absolute;
      top: 50%;
    }
  }

  .cancel {
    display: none;
    color: #333;
    font-size: 30rpx;
    line-height: 60rpx;
    text-align: center;
    border: 1rpx solid #bfbebf;
    border-radius: 20rpx;
    margin-left: 15rpx;
  }

  input {
    flex: 1;
    height: 60rpx;
    background-color: #fff;
    border-radius: 8rpx;
    padding-left: 65rpx;
    color: #808080;
    font-size: 27rpx;
  }

  .content {
    display: none;
    position: absolute;
    top: 100rpx;
    bottom: 0;
    left: 0;
    right: 0;
    // background-color: pink;
  }
  .title {
    font-size: 27rpx;
    line-height: 1;
    color: #333;
    padding: 30rpx;
  }
  .clear {
    display: block;
    width: 27rpx;
    height: 27rpx;
    float: right;
    background-image: url(http://static.botue.com/ugo/images/clear.png);
    background-size: cover;
  }

  .history {
    padding: 30rpx;

    navigator {
      display: inline-block;
      line-height: 1;
      padding: 15rpx 20rpx 12rpx;
      background-color: #ddd;
      font-size: 24rpx;
      margin-right: 20rpx;
      margin-bottom: 15rpx;
      color: #333;
    }
  }
  &.focused {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 9;
    background-color: #fff;

    .input-box {
      background-color: #eee;

      &::before {
        display: block;
      }

      &::after {
        display: none;
      }
    }

    .cancel {
      display: block;
      width: 100rpx;
    }

    .content {
      display: block;
      .searchList {
        padding: 30rpx;
        // display: block;
        // width: 750rpx;
        border-bottom: 1rpx solid #ccc;
        font-size: 30rpx;
      }
    }
  }
}
.goTop {
  display: none;
}
</style>
