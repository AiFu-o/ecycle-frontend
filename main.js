import App from './App'
import uviewPlus from '@/uni_modules/uview-plus'
import "@/uni_modules/uview-plus/index.scss";
// import CustomComponents from "./commons/index.js";

// #ifndef VUE3
console.log("vue2")

import Vue from 'vue'
import './uni.promisify.adaptor'
// console.log(themeAgency);
Vue.config.productionTip = false
App.mpType = 'app'
debugger;
const app = new Vue({
	...App
})
app.use(uviewPlus);
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
import './global/agency/theme-agency.js';
console.log("vue3")
export function createApp() {
	const app = createSSRApp(App)
	app.use(uviewPlus);
	// app.use(CustomComponents);
	return {
		app
	}
}
// #endif


const requestUrl = "https://www.xiaoxunkj.com/api"

uni.addInterceptor('request', {
	invoke(args) {
		// url
		args.url = requestUrl + args.url
		let header = args.header ? args.header : {};
		if (uni.getStorageSync('token')) {
			header['Authorization'] = uni.getStorageSync('token');
		}
		args.header = header;
	},
	success(args) {
		if (args.statusCode == 401) {
			uni.login({
				"provider": "weixin",
				"onlyAuthorize": true,
				success: function(e) {
					uni.request({
						url: "/auth-api/wx/login",
						method: "POST",
						header: {
							"content-type": "application/json"
						},
						data: {
							"jsCode": e.code
						},
						success(res) {
							uni.setStorageSync("userInfo", res.data);
							uni.setStorageSync("token", res.data.token);
							const pages = getCurrentPages()
							const curPage = pages[pages.length - 1];
							uni.navigateTo({
								url: curPage.$page.fullPath
							})
						}
					})
				},
			})
		}
	}
})