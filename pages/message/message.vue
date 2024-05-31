<template>
	<view class="message">
		<scroll-view style="height:100%;" scroll-y="true" @refresherrefresh="refreshAll" @scrolltolower="loadMoreData"
			:refresher-enabled="true" :refresher-triggered="cloading" @refresherrestore="refreshAllOver">
			<uni-swipe-action>
				<uni-swipe-action-item :right-options="options" @click="swipeClick(item.id ,index)"
					v-for="(item, index) in messageList" :key="item.id">
					<view class="message-item" @click="doRead(item)">
						<view class="message-item-icon">
							<image :src="(getCoverUrl(item.coverId))"></image>
						</view>
						<view class="message-item-content">
							<view class="message-item-title">
								{{type[item.type]}}
							</view>
							<view class="message-item-info">
								{{item.content}}
							</view>
							<view class="message-item-time">
								{{getDateFormat(item.createTime)}}
							</view>
						</view>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>
		</scroll-view>
		<circle-tab-bar currentPageName="message"></circle-tab-bar>
	</view>
</template>

<script>
	import circleTabBar from "@/components/tab-bar/index.vue";
	import fileApi from "../../libs/file-api.js";
	import moment from "moment";
	import _ from "lodash";

	export default {
		components: {
			circleTabBar
		},
		data() {
			return {
				type: {
					BOUGHT: "商品被拍下",
					QUOTE: "报价提醒"
				},
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				messageList: [],
				loadStatus: 'loadmore',
				currentPageIndex: 0,
				currentPageSize: 20,
				cloading: false,
			}
		},
		mounted() {
			this.loadData();
		},
		methods: {
			doRead(item) {
				if (item.isRead) {
					return
				}
				uni.request({
					url: `/message-api/notification/read/${item.id}`,
					method: "PUT"
				})
			},
			getCoverUrl(coverId) {
				if (coverId) {
					return fileApi.gerPreviewUrl(coverId);
				}
				return "../../static/message/message-default.png";
			},
			getDateFormat(date) {
				return moment(date).format("YYYY-MM-DD");
			},
			swipeClick(id, index) {
				uni.request({
					url: `/message-api/notification/del/${id}`,
					method: "DELETE"
				}).then(res => {
					let messageList = _.cloneDeep(this.messageList);
					if (res && res.statusCode == 200) {
						if (res.data.code == 0) {
							messageList.splice(index, 1);
							this.messageList = messageList;
						}
					}
				})
			},
			refreshAllOver() {

			},
			refreshAll() {
				this.cloading = true;
				this.currentPageIndex = 0;
				this.loadData();
			},
			loadMoreData() {
				this.loadData();
			},
			loadData() {
				this.currentPageIndex++;
				uni.request({
					url: "/message-api/notification/queryMineAll",
					method: "POST",
					data: {
						isPage: true,
						pageIndex: this.currentPageIndex,
						pageSize: this.currentPageSize
					}
				}).then(res => {
					let messageList = _.cloneDeep(this.messageList);
					if (res && res.statusCode == 200) {
						const data = res.data;
						if (data.code == 0) {
							messageList.push(...data.result.dataList);
						} else {
							uni.$u.toast("获取数据失败," + data.msg);
						}
					} else {
						uni.$u.toast("获取数据失败");
					}
					this.messageList = messageList;
					this.cloading = false;
				}).catch(e => {
					console.error(e);
					uni.$u.toast("获取数据失败");
					this.cloading = false;
				})
			},
		}
	}
</script>

<style lang="less">
	.message {
		height: calc(100vh - 154rpx);
	}

	.message-item {
		display: flex;
		gap: 30rpx;

		.message-item-icon {
			height: 148rpx;
			padding-top: 20rpx;
			margin-left: 30rpx;
			box-sizing: border-box;

			image {
				width: 90rpx;
				height: 90rpx;
			}
		}

		.message-item-content {
			flex: 1;
			border-bottom: 1px solid #eaeaea;
			padding: 20rpx;
			padding-left: 0;
			overflow: hidden;
			color: #8a8a8a;

			.message-item-title {
				color: #222222;
				font-size: 32rpx;
				font-weight: 550;
				overflow: hidden;
				white-space: normal;
				text-overflow: ellipsis;
				height: 36rpx;
				line-height: 36rpx;
			}

			.message-item-info {
				font-size: 28rpx;
				overflow: hidden;
				white-space: normal;
				text-overflow: ellipsis;
				height: 36rpx;
				line-height: 36rpx;
				padding: 6rpx 0;
			}

			.message-item-time {
				font-size: 20rpx;
				height: 24rpx;
				line-height: 24rpx;
			}
		}
	}
</style>