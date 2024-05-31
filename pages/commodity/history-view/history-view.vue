<template>
	<view class="history-view">
		<scroll-view scroll-y="true" :style="`height: ${scrollH}px`" @scrolltoupper="scrolltoupper"
			@scrolltolower="scrolltolower">
			<view class="history-view-day" v-for="(commodities,key) in dataList" :key="key">
				<view class="history-view-time">
					{{key}}
				</view>
				<view class="history-view-content">
					<view class="history-view-comodity" v-for="commodity in commodities" :key="commodity.id">
						<image class="history-view-comodity-img" :src="commodity.coverFileUrl" lazy-load
							mode="aspectFill">
						</image>
						<view class="history-view-comodity-price">
							{{commodity.amount}}<text>元</text>
						</view>
					</view>
				</view>
			</view>
			<view class="medicine-title">
				{{noData?'没有更多了～':'正在加载'}}
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import moment from "moment";
	import fileApi from "@/libs/file-api.js";
	import _ from "lodash";

	export default {
		data() {
			return {
				refresherTriggered: false,
				dataList: {},
				pageSize: 50,
				pageIndex: 1,
				scrollH: 0,
				noData: false
			}
		},
		mounted() {
			this.mathScrollH();
			this.onLoad();
		},
		methods: {
			mathScrollH() {
				let systemInfo = uni.getSystemInfoSync();
				let scrollH = systemInfo.windowHeight - systemInfo.safeAreaInsets.bottom;
				this.scrollH = scrollH;
			},
			scrolltolower() {
				if (this.noData) {
					return;
				}
				this.pageIndex += 1;
				this.onLoad();
			},
			scrolltoupper() {
				this.refresherTriggered = true;
				this.pageIndex = 1;
				this.dataList = {};
				this.noData = false;
				this.onLoad();
			},
			onLoad() {
				uni.request({
					url: "/commodity-api/commodity/view-record/queryAll",
					method: "POST",
					header: {
						"content-type": "application/json;charset=utf-8"
					},
					data: {
						"isPage": true,
						"pageSize": this.pageSize,
						"pageIndex": this.pageIndex
					},
					success: (res) => {
						this.refresherTriggered = false;
						let dataList = _.cloneDeep(this.dataList);
						if (res.data.code == 0) {
							let resData = res.data.result.dataList;
							resData.forEach(item => {
								let commodities;
								let date = moment(item.viewTime).format("YYYY-MM-DD");
								if (dataList[date]) {
									commodities = dataList[date]
								} else {
									commodities = []
								}
								item.coverFileUrl = fileApi.gerPreviewUrl(item.coverFileId);
								commodities.push(item);
								dataList[date] = commodities;
							});
							if (res.data.result.total <= this.pageIndex * this.pageSize) {
								this.noData = true;
							}
						} else {
							this.noData = true;
						}
						this.dataList = dataList;
					},
					fail(err) {
						this.refresherTriggered = false;
						console.log(err)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.history-view {
		background: #fbfbfb;
		height: 100vh;
		padding: 0 2vw;

		.history-view-day {}

		.history-view-content {
			overflow: hidden;
			display: flex;
			flex-wrap: wrap;

		}

		.history-view-time {
			font-size: 28rpx;
			color: #999999;
			margin-left: 20rpx;
			height: 60rpx;
			line-height: 60rpx;
		}
	}

	.history-view-comodity {
		width: calc(32vw - 20rpx);
		margin: 10rpx;
		overflow: hidden;
		background: #fff;
		border-radius: 15rpx;
		box-shadow: 0 1px 6px rgba(0, 0, 0, .2);
		border-color: #eee;

		.history-view-comodity-img {
			width: 100%;
			height: calc(32vw - 20rpx);
		}

		.history-view-comodity-price {
			color: #FF922F;
			font-size: 32rpx;
			font-weight: 550;
			height: 60rpx;
			line-height: 50rpx;
			padding-left: 20rpx;

			text {
				font-size: 12px;
				margin-left: 2px;
				font-weight: 400;
			}
		}
	}
</style>