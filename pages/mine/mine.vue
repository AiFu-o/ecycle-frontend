<template>
	<view>
		<view class="mine-top">
			<view class="mine-top-header">
				<view class="mine-top-header-left">

				</view>
				<view class="mine-top-header-main">
					我的
				</view>
				<view class="mine-top-header-right">
					
				</view>
			</view>
			<view class="mine-top-content">
				<img class="mine-profile" src="../../static/logo.png" alt="">
				<view class="mine-user-info">
					<view class="mine-username">
						焦凯
					</view>
				</view>
			</view>
		</view>
		<circle-tab-bar currentPageName="mine"></circle-tab-bar>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style lang="scss">
	$nav-height: 44px;

	.mine-top {
		padding-bottom: 50rpx;
		border-radius: 0 0 30rpx 30rpx;
		background: linear-gradient(135deg, rgba(102, 206, 105, 1) 0%, rgba(45, 179, 113, 1) 100%);
	}

	.mine-top-header {
		width: 100%;
		padding: 7px 0;
		line-height: 30px;
		flex-direction: row;
		height: $nav-height;
		box-sizing: border-box;
		font-size: 12px;
		color: #fff;
		display: flex;
		font-size: 16px;
		justify-content: space-between;

		.mine-top-header-main {
			text-align: center;
		}

		.mine-top-header-left {
			width: 150rpx;
			text-align: left;
			margin-left: 10px;
		}

		.mine-top-header-right {
			width: 150rpx;
			text-align: right;
			margin-right: 10px;
		}
	}

	.mine-top-content {
		margin-top: 20rpx;
		display: flex;
		height: 100rpx;
		.mine-profile {
			width: 100rpx;
			height: 100rpx;
			border-radius: 100%;
			margin-left: 40rpx;
			border: 2px solid rgb(255, 255, 255, 0.3);
		}
		.mine-user-info{
			line-height: 100rpx;
			flex: 1;
			margin-left: 40rpx;
			color: #fff;
			font-size: 16px;
		}
	}
</style>