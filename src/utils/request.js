
export default function (Vue, callback) {
	// 对uni.requset进行封装
	return function () {
		const { baseURL } = callback // 解构出基准地址并拿到
		console.log(baseURL) // https://www.uinav.com
		// 显示正在加载提示框
		// uni.showLoading({
		// 	title: '正在加载',
		// 	mask: true
		// })
		Vue.prototype.request = async function (params) { // 在Vue原型上添加方法,全局可以调用到 
			// 对象方式传过来参数,当组件调用时候会传过来接口地址
			uni.showLoading({
				title: '正在加载',
				mask: true
			})
			const { url, data, method, header } = params // 解构出来传过来的地址
			const res = await uni.request({ // 发送请求
				url: baseURL + url, // 拼接完整地址
				data,
				method,
				header
			})
			uni.hideLoading()
			console.log(params) // {url: "/api/public/v1/home/swiperdata"}
			//加载完成
			uni.hideLoading()
			console.log(res);
			return res[1].data // 返回从后台拿过来的数据
		}
	}
}

/**
 * 封装request.js
 * 1、创建requestjs文件，并在mainjs中放在全局
 * 2、在mainjs中这是基准地址  // Vue.use(request(Vue,{baseUrl:基准地址}))  前面Vue是Vue实例
 * 3、在request中导出一个function(前面是Vue实例   Vue,后者是回调函数){函数体return出一个function}
 */