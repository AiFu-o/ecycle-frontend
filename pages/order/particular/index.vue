<template>
	<view class="order-detail-container" :style="`height: ${layoutContainerH}px;`">
		<view class="order-top-bar" @click="onSearchRowClick">
			<i class="back-icon iconfont icon-back" @click="toBackPage"></i>
			<view class="title-layout">订单详情</view>
		</view>
		<scroll-view class="particular-scroll-container" :style="`height: ${listContainerH}px;`" scroll-y="true">
			<view></view>
		</scroll-view>
	</view>
</template>

<script>
	import _ from "lodash";
	export default {
		components: {
		},
		data() {
			return {
				layoutContainerH: 0,
				layoutContainerPaddingTop: 0,
				listContainerH: 0,
				
				orderId: "",
			}
		},
		onLoad: function (_option) {
			this.orderId = _option.cid;
			this.loadOrderData();
		},
		mounted() {
			this.mathLayoutParam();
		},
		methods: {
			loadOrderData(){
				
			},
			toBackPage(){
				uni.navigateBack();
			},
			mathLayoutParam(){
				let systemInfo = uni.getSystemInfoSync();
				let layoutContainerPaddingTop = systemInfo.statusBarHeight;
				let layoutContainerH = systemInfo.windowHeight - systemInfo.safeAreaInsets.bottom;//layoutContainerPaddingTop 是顶部要空出来的高度，52是固定的，底部tabbar的高度
				this.layoutContainerH = layoutContainerH;
				this.layoutContainerPaddingTop = layoutContainerPaddingTop;
				this.listContainerH = layoutContainerH - 100 - 44 - 52;
			},
		}
	}
</script>

<style lang="less">
.order-detail-container{
	width: 100%;
	padding-bottom: 100rpx;
	background-color: #f5f5f5;
	.order-top-bar{
		height: 180rpx;
		width: 100vw;
		background-color: #2db371;
		position: relative;
		.back-icon{
			display: inline-block;
			font-size: 50rpx;
			color: #2db371;
			margin-left: 10rpx;
			margin-right: 15rpx;
		}
		.title-layout{
			position: absolute;
			bottom: 10rpx;
			left: calc(50% - 18px);
		}
	}
}
</style>