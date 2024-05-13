<template>
	<view>
		订单
		<circle-tab-bar currentPageName="order"></circle-tab-bar>
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

			}
		},
		mounted() {
			this.test();
		},
		methods: {
			test() {
				uni.request({
					url: "/commodity-api/commodity/queryCommodityCategoryAll",
					method: "GET",
					success: (res) => {
						console.log(res)
					}
				})
			}
		}
	}
</script>

<style lang="scss">

</style>