import {ref,watchEffect} from 'vue';

console.log("on theme agency run init");

let cThemeControl = 'OS';
let cTheme = 'light';//'dark'，'OS'

const themeControlEnum = ["OS","fixed"];
const themeEnum = ["light","dark"];

const LOCAL_KEY_THEME_CONTROL = "__rd_theme_control__";
const LOCAL_KEY_THEME = "__rd_theme__";

checkAll();

cThemeControl = uni.getStorageSync(LOCAL_KEY_THEME_CONTROL);
cTheme = uni.getStorageSync(LOCAL_KEY_THEME);

function checkAll(){
	checkAndFixTheme(themeControlEnum,LOCAL_KEY_THEME_CONTROL);
	checkAndFixTheme(themeEnum,LOCAL_KEY_THEME);
};
//没用ts，没法用type，也没必要重新实现一个type,就加个识别和修改吧
function checkAndFixTheme(_list,_storageKey){
	if (!uni.getStorageSync(_storageKey) || !_list.includes(uni.getStorageSync(_storageKey))) {
		uni.setStorageSync(_storageKey,_list[0]);
		return false;
	}
	return true;
}


// const theme = ref<cTheme>((uni.getStorageSync(LOCAL_KEY_THEME)) || 'light');

// let sysInfo = uni.getSystemInfoSync();
// if (sysInfo.osTheme.includes("dark") || sysInfo.hostTheme.includes("dark")) {
// 	cTheme = "dark";
// } else {
// 	cTheme = "light";
// }
uni.onThemeChange((_r)=>{
	handleThemeChange(_r);
});

function handleThemeChange(_r,_coercive){
	if (!_coercive && cThemeControl == "fixed") {
		return;
	}
	if (_r.includes("dark")) {
		cTheme = "dark";
	} else {
		cTheme = "light";
	}
	uni.setStorageSync(LOCAL_KEY_THEME,cTheme)
}

export function useTheme() {
	return {
		theme: cTheme,
		toggleTheme(){
			handleThemeChange(cTheme=="dark"?"light":"dark");
		}
	}
}