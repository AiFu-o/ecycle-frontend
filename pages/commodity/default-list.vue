<template>
	<view class="commodity-default-list-container" :style="`height: ${layoutContainerH}px;padding-top: ${layoutContainerPaddingTop}px;`">
		<view class="search-row-container" @click="onSearchRowClick">
			<i class="search-icon iconfont icon-sousuo"></i>
			<view class="split-line"></view>
			<view class="search-content">举例搜索内容</view>
		</view>
		<view class="category-row-container">
			<up-tabs :list="tabList" :lineColor="'#2db371'" @click="onTabSelect"></up-tabs>
		</view>
		<view class="main-list-container" :style="`height: ${listContainerH}px;`">
			<commonList :currentCategory="currentCategory" style="height:100%;" ></commonList>
		</view>
		<circle-tab-bar currentPageName="home"></circle-tab-bar>
	</view>
</template>

<script>
	import _ from "lodash";
	import circleTabBar from "@/components/tab-bar/index.vue";
	import commonList from "./common-list.vue";
	export default {
		components: {
			circleTabBar,
			commonList
		},
		data() {
			return {
				layoutContainerH: 0,
				layoutContainerPaddingTop: 0,
				listContainerH: 0,
				currentCategory: "",
				currentCategoryText: "",
				tabList:[
					{
						name: "推荐",
						key: "tuijian"
					},
				],
			}
		},
		mounted() {
			this.mathLayoutParam();
			this.loadPageInfo();
		},
		methods: {
			mathLayoutParam(){
				let systemInfo = uni.getSystemInfoSync();
				let layoutContainerPaddingTop = systemInfo.statusBarHeight;
				let layoutContainerH = systemInfo.windowHeight - systemInfo.safeAreaInsets.bottom - layoutContainerPaddingTop;//layoutContainerPaddingTop 是顶部要空出来的高度，52是固定的，底部tabbar的高度
				this.layoutContainerH = layoutContainerH;
				this.layoutContainerPaddingTop = layoutContainerPaddingTop;
				this.listContainerH = layoutContainerH - 40 - 44 -52;
			},
			onTabSelect(_item){
				if (!_item || !_item.name || !_item.name) return;
				this.currentCategory = _item.name;
				this.currentCategoryText = _item.title;
				this.onSearchRowClick();
			},
			onSearchRowClick(){
				uni.navigateTo({
					url: `/pages/search/index?searchText=${this.currentCategoryText}`
				})
			},
			loadPageInfo(){
				this.loadCommodityCategory();
			},
			loadCommodityCategory(){
				uni.request({
					url: "/commodity-api/commodity-category/queryAll",
					method: "GET"
				}).then((res)=>{
					let _data = res.data;
					if (_data.code == 0) {
						let newTabList = [
							{
								name: "推荐",
								key: "tuijian"
							}
						];
						_.forEach(_data.result,(item)=>{
							newTabList.push({
								name: item.title,
								key: item.name
							});
						});
						this.tabList = newTabList;
					}
				},(err)=>{})
			},
		}
	}
</script>

<style lang="less">
.commodity-default-list-container{
	width: 100%;
	padding-bottom: 100rpx;
	background-color: #f5f5f5;
	.search-row-container{
		height: 80rpx;
		width: 96vw;
		margin: 0 auto;
		box-sizing: border-box;
		padding: 0rpx 10rpx;
		border: 1rpx solid #2db371;
		border-radius: 20rpx;
		background-color: #fff;
		// border-image: linear-gradient(135deg, rgba(102, 206, 105, 1) 0%, rgba(45, 179, 113, 1) 100%) 2 2 2 2;
		.search-icon{
			display: inline-block;
			font-size: 50rpx;
			color: #2db371;
			margin-left: 10rpx;
			margin-right: 15rpx;
		}
		.split-line{
			height: 35rpx;
			display: inline-block;
			margin-top: 18rpx;
			width: 2rpx;
			border-left: 1rpx solid #c3c1c1;
		}
		.search-content{
			display: inline-block;
			margin-left: 15rpx;
			line-height: 70rpx;
			color: #676767;
			vertical-align: top;
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
	}
}
</style>