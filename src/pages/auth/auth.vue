<template>
  <view>
    <!-- 
      当为 button 设置了 open-type 属性并且
      值为 getUserInfo 时，是用来获取用户信息的
      与直接调用 wx.getUserInfo 不同的是，它会弹出
      授权窗口
    -->

    <!--
      当为按钮设置了 open-type="getUserInfo"
      会触发一个事件 getuserinfo
    -->
    <button open-type="getUserInfo" @getuserinfo="getInfo" type="primary">微信登录</button>
  </view>
</template>

<script>
export default {
  async onLoad() {
    uni.hideLoading()
    const [err, res] = await uni.getSetting() // getSetting() 检查是否授权
    if (res.authSetting["scope.userInfo"]) {
      const [err, info] = await uni.getUserInfo()
      const { encryptedData, iv, rawData, signature } = info
      this.login(encryptedData, iv, rawData, signature)
    }
  },
  methods: {
    getInfo(e) {
      const { encryptedData, iv, rawData, signature } = e.detail
      this.login(encryptedData, iv, rawData, signature)
    },
   async login(encryptedData, iv, rawData, signature) {
      const [err,res] = await uni.login()
      console.log(res)
      const {message} = await this.request({
        url:'/api/public/v1/users/wxlogin',
        method:'post',
        data:{
          encryptedData, 
          iv, 
          rawData, 
          signature,
          code: res.code
        }
      })
      uni.setStorageSync('token',message.token)
      uni.navigateBack()
    }
  }
}
</script>

<style lang="less" scoped>
button {
  width: 600rpx;
  margin: 200rpx auto 0;
}
</style>