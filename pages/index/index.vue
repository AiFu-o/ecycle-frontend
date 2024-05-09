<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
			<text class="title">{{"主题"+cTheme}}</text>
		</view>
		<up-button text="修改主题" @click="cToggleTheme" >修改主题</up-button>
	</view>
</template>

<script>
	import themeMixin from '../../global/mixin/theme-mixin';
	export default {
		mixins: [themeMixin],
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {
		},
		methods: {

		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
