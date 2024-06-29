<template>
	<view class="commodity-item-container" :style="`min-height: ${layoutContainerH}px;`" @click="onCommodityItemClick">
		<view class="content-container">
			<view class="img-location">
				<image class="img-comp" :src="commodityInfo.coverFileUrl" mode="widthFix" lazy-load/>
			</view>
			<view class="name-view">
				{{commodityInfo.name}}
			</view>
			<view class="info-view">
				{{commodityInfo.info}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {
		},
		props:{
			commodityInfo:{
				type: Object,
				required: true,
			}
		},
		data() {
			return {
				layoutContainerH: 100,
				
				currentCommodityId:"",
			}
		},
		mounted() {
		},
		methods: {
			onCommodityItemClick(){
				this.currentCommodityId = this.commodityInfo.id || "";
				uni.navigateTo({
					url: `/pages/commodity/particular/index?cid=${this.currentCommodityId}`
				})
			},
		}
	}
	
</script>

<style lang="less">
	.commodity-item-container{
		padding: 5rpx 5rpx;
		background-color: #fff;
		border-radius: 20rpx;
		margin: 14rpx 6rpx;
		.content-container{
			height: 100%;
			width: 100%;
			// background-color: red;
			display: flex;
			flex-direction: column;
			// padding: ;
			.img-location{
				min-height: 100rpx;
				width: 100%;
				.img-comp{
					width: 100%;
				}
			}
			.name-view{
				padding: 0 10rpx;
				line-height: 40rpx;
				font-weight: bold;
			}
			.info-view{
				padding: 0 10rpx;
				line-height: 30rpx;
				font-size: 24rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
	}
</style>