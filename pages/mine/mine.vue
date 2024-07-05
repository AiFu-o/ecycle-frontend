<template>
	<view style="background: #FBFBFB;" :style="{'height':('calc(100vh - '+statusBarHeight+'px)')}">
		<!-- 头部 -->
		<view class="mine-top" :style="{'paddingTop':(statusBarHeight+'px')}">
			<view class="mine-top-header">
				<view class="mine-top-header-left" @click="logout">
					{{userInfo && userInfo.userId?'退出登录':''}}
				</view>
				<view class="mine-top-header-main">
					我的
				</view>
			</view>
			<view class="mine-top-content">
				<img v-if="userInfo && userInfo.profile" class="mine-profile" :src="userInfo.profile">
				<i class="default-user-profile iconfont icon-morentouxiang" v-else></i>
				<view class="mine-user-info">
					<view class="mine-username" v-if="userInfo && userInfo.userId">
						{{userInfo.nickName}}
					</view>
					<view class="mine-username" v-else @click="doLogin">
						点击登录
					</view>
				</view>
			</view>
			<view class="mine-top-bottom">
				<view class="mine-top-bottom-item" @click="item['on-click']" v-for="item in mineBottomItemList"
					:key="item.key">
					<view class="mine-top-bottom-item-count">
						{{mineBottomData[item.key]}}
					</view>
					<view class="mine-top-bottom-item-title">
						{{item.title}}
					</view>
				</view>
			</view>
		</view>

		<!-- 回收商申请 -->
		<view class="mine-recycler-apply" @click="toPath('/pages/mine/recycler-apply/recycler-apply')">
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
				<view class="mine-tools-content-item" @click="item['on-click']" v-for="item in toolsItemList"
					:key="item.key">
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
	import circleTabBar from "@/components/tab-bar/index.vue";
	export default {
		components: {
			circleTabBar
		},
		data() {
			return {
				userInfo: null,
				statusBarHeight: 0,
				mineBottomData: {
					favoriteCount: 0,
					historyCount: 0,
				},
				mineBottomItemList: [{
						key: "favoriteCount",
						title: "收藏",
						"on-click": () => {
							this.toPath("/pages/commodity/favorite/favorite");
						}
					},
					{
						key: "historyCount",
						title: "历史浏览",
						count: 0,
						"on-click": () => {
							this.toPath("/pages/commodity/history-view/history-view");
						}
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
						icon: "icon-dizhi",
						"on-click": () => {
							this.toPath("/pages/address/address");
						}
					},
					{
						key: "privacyPolicy",
						title: "隐私政策",
						icon: "icon-yinsitiaokuan",
						"on-click": () => {
							this.toPath('/pages/privacy-policy/privacy-policy');
						}
					},
					{
						key: "lianxiwomen",
						title: "联系我们",
						icon: "icon-lianxiwomen",
						"on-click": () => {
							this.openContact();
						}
					}
				],
			}
		},
		mounted() {
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight;
			this.getUserInfo();
			this.loadTopCount();
		},
		methods: {
			loadTopCount() {
				Promise.all([this.loadFavoriteCount(),
					this.loadHistoryCount()
				]).then(datas => {
					let favoriteCount = 0,
						historyCount = 0;
					if (datas && datas[0]) {
						favoriteCount = datas[0];
					}
					if (datas && datas[1]) {
						historyCount = datas[1];
					}
					this.mineBottomData = {
						favoriteCount,
						historyCount
					};
				})
			},
			loadHistoryCount() {
				return new Promise((resolve, reject) => {
					uni.request({
						url: "/commodity-api/commodity/view-record/count",
						method: "GET",
						success(res) {
							if (res.data.code == 0) {
								resolve(res.data.result);
							} else {
								reject(res.data.msg);
							}
						},
						fail(err) {
							reject(err);
						}
					})
				});
			},
			loadFavoriteCount() {
				return new Promise((resolve, reject) => {
					uni.request({
						url: "/commodity-api/favorite/count",
						method: "GET",
						success(res) {
							if (res.data.code == 0) {
								resolve(res.data.result);
							} else {
								reject(res.data.msg);
							}
						},
						fail(err) {
							reject(err);
						}
					})
				});
			},
			toPath(path) {
				uni.navigateTo({
					url: path
				})
			},
			openContact() {
				uni.makePhoneCall({
					phoneNumber: "18519352332"
				})
			},
			logout() {
				if (this.userInfo && this.userInfo.userId) {
					uni.request({
						url: "/auth-api/logout",
						method: "POST",
						success: (res) => {
							uni.clearStorage("userInfo");
							uni.clearStorage("token");
							this.userInfo = null;
						}
					})
				}
			},
			getUserInfo() {
				this.userInfo = uni.getStorageSync("userInfo");
			},
			getWxUserInfo() {
				return new Promise((resolve, reject) => {
					uni.getUserInfo({
						provider: 'weixin',
						success: function(infoRes) {
							resolve(infoRes);
						}
					})
				})
			},
			doLogin() {
				uni.login({
					"provider": "weixin",
					"onlyAuthorize": true,
					success: async (e) => {
						try {
							const infoRes = await this.getWxUserInfo();
							const res = await uni.request({
								url: "/auth-api/wx/login",
								method: "POST",
								header: {
									"content-type": "application/json;charset=utf-8"
								},
								data: {
									"jsCode": e.code,
									"nickname": infoRes.userInfo.nickName,
									"avatarUrl": infoRes.userInfo.avatarUrl,
								},
							});
							uni.setStorageSync("userInfo", res.data);
							uni.setStorageSync("token", res.data.token);
							this.userInfo = res.data;
						} catch (e) {
							console.error(e);
						}
					}
				});
			},
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
			flex: 1;
			padding-right: calc(150rpx + 15px);
		}

		.mine-top-header-left {
			width: 150rpx;
			text-align: left;
			margin-left: 15px;
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
			border: 4rpx solid rgb(255, 255, 255, 0.3);
		}

		.default-user-profile {
			width: 100rpx;
			height: 100rpx;
			border-radius: 100%;
			margin-left: 40rpx;
			border: 4rpx solid rgb(255, 255, 255, 0.3);
			font-size: 70rpx;
			text-align: center;
			line-height: 74rpx;
			color: #8a8a8a;
		}

		.mine-user-info {
			line-height: 100rpx;
			flex: 1;
			margin-left: 30rpx;
			color: #fff;
			font-size: 32rpx;
			font-weight: 600;

			.mine-no-login-button {
				border: none;
				padding: 0;
				margin: 0;
				color: #fff;
				font-size: 32rpx;
				font-weight: 600;
				display: inline-block;
				vertical-align: middle;
				line-height: 108rpx;
			}
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