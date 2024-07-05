<template>
	<view class="order-order-item-container" :style="`min-height: ${layoutContainerH}px;`">
		<view class="content-container" @click="toOrderParticular">
			<view class="top-bar-container">
				<view class="left-panel">{{generateStatusTitle(dataInfo.status)}}</view>
				<view class="right-panel">
					<view>
						{{dataInfo.billCode}}
					</view>
				</view>
			</view>
			<view class="info-container">
				<view class="img-container">
					<img class="img-comp" :src="dataInfo.coverFileUrl">
				</view>
				<view class="info-col-container">
					<view class="title-row">{{dataInfo.commodityName}}</view>
					<view class="info-text-row">{{dataInfo.commodityInfo}}</view>
					<!-- <view class="sub-info-row">{{"成交：￥" + dataInfo.commodityAmount}}</view> -->
				</view>
				<view class="transaction-price-container">
					<text class="icon-c">{{"￥"}}</text>
					<text class="number-c">{{dataInfo.commodityAmount}}</text>
				</view>
			</view>
			<view class="operation-container">
				<view class="left-panel"></view>
				<view class="right-panel">
					<view class="button-item">
						<up-button v-if="(authLevel%2) == 0" shape="circle" text="联系买家" @click="doConnectHui"></up-button>
					</view>
					<view class="button-item">
						<up-button v-if="(authLevel%3) == 0" shape="circle" text="联系卖家" @click="doConnectMai"></up-button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {formatEnumToTitle} from "@/libs/enum-format.js";
	export default {
		components: {
		},
		props:{
			dataInfo:{
				type: Object,
				required: true,
			}
		},
		data() {
			return {
				layoutContainerH: 100,
				authLevel: 0,
			}
		},
		onLoad() {
			let userInfo = uni.getStorageSync("userInfo");
			let newTabList = [];
			if (userInfo.roles.indexOf("admin") >= 0) {
				this.authLevel = 6;
			} else {
				if (userInfo.roles.indexOf("normalUser") >= 0) {
					this.authLevel = 2;
				}
				if (userInfo.roles.indexOf("provider") >= 0) {//这是回收商
					this.authLevel = 3;
				}				
			}
		},
		mounted() {
		},
		methods: {
			generateStatusTitle(_status){
				return formatEnumToTitle("OrderStatus",_status,"未识别的状态！");
			},
			doConnectHui(){},
			doConnectMai(){},
			toCommodityParticular(){
				if (!this.dataInfo.commodityId) {
					return;
				}
				uni.navigateTo({
					url: `/pages/commodity/particular/index?cid=${this.dataInfo.commodityId}`
				})
			},
			toOrderParticular(){
				if (!this.dataInfo.id) {
					return;
				}
				uni.navigateTo({
					url: `/pages/order/particular/index?cid=${this.dataInfo.id}`
				})
			},
		}
	}
	
</script>

<style lang="less">
	.order-order-item-container{
		padding: 10rpx 20rpx;
		background-color: #fff;
		border-radius: 20rpx;
		margin: 14rpx 6rpx;
		.content-container{
			height: 100%;
			width: 100%;
			.top-bar-container{
				height: 60rpx;
				line-height: 60rpx;
				display: flex;
				justify-content: space-between;
				.left-panel{
					color: #0c0c0c;
				}
				.right-panel{
					color: #b2b2b2;
					text-align: right;
					font-size: 24rpx;
				} 
			}
			.info-container{
				height: 150rpx;
				display: flex;
				.img-container{
					width: 150rpx;
					position: relative;
					margin-right: 20rpx;
					.img-comp{
						width: 100%;
						height: 100%;
					}
				}
				.info-col-container{
					flex: 1;
					display: flex;
					flex-direction: column;
					.title-row{
						font-size: 30rpx;
					}
					.info-text-row{
						flex: 1;
						font-size: 28rpx;
						max-height: 80rpx;
						overflow: hidden;
					}
					.sub-info-row{
						color: #f3202e;
						font-size: 28rpx;
					}
				}
				.transaction-price-container{
					color: #f3202e;
					.icon-c{
						font-size: 24rpx;
						font-weight: bold;
					}
					.number-c{
						font-size: 30rpx;
						font-weight: bold;
					}
				}
			}
			.operation-container{
				height: 80rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.left-panel{
				}
				.right-panel{
					.button-item{
						display: inline-block;
						width: 160rpx;
					}
				} 
			}
		}
	}
</style>