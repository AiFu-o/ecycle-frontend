<template>
	<view>
		<view class="commodity-edit-desc">
			<input placeholder-class="commodity-edit-desc-input-placeholder" class="commodity-edit-desc-input" type="text" focus
				placeholder="请尽量将商品信息描述清晰,以便于回收商估价,详细的商品描述更容易获得高报价" />
		</view>
	</view>
</template>

<script>
</script>

<style>
	.commodity-edit-desc-input .uni-input-wrapper{
		justify-content: flex-start !important;
		color: red;
	}
	.commodity-edit-desc-input{
		height: 200rpx;
	}
	.commodity-edit-desc-input-placeholder{
		white-space: normal;
	}
</style>