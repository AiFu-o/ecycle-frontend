<template>
	<view style="height:100%;">
		<scroll-view style="height:100%;" scroll-y="true" @refresherrefresh="refreshAll" @scrolltolower="loadMoreData"
			:refresher-enabled="true" :refresher-triggered="cloading" @refresherrestore="refreshAllOver" >
			<up-waterfall v-model="flowList" ref="common-commodity-list-waterfall" :add-time="50">
				<template v-slot:left="{leftList}">
					<commodityShowItem v-for="(item, index) in leftList" :key="index" :commodityInfo="item" ></commodityShowItem>
				</template>
				<template v-slot:right="{rightList}">
					<commodityShowItem v-for="(item, index) in rightList" :key="index" :commodityInfo="item" ></commodityShowItem>
				</template>
			</up-waterfall>
			<up-loadmore bg-color="rgb(240, 240, 240)" :status="loadStatus" @loadmore="loadData"></up-loadmore>
		</scroll-view>
	</view>
</template>

<script>
	import _ from "lodash";
	import commodityShowItem from "./list-item.vue";
	export default {
		components:{
			commodityShowItem:commodityShowItem
		},
		props:{
			currentCategory:{
				type:String,
				default: function(){return "tuijian"}
			}
		},
		mounted() {
		},
		created() {
			this.currentPageIndex = 0;
			this.flowList = [];
			this.loadData();
		},
		data() {
			return {
				flowList:[],
				loadStatus: 'loadmore',
				currentPageIndex: 0,
				currentPageSize: 20,
				cloading: false,
			}
		},
		methods:{
			refreshAll(){
				this.cloading = true;
				this.currentPageIndex = 0;
				this.flowList = [];
				this.$refs["common-commodity-list-waterfall"]?this.$refs["common-commodity-list-waterfall"].clear():"";
				this.loadData();
			},
			loadMoreData(){
				this.loadData();
			},
			loadData(){
				this.currentPageIndex++;
				setTimeout(()=>{
					this.flowList = _.concat(this.flowList,[{title:"a"},{title:"b"},{title:"c"},{title:"d"},{title:"e"},{title:"f"},{title:"g"},{title:"h"}]);
					console.log("change flowList:",this.flowList.length);
					if (this.cloading) {
						this.cloading = false;
					}
				},1000)
			},
		}
	}
</script>


<style>
</style>