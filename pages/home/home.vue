<template>
	<view>
		首页
		<circle-tab-bar currentPageName="home"></circle-tab-bar>
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
		methods: {

		}
	}
</script>

<style>

</style>