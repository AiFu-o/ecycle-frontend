<template>
	<view style="height:100%;">
		<scroll-view style="height:100%;" :enable-flex="true" scroll-y="true" @refresherrefresh="refreshAll" @scrolltolower="loadMoreData"
			:refresher-enabled="refresherEnabled" :refresher-triggered="refresherState" >
			<up-waterfall v-model="flowList" ref="common-commodity-list-waterfall" :add-time="50">
				<template v-slot:left="{leftList}">
					<view style="width:calc(48vw - 20rpx);">
						<commodityShowItem v-for="(item, index) in leftList" :key="index" :commodityInfo="item" ></commodityShowItem>
					</view>
				</template>
				<template v-slot:right="{rightList}">
					<view style="width:calc(48vw - 20rpx);">
						<commodityShowItem v-for="(item, index) in rightList" :key="index" :commodityInfo="item" ></commodityShowItem>
					</view>
				</template>
			</up-waterfall>
			<up-loadmore bg-color="rgb(240, 240, 240)" :status="loadStatus" @loadmore="loadData"></up-loadmore>
		</scroll-view>
	</view>
</template>

<script>
	import _ from "lodash";
	import commodityShowItem from "./list-item.vue";
	import fileApi from "@/libs/file-api.js";
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
				currentPageSize: 10,
				refresherEnabled: true,
				loadMoreEnabled: true,
				cloading: false,
				refresherState: false,
			}
		},
		methods:{
			refreshAll(){
				this.loadMoreEnabled = true;
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
				if (!this.loadMoreEnabled) {
					return;
				}
				this.currentPageIndex++;
				let queryConfig = {
					"statusList": ["SELLING"],
					"isPage": true,
					"pageIndex": this.currentPageIndex,
					"pageSize": this.currentPageSize,
					"input": ""
				};
				uni.request({
					url: "/commodity-api/commodity/pageQueryAll",
					method: "POST",
					data: queryConfig
				}).then((res)=>{
					let _data = res.data;
					if (_data.code == 0) {
						let result = _data.result;
						let newList = [];
						newList = _.concat([],result.dataList);
						_.forEach(newList,(item)=>{
							item.coverFileUrl = fileApi.gerPreviewUrl(item.coverFileId);
						});
						this.flowList = _.concat(this.flowList,newList);
						if (this.flowList.length >= result.total) {
							this.loadMoreEnabled = false;
						}
					}
					if (this.cloading) {
						this.cloading = false;
					}
				},(err)=>{
					if (this.cloading) {
						this.cloading = false;
					}
				})
				
				// setTimeout(()=>{
				// 	this.flowList = _.concat(this.flowList,[{title:"a"},{title:"b"},{title:"c"},{title:"d"},{title:"e"},{title:"f"},{title:"g"},{title:"h"}]);
				// 	console.log("change flowList:",this.flowList.length);
				// 	if (this.cloading) {
				// 		this.cloading = false;
				// 	}
				// },1000)
			},
		}
	}
</script>


<style>
</style>