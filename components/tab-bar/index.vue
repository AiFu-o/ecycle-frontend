<template>
	<view class="tab-bar-all">
		<view class="tab-bar-item" @click="toLink('/pages/home/home')"
			:class="{'current-tab-bar-item':currentPageName == 'home'}">
			<i class="iconfont tab-bar-item-icon icon-home" />
			<view class="tab-bar-item-title">
				首页
			</view>
		</view>
		<view class="tab-bar-item" @click="toLink('/pages/order/order')"
			:class="{'current-tab-bar-item':currentPageName == 'order'}">
			<i class="iconfont tab-bar-item-icon icon-order" />
			<view class="tab-bar-item-title">
				订单
			</view>
		</view>
		<view class="tab-bar-item">
			<view class="tab-bar-circle-item">
				<i class="iconfont tab-bar-item-icon icon-publish" />
			</view>
		</view>
		<view class="tab-bar-item" @click="toLink('/pages/message/message')"
			:class="{'current-tab-bar-item':currentPageName == 'message'}">
			<i class="iconfont tab-bar-item-icon icon-message" />
			<view class="tab-bar-item-title">
				消息
			</view>
		</view>
		<view class="tab-bar-item" @click="toLink('/pages/mine/mine')"
			:class="{'current-tab-bar-item':currentPageName == 'mine'}">
			<i class="iconfont tab-bar-item-icon icon-mine" />
			<view class="tab-bar-item-title">
				我的
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		props: {
			currentPageName: String
		},
		methods: {
			toLink(path) {
				uni.navigateTo({
					url: path
				})
			}
		}
	}
</script>

<style lang="scss">
	.tab-bar-all {
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		width: 100%;
		height: 114rpx;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-between;
		padding-bottom: 40rpx;
		backdrop-filter: blur(10px);

		.tab-bar-item {
			text-align: center;
			width: 100%;
			color: #222222;
			font-size: 12px;
			padding-top: 20rpx;
			// border-top: 1px solid red;
			position: relative;

			.tab-bar-item-icon {
				font-size: 40rpx;
				margin-bottom: 4rpx;
				display: inline-block;
			}
		}

		.tab-bar-item:nth-child(3) {
			padding-top: 0;
			border-top: none;
		}

		.current-tab-bar-item {
			color: #1bac22;
			font-weight: 550;
		}

		.tab-bar-circle-item {
			background: #1bac22;
			color: #fff;
			width: 100rpx;
			height: 100rpx;
			border-radius: 100%;
			margin: 0 auto;
			line-height: 50px;
			text-align: center;
			z-index: 2;

			.tab-bar-item-icon {
				font-size: 58rpx;
			}
		}

		.tab-bar-circle-item-border {
			width: 104rpx;
			height: 104rpx;
			border-radius: 100%;
			position: absolute;
			top: -30rpx;
			border-top: 2px red solid;
			left: calc(50% - 52rpx);
			z-index: -1;
		}
	}
</style>