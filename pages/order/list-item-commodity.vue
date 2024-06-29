<template>
	<view class="order-commodity-item-container" :style="`min-height: ${layoutContainerH}px;`">
		<view class="content-container">
			<view class="top-bar-container">
				<view class="left-panel">{{generateStatusTitle(dataInfo.status)}}</view>
				<view class="right-panel">
					<view v-if="dataInfo.status == 'SELLING'">
						查看竞价
						<i class="jump-icon iconfont icon-youjiantou" @click="toBiddingList"></i>
					</view>
				</view>
			</view>
			<view class="info-container" @click="toCommodityParticular">
				<view class="img-container">
					<img class="img-comp" :src="dataInfo.coverFileUrl">
				</view>
				<view class="info-col-container">
					<view class="title-row">{{dataInfo.name}}</view>
					<view class="info-text-row">{{dataInfo.info}}</view>
					<view class="sub-info-row">{{"浏览"+dataInfo.pageViews}}</view>
				</view>
			</view>
			<view class="operation-container">
				<view class="left-panel"></view>
				<view class="right-panel">
					<view class="button-item">
						<up-button type="info" shape="circle" text="立即下架" @click="doStopCommodity"></up-button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {formatEnumToTitle2} from "@/libs/enum-format.js";
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
			}
		},
		mounted() {
		},
		methods: {
			generateStatusTitle(_status){
				return formatEnumToTitle2("CommodityStatus",_status,"未识别的状态！");
			},
			toBiddingList(){},
			doStopCommodity(){},
			toCommodityParticular(){
				if (!this.dataInfo.id) {
					return;
				}
				uni.navigateTo({
					url: `/pages/commodity/particular/index?cid=${this.dataInfo.id}`
				})
			},
		}
	}
	
</script>

<style lang="less">
	.order-commodity-item-container{
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
					.jump-icon{
						display: inline-block;
					}
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
						color: #828282;
						font-size: 24rpx;
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