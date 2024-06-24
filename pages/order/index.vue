<template>
	<view class="order-list-container" :style="`height: ${layoutContainerH}px;`">
		<view class="order-top-bar" @click="onSearchRowClick">
			<view class="title-layout">订单</view>
		</view>
		<view class="category-row-container">
			<up-tabs :list="tabList" :lineColor="'#2db371'" @click="onTabSelect"></up-tabs>
		</view>
		<view class="main-list-container" :style="`height: ${listContainerH}px;`">
			<commonList v-if="currentCategory" :currentCategory="currentCategory" style="height:100%;" ></commonList>
		</view>
		<circle-tab-bar currentPageName="order"></circle-tab-bar>
	</view>
</template>

<script>
	import circleTabBar from "@/components/tab-bar/index.vue";
	import commonList from "./list.vue";
	import _ from "lodash";
	export default {
		components: {
			circleTabBar,commonList
		},
		data() {
			return {
				layoutContainerH: 0,
				layoutContainerPaddingTop: 0,
				listContainerH: 0,
				
				currentCategory: "",
				tabList:[],
				defaultTabList_mai:[{name:"竞价中",key:"ing-mai"},{name:"已成交",key:"down-mai"}],
				defaultTabList_hui:[{name:"进行中",key:"ing-hui"},{name:"已完成",key:"down-hui"},{name:"出价中",key:"ing-cj"},{name:"已失效",key:"down-cj"}],
			}
		},
		onLoad() {
			let userInfo = uni.getStorageSync("userInfo");
			//TODO 判断当前登录人类型
			let newTabList = [];
			// if (userInfo.roles.indexOf("admin") >= 0) {
			// 	newTabList = _.concat(this.defaultTabList_mai,this.defaultTabList_hui);
			// } else {
			// 	if (userInfo.roles.indexOf("normalUser") >= 0) {
			// 		newTabList = _.concat(newTabList,this.defaultTabList_mai);
			// 	}
			// 	if (userInfo.roles.indexOf("provider") >= 0) {//这是回收商
					newTabList = _.concat(newTabList,this.defaultTabList_hui);
			// 	}				
			// }
			this.tabList = newTabList;
			this.currentCategory = this.tabList[0].key;
		},
		mounted() {
			this.mathLayoutParam();
		},
		methods: {
			mathLayoutParam(){
				let systemInfo = uni.getSystemInfoSync();
				let layoutContainerPaddingTop = systemInfo.statusBarHeight;
				let layoutContainerH = systemInfo.windowHeight - systemInfo.safeAreaInsets.bottom;//layoutContainerPaddingTop 是顶部要空出来的高度，52是固定的，底部tabbar的高度
				this.layoutContainerH = layoutContainerH;
				this.layoutContainerPaddingTop = layoutContainerPaddingTop;
				this.listContainerH = layoutContainerH - 100 - 44 - 52;
			},
			onTabSelect(_item){
				if (!_item || !_item.name || !_item.name) return;
				this.currentCategory = _item.key;
			}
		}
	}
</script>

<style lang="less">
.order-list-container{
	width: 100%;
	padding-bottom: 100rpx;
	background-color: #f5f5f5;
	.order-top-bar{
		height: 180rpx;
		width: 100vw;
		background-color: #2db371;
		position: relative;
		.title-layout{
			position: absolute;
			bottom: 10rpx;
			left: calc(50% - 18px);
		}
	}
	.category-row-container{
		height: 44px;
		width: 96vw;
		margin: 0 auto;
		box-sizing: border-box;
		// padding: 0rpx 10rpx;
		// background-color: #fff;
	}
	.main-list-container{
		width: 96vw;
		margin: 0 auto;
		box-sizing: border-box;
		position: relative;
	}
}
</style>