<template>
	<view style="background: #FBFBFB;" :style="{'height':('calc(100vh - '+statusBarHeight+'px)')}">
		<!-- 头部 -->
		<view class="mine-top" :style="{'paddingTop':(statusBarHeight+'px')}">
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
			<view class="mine-top-bottom">
				<view class="mine-top-bottom-item" v-for="item in mineBottomItemList" :key="item.key">
					<view class="mine-top-bottom-item-count">
						{{item.count}}
					</view>
					<view class="mine-top-bottom-item-title">
						{{item.title}}
					</view>
				</view>
			</view>
		</view>

		<!-- 回收商申请 -->
		<view class="mine-recycler-apply">
			认证成为回收商
		</view>

		<!-- 订单 -->
		<view class="mine-order">
			<view class="mine-order-top">
				<text class="mine-order-top-left">我的发布</text>
				<text class="mine-order-top-right">全部发布
					<i class="iconfont icon-fanhui"
						style="transform: rotate(180deg);display: inline-block;font-size: 12px;vertical-align: top;"></i>
				</text>
			</view>
			<view class="mine-order-content">
				<view class="mine-order-content-item" v-for="item in orderItemList" :key="item.key">
					<i :class="('mine-order-content-icon iconfont '+ item.icon)">

					</i>
					<view class="mine-order-content-title">
						{{item.title}}
					</view>
				</view>
			</view>
		</view>

		<!-- 其他工具 -->
		<view class="mine-tools">
			<view class="mine-tools-top">
				<text class="mine-tools-top-left">其他工具</text>
			</view>
			<view class="mine-tools-content">
				<view class="mine-tools-content-item" v-for="item in toolsItemList" :key="item.key">
					<i :class="('mine-tools-content-icon iconfont '+ item.icon)">

					</i>
					<view class="mine-tools-content-title">
						{{item.title}}
					</view>
				</view>
			</view>
		</view>

		<!-- tab-bar -->
		<circle-tab-bar currentPageName="mine"></circle-tab-bar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusBarHeight: 0,
				mineBottomItemList: [{
						key: "collect",
						title: "收藏",
						count: 0
					},
					{
						key: "history",
						title: "历史浏览",
						count: 0
					}
				],
				orderItemList: [{
						key: "SELLING",
						title: "出售中",
						icon: "icon-chushouzhong"
					},
					{
						key: "SOLD",
						title: "已售出",
						icon: "icon-yishouchu"
					},
					{
						key: "OFF_SHELF",
						title: "已下架",
						icon: "icon-yixiajia"
					}
				],
				toolsItemList: [{
						key: "address",
						title: "我的地址",
						icon: "icon-dizhi"
					},
					{
						key: "privacyPolicy",
						title: "隐私条款",
						icon: "icon-yinsitiaokuan"
					},
					{
						key: "lianxiwomen",
						title: "联系我们",
						icon: "icon-lianxiwomen"
					}
				],
			}
		},
		mounted() {
			const that = this;
			uni.getSystemInfo({
				success(systemInfo) {
					that.statusBarHeight = systemInfo.statusBarHeight;
				}
			});
		},
		methods: {

		}
	}
</script>

<style lang="scss">
	$nav-height: 44px;

	.mine-top {
		padding-bottom: 50rpx;
		border-radius: 0 0 50rpx 50rpx;
		background: linear-gradient(135deg, rgba(102, 206, 105, 1) 0%, rgba(45, 179, 113, 1) 100%);
	}

	.mine-top-header {
		width: 100%;
		padding: 7px 0;
		line-height: 30px;
		flex-direction: row;
		height: $nav-height;
		box-sizing: border-box;
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

		.mine-user-info {
			line-height: 100rpx;
			flex: 1;
			margin-left: 30rpx;
			color: #fff;
			font-size: 32rpx;
			font-weight: 600;
		}
	}

	.mine-top-bottom {
		display: flex;
		gap: 20px;
		justify-content: space-around;
		margin-top: 30rpx;

		.mine-top-bottom-item {
			height: 96rpx;
			line-height: 48rpx;
			color: #fff;
			font-size: 28rpx;
			font-weight: 550;
			text-align: center;
		}
	}

	.mine-recycler-apply {
		position: relative;
		margin: 40rpx;
		width: calc(100% - 80rpx);
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		padding: 0 40rpx;
		color: #fff;
		font-weight: 550;
		box-sizing: border-box;
		border-radius: 20rpx;
		overflow: hidden;
		background:
			linear-gradient(135deg, rgba(102, 206, 105, 1) 0%, rgba(45, 179, 113, 1) 100%);
	}

	.mine-recycler-apply::before {
		width: 220rpx;
		height: 100rpx;
		content: '';
		position: absolute;
		right: 20rpx;
		top: 0rpx;
		background: url("../../static/mine/recycler-apply-bg.png") no-repeat right top;
		background-size: 170rpx 80rpx;
	}

	.mine-order {
		margin: 40rpx;
		width: calc(100% - 80rpx);
		background: #fff;
		border-radius: 20rpx;
		padding: 40rpx;
		color: #222;
		box-sizing: border-box;

		.mine-order-top {
			overflow: hidden;
			line-height: 48rpx;
			height: 48rpx;

			.mine-order-top-left {
				font-size: 28rpx;
				font-weight: 550;
				float: left;
			}

			.mine-order-top-right {
				font-size: 24rpx;
				color: #555;
				float: right;
			}
		}

		.mine-order-content {
			display: flex;
			gap: 40rpx;
			justify-content: space-between;
			margin-top: 30rpx;

			.mine-order-content-item {
				text-align: center;

				.mine-order-content-title {
					font-size: 12px;
					margin-top: 6px;
					font-weight: 550;
				}

				.mine-order-content-icon {
					font-size: 40rpx;
				}
			}
		}
	}
	
	.mine-tools {
		margin: 40rpx;
		width: calc(100% - 80rpx);
		background: #fff;
		border-radius: 20rpx;
		padding: 40rpx;
		color: #222;
		box-sizing: border-box;
	
		.mine-tools-top {
			overflow: hidden;
			line-height: 48rpx;
			height: 48rpx;
	
			.mine-tools-top-left {
				font-size: 28rpx;
				font-weight: 550;
				float: left;
			}
		}
	
		.mine-tools-content {
			display: flex;
			gap: 40rpx;
			justify-content: space-between;
			margin-top: 30rpx;
	
			.mine-tools-content-item {
				text-align: center;
	
				.mine-tools-content-title {
					font-size: 12px;
					margin-top: 6px;
					font-weight: 550;
				}
	
				.mine-tools-content-icon {
					font-size: 40rpx;
				}
			}
		}
	}
</style>