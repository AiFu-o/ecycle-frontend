<template>
	<view :style="`height: ${layoutContainerH}px;`">
		<view v-if="!addressList || addressList.length < 1" class="no-address">
			<view class="no-address-text">
				还没有地址哦～
			</view>
			<up-button style="width:80%" type="primary" text="添加地址" @click="createAddress"></up-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				addressList: [],
				layoutContainerH: 0,
			}
		},
		mounted() {
			this.mathLayoutParam();
			this.onLoad();
		},
		methods: {
			createAddress() {
				uni.navigateTo({
					url:"/pages/address/edit"
				})
			},
			mathLayoutParam() {
				let systemInfo = uni.getSystemInfoSync();
				let layoutContainerPaddingTop = systemInfo.statusBarHeight;
				let layoutContainerH = systemInfo.windowHeight - systemInfo.safeAreaInsets.bottom -
					layoutContainerPaddingTop; //layoutContainerPaddingTop 是顶部要空出来的高度，52是固定的，底部tabbar的高度
				this.layoutContainerH = layoutContainerH;
				// this.layoutContainerPaddingTop = layoutContainerPaddingTop;
			},
			onLoad() {
				uni.request({
					url: "/commodity-api/address/queryMineAll",
					method: "GET",
				})
			}
		}
	}
</script>

<style lang="scss">
	.no-address {
		display: flex;
		text-align: center;
		justify-content: center;
		flex-direction: column;
		height: 100%;
	}
</style>