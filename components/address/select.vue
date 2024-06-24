<template>
	<view class="address-selector-container" :style="`height: ${layoutContainerH}px;padding-top: ${layoutContainerPaddingTop}px;`">
		<view class="router-back-container">
			<i class="back-icon iconfont icon-back" @click="toBackPage"></i>
			<i class="title-text">发闲置</i>
		</view>
		<view class="main-content-container" :style="`height: ${contentContainerH}px;`">
			<addressList :onSelectAddress="onSelectAddress"></addressList>
		</view>
	</view>
</template>

<script>
	import addressList from "@/pages/address/address.vue";
	export default {
		data() {
			return {
				layoutContainerH: 0,
				layoutContainerPaddingTop: 0,
				contentContainerH: 0,
			}
		},
		mounted() {
		},
		methods: {
			mathLayoutParam(){
				let systemInfo = uni.getSystemInfoSync();
				let layoutContainerPaddingTop = systemInfo.statusBarHeight;
				let layoutContainerH = systemInfo.windowHeight - systemInfo.safeAreaInsets.bottom; //layoutContainerPaddingTop 是顶部要空出来的高度
				this.layoutContainerH = layoutContainerH;
				this.layoutContainerPaddingTop = layoutContainerPaddingTop;
				this.contentContainerH = layoutContainerH - 40 - 44;
			},
			onSelectAddress(_selected){
				
			},
		},
		components: {
			addressList
		}
	}
</script>

<style lang="less">
	.address-selector-container{
		width: 100%;
		background-color: #f5f5f5;
		.router-back-container{
			height: 70rpx;
			width: 100%;
			line-height: 70rpx;
			.back-icon{
				display: inline-block;
				font-size: 50rpx;
				color: #2db371;
				margin-left: 10rpx;
				margin-right: 15rpx;
			}
			.title-text{
				vertical-align: top;
				display: inline-block;
				margin-left: 35vw;
			}
		}
		.main-content-container{
			width: 100vw;
			margin: 0 auto;
			box-sizing: border-box;
		}
	}
</style>