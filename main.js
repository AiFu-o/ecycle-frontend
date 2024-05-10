import App from './App'
import uviewPlus from '@/uni_modules/uview-plus'
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