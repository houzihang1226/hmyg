<template>
	<!-- 设置整个盒子高度，当子组件获取焦点时，设置高度，禁用页面滚动 -->
	<view :style="{height:pageHeight,overflow:'hidden'}">
		<!-- 首页 -->
		<!-- 搜索框 -->
		<!-- 自定义事件 子传父 -->
		<search @search='search'></search>
		<!-- 轮播图 -->
		<swiper class="slide" 
		autoplay 
		interval=3000 
		circular 
		indicator-dots 
		indicator-color=rgba(255,255,255,.6)
		 indicator-active-color=#fff>
			<swiper-item :key='item.goods_id' v-for='item in bannerList'>
				<navigator :url="`/pages/goods/goods?id=${item.goods_id}`">
					<image :src='item.image_src'></image>
				</navigator>
			</swiper-item>

		</swiper>
		<!-- 分类列表 -->
		<view class="text-box">
			<view class="txt-list" :key="item.name" v-for='item in navList'>
				<navigator 
				:url="item.navigator_url || `/pages/list/list?query=${item.name}`" 
				:open-type="item.navigator_url ? 'switchTab' : 'navigate'">
					<image :src="item.image_src"></image>
				</navigator>
			</view>

		</view>
		<!-- 底部 楼梯层-->
		<view class="floors">
			<view class="floor" :key="index" v-for="(item,index) in floorList">
				<!-- 标题 -->
				<view class="title">
					<image :src="item.floor_title.image_src"></image>
				</view>
				<!-- 列表 -->
				<view class="items">
					<navigator :url="`/pages/list/list?query=${product.name}`" :key="key" v-for="(product,key) in item.product_list">
						<image :src="product.image_src"></image>
					</navigator>
				</view>
			</view>
		</view>
		<!-- 回到顶部 -->
		<view class="goTop" @click="goTop" v-if="scrollTop > 200">TOP</view>
	</view>
</template>

<script>
	import search from '@/components/search'
	export default {
		data() {
			return {
				pageHeight: 'auto',
				// 轮播图数据
				bannerList: [],
				// 分类列表数据
				navList: [],
				// 楼层初始数据
				floorList: [],
				// 滚动页面的距离，用于显示和隐藏top按键
				scrollTop: 0
			}
		},
		components: {
			search
		},
		methods: {
			goTop() {
				uni.pageScrollTo({scrollTop:0,duration:200})
			},
			// 监听页面滚动距离
			onPageScroll(ev) {
				// console.log(ev)
				this.scrollTop = ev.scrollTop
			},
			search(e) {
				console.log(e)
				this.pageHeight = e.windowHeight
			},
			// 轮播图数据接口
			async getBannerList() {
				const {
					message
				} = await this.request({
					url: '/api/public/v1/home/swiperdata'
				})
				// console.log(res[1].data.message)
				this.bannerList = message
			},
			// 分类列表数据接口
			async getNavList() {
				const {
					message
				} = await this.request({
					url: '/api/public/v1/home/catitems'
				})
				// 查看数据
				// console.log(message)
				this.navList = message
			},
			// 楼层列表数据接口
			async getFloorList() {
				const {
					message
				} = await this.request({
					url: '/api/public/v1/home/floordata'
				})
				// 查看数据
				// console.log(message)
				this.floorList = message
			}
		},
		// 小程序初始化
		onLoad() {
			this.getBannerList()
			this.getNavList()
			this.getFloorList()
		},
		// 下拉刷新
		async onPullDownRefresh() {
			await this.getBannerList()
			await this.getNavList()
			await this.getNavList()
			uni.stopPullDownRefresh() // 停止下拉刷新 ， 因为是异步操作所以需要等待数据返回回来停止下拉刷新
		},
		onShareAppMessage() {
			return {
				title:'优购商城,价格优惠,商品奈斯',
				imageUrl:'https://img.zcool.cn/community/0197935711ee3c6ac7251343b3addc.jpg@1280w_1l_2o_100sh.jpg',
				path:'/pages/index/index'
			}
		}
	}
</script>

<style lang="less">
	.slide {
		image {
			height: 340rpx;
			width: 750rpx;
			vertical-align: middle;
		}
	}

	.text-box {
		margin: 25rpx 0;
		display: flex;
		padding: 0 30rpx;

		.txt-list {
			float: left;
			flex: 1;
			text-align: center;

			image {
				width: 128rpx;
				height: 140rpx;
			}
		}
	}

	.img-banner {
		.img-title {
			height: 59rpx;
			width: 750rpx;
			background-color: #f4f4f4;
			padding-top: 30rpx;

			image {
				height: 100%;
				width: 100%;
			}
		}
	}

	// 底部 楼梯层
	.floor {
		.title {
			width: 750rpx;
			height: 60rpx;
			padding: 20rpx 0 0 10rpx;
			background-color: #f4f4f4;
		}

		.items {
			overflow: hidden;
			padding: 20rpx 16rpx;

			navigator {
				float: left;
				margin-left: 10rpx;

				&:first-child {
					width: 232rpx;
					height: 386rpx;
					margin-left: 0;
				}

				&:nth-child(2),
				&:nth-child(5) {
					width: 273rpx;
					height: 188rpx;
				}

				&:nth-child(3),
				&:nth-child(4) {
					width: 193rpx;
					height: 188rpx;
				}

				&:nth-last-child(-n+2) {
					margin-top: 10rpx;
				}
			}
		}

		&:first-child {
			.items {

				navigator {
					width: 233rpx;
				}
			}
		}
	}
.goTop {
	width: 70rpx;
	height: 70rpx;
	line-height: 70rpx;
	text-align: center;
	background-color: red;
	font-size: 28rpx;
	border-radius: 50%;
	position: fixed;
	right: 10rpx;
	bottom: 30rpx;
}
</style>
