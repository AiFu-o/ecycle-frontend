<template>
	<view style="height:100%;">
		<scroll-view style="height:100%;" scroll-y="true" @refresherrefresh="refreshAll" @scrolltolower="loadMoreData"
			:refresher-enabled="refresherEnabled" :refresher-triggered="refresherState" >
			<template v-if="showType=='commodity'">
				<commodityShowItem v-for="(item, index) in flowList" :key="index" :dataInfo="item" ></commodityShowItem>
			</template>
			<template v-if="showType=='order'">
				<orderShowItem v-for="(item, index) in flowList" :key="index" :dataInfo="item" ></orderShowItem>
			</template>
			<template v-if="showType=='bidding'">
				<biddingShowItem  v-for="(item, index) in flowList" :key="index" :dataInfo="item" ></biddingShowItem>
			</template>
			<up-loadmore bg-color="rgb(240, 240, 240)" :status="loadStatus" @loadmore="loadData"></up-loadmore>
		</scroll-view>
		<up-toast ref="errorMessage"></up-toast>
	</view>
</template>

<script>
	import _ from "lodash";
	import commodityShowItem from "./list-item-commodity.vue";
	import orderShowItem from "./list-item-order.vue";
	import biddingShowItem from "./list-item-bidding.vue";
	import fileApi from "@/libs/file-api.js";
	export default {
		components:{
			orderShowItem,biddingShowItem,commodityShowItem
		},
		props:{
			currentCategory: {
				type:String,
			},
		},
		watch:{
			"currentCategory": function(){
				this.refreshAll();
			},
			"loadMoreEnable": function(val){
				if (val) {
					this.loadStatus = "loadmore";
				} else {
					this.loadStatus = "nomore";
				}
			},
		},
		mounted() {
			this.loadData();
		},
		created() {
			this.currentPageIndex = 0;
			this.flowList = [];
		},
		data() {
			return {
				flowList:[],
				showType: "commodity",
				loadStatus: 'loadmore',
				currentPageIndex: 0,
				currentPageSize: 10,
				loadMoreEnable: true,
				cloading: false,
				refresherState: false,
				refresherEnabled: true,
			}
		},
		methods:{
			showErrorMessage(_info="",_type="default",_position="center",_icon="",_jumpParam={},_loading="false",_duration=5000,_callback=()=>{}){
				let params = {
					message: _info,
					type: "error",
					position: _position,
					icon: _icon,
					params: _jumpParam,
					loading: _loading,
					duration: _duration,
					complete: _callback,
				};
				this.$refs.errorMessage.show({
					...params
				});
			},
			refreshAll(){
				this.loadMoreEnable = true;
				this.currentPageIndex = 0;
				this.flowList = [];
				this.loadData();
			},
			refreshAllOver(){},
			loadMoreData(){
				this.loadData();
			},
			loadData(){
				if (!this.loadMoreEnable) {
					return;
				}
				if (this.cloading) {
					return;
				}
				this.cloading = true;
				this.currentPageIndex++;
				let queryConfig = {
					"isPage": true,
					"pageIndex": this.currentPageIndex,
					"pageSize": this.currentPageSize,
					"input": ""
				};
				switch(this.currentCategory){
					case "ing-mai":
						this.showType = "commodity";
						this.queryMaiCommodity();
						break;
					case "down-mai":
						this.showType = "order";
						this.queryMaiOrder();
						break;
					case "ing-hui":
						this.showType = "order";
						this.queryHuiOrderIng();
						break;
					case "down-hui":
						this.showType = "order";
						this.queryHuiOrderEd();
						break;
					case "ing-cj":
						this.showType = "bidding";
						this.queryHuiBiddingIng();
						break;
					case "down-cj":
						this.showType = "bidding";
						this.queryHuiBiddingEd();
						break;
					default:
						this.showErrorMessage("不识别的数据请求类型！");
						console.error("不识别的数据请求类型:"+this.currentCategory);
						this.cloading = false;
						break;
				}
				
				// uni.request({
				// 	url: "/commodity-api/commodity/queryCommodityCategoryAll",
				// 	method: "GET",
				// 	// data: queryConfig
				// }).then((res)=>{
				// 	let _data = res.data;
				// 	if (_data.code == 0) {
				// 		let result = _data.result;
				// 		let newList = [];
				// 		newList = _.concat([],result.dataList);
				// 		this.flowList = _.concat(this.flowList,newList);
				// 		if (this.flowList.length >= result.total) {
				// 			this.refresherEnabled = false;
				// 		}
				// 	}
				// 	if (this.cloading) {
				// 		this.cloading = false;
				// 	}
				// },(err)=>{
				// 	if (this.cloading) {
				// 		this.cloading = false;
				// 	}
				// })
			},
			queryMaiCommodity(){
				let queryConfig = {
					"statusList": ["SELLING"],
					"isPage": true,
					"pageIndex": this.currentPageIndex,
					"pageSize": this.currentPageSize,
					"input": ""
				};
				uni.request({
					url: "/commodity-api/commodity/pageQueryMineAll",
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
							this.loadMoreEnable = false;
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
			},
			queryMaiOrder(){
				let queryConfig = {
					"isPage": true,
					"pageIndex": this.currentPageIndex,
					"pageSize": this.currentPageSize,
					"input": ""
				};
				uni.request({
					url: "/commodity-api/order/queryBySeller",
					method: "POST",
					data: queryConfig
				}).then((res)=>{
					let _data = res.data;
					if (_data.code == 0) {
						let result = _data.result;
						let newList = [];
						_.forEach(newList,(item)=>{
							item.coverFileUrl = fileApi.gerPreviewUrl(item.coverFileId);
						});
						this.flowList = _.concat(this.flowList,newList);
						if (this.flowList.length >= result.total) {
							this.loadMoreEnable = false;
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
			},
			queryHuiOrderIng(){
				let queryConfig = {
					"isPage": true,
					"pageIndex": this.currentPageIndex,
					"pageSize": this.currentPageSize,
					"input": ""
				};
				uni.request({
					url: "/commodity-api/order/queryMineAll",
					method: "POST",
					data: queryConfig
				}).then((res)=>{
					let _data = res.data;
					if (_data.code == 0) {
						let result = _data.result;
						let newList = [];
						_.forEach(newList,(item)=>{
							item.coverFileUrl = fileApi.gerPreviewUrl(item.coverFileId);
						});
						this.flowList = _.concat(this.flowList,newList);
						if (this.flowList.length >= result.total) {
							this.loadMoreEnable = false;
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
			},
			queryHuiOrderEd(){
				let queryConfig = {
					"isPage": true,
					"pageIndex": this.currentPageIndex,
					"pageSize": this.currentPageSize,
					"input": ""
				};
				uni.request({
					url: "/commodity-api/order/queryMineAll",
					method: "POST",
					data: queryConfig
				}).then((res)=>{
					let _data = res.data;
					if (_data.code == 0) {
						let result = _data.result;
						let newList = [];
						_.forEach(newList,(item)=>{
							item.coverFileUrl = fileApi.gerPreviewUrl(item.coverFileId);
						});
						this.flowList = _.concat(this.flowList,newList);
						if (this.flowList.length >= result.total) {
							this.loadMoreEnable = false;
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
			},
			queryHuiBiddingIng(){
				let queryConfig = {
					"isPage": true,
					"pageIndex": this.currentPageIndex,
					"pageSize": this.currentPageSize,
					"input": ""
				};
				uni.request({
					url: "/commodity-api/bidding/queryMineAll",
					method: "POST",
					data: queryConfig
				}).then((res)=>{
					let _data = res.data;
					if (_data.code == 0) {
						let result = _data.result;
						let newList = [];
						_.forEach(newList,(item)=>{
							item.coverFileUrl = fileApi.gerPreviewUrl(item.coverFileId);
						});
						this.flowList = _.concat(this.flowList,newList);
						if (this.flowList.length >= result.total) {
							this.loadMoreEnable = false;
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
			},
			queryHuiBiddingEd(){
				let queryConfig = {
					"isPage": true,
					"pageIndex": this.currentPageIndex,
					"pageSize": this.currentPageSize,
					"input": ""
				};
				uni.request({
					url: "/commodity-api/bidding/queryMineAll",
					method: "POST",
					data: queryConfig
				}).then((res)=>{
					let _data = res.data;
					if (_data.code == 0) {
						let result = _data.result;
						let newList = [];
						newList = _.concat([{id:"asd",status:"SUCCESS",billCode:"SDAS1231542131",coverFileUrl:"asd",commodityName:"萨达撒",commodityInfo:"阿斯达撒多撒",commodityAmount:100.34}],result.dataList);
						// _.forEach(newList,(item)=>{
						// 	item.coverFileUrl = fileApi.gerPreviewUrl(item.coverFileId);
						// });
						this.flowList = _.concat(this.flowList,newList);
						if (this.flowList.length >= result.total) {
							this.loadMoreEnable = false;
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
			},
		}
	}
</script>


<style>
</style>