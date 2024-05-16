<template>
	<view class="commodity-item-container" :style="`height: ${layoutContainerH}px;`">
		<view class="content-container">{{commodityInfo.title}}</view>
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
			}
		},
		mounted() {
			this.layoutContainerH = 100 + (Math.round(Math.random()*10)-5)*8;
		},
		methods: {
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
			background-color: red;
		}
	}
</style>