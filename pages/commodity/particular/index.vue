<template>
	<view class="commodity-particular-container" :style="`height: ${layoutContainerH}px;padding-top: ${layoutContainerPaddingTop}px;`">
		<view class="top-bar-container" :style="`top: ${topBarAbsoluteTopH}px`">
			<view class="main-row-container" :style="`height: ${topBarBackRowH}px;`">
				<view class="back-icon-container">
					<i class="back-icon iconfont icon-back" @click="toBackPage"></i>
				</view>
			</view>
			<view class="category-tab-container" :style="`opacity: ${topBarCategoryOpacity};`">
				<view :class="[currentCategory=='商品'?'category-item-current':'category-item']">{{"商品"}}<view class="catrgory-item-current-underline"></view></view>
				<view :class="[currentCategory=='详情'?'category-item-current':'category-item']">{{"详情"}}<view class="catrgory-item-current-underline"></view></view>
				<view :class="[currentCategory=='推荐'?'category-item-current':'category-item']">{{"推荐"}}<view class="catrgory-item-current-underline"></view></view>
			</view>
		</view>
		<scroll-view class="particular-scroll-container" scroll-y="true">
			<view class="commodity-img-container" v-if="commodityImgList.length > 0">
				<up-swiper
					:list="commodityImgList"
					@change="e => img_currentNum = e.current"
					:autoplay="false"
					indicatorStyle="right: 20px"
					:circular="true"
					:height="cImgSwiperH"
				>
					<template #indicator>
						<view class="swiper-indicator-num-container">
							<text class="swiper-indicator-num-text">{{ img_currentNum + 1 }}/{{ commodityImgList.length }}</text>
						</view>
					</template>
				</up-swiper>
			</view>
			<view class="commodity-baseinfo-container">
				<view class="baseinfo-title">
					{{commodityInfo.name}}
				</view>
				<view class="baseinfo-location">
					<i class="location-icon iconfont icon-dingwei"></i>
					{{commodityInfo.location}}
				</view>
				<view class="baseinfo-label"></view>
			</view>
			<view class="commodity-seller-container">
				<view class="seller-layoutlable">卖家</view>
				<view class="seller-row-base">
					<view class="seller-img">
						<i v-if="!sellerInfo.profileImg" class="default-user-profile iconfont icon-morentouxiang"></i>
					</view>
					<view class="seller-info">
						<view class="seller-name">{{sellerInfo.name}}</view>
						<view class="seller-simple-info" v-if="false">
							{{sellerInfo.level+"级" + " | " + sellerInfo.concernsNumber + "关注"}}
						</view>
					</view>
					<view class="seller-operation">
						<!-- <view v-if="attentionState=='UN'" class="seller-button seller-button-un" @click="onAttentionConfirm">
							{{"+ 关注"}}
						</view>
						<view v-if="attentionState=='ED'" class="seller-button seller-button-ed" @click="onAttentionCancel">
							{{"已关注"}}
						</view> -->
					</view>
				</view>
				<view class="seller-row-estimate" v-if="false">
					<view class="row-quality">
						<text class="row-title">质量评价：</text><text class="row-value">{{sellerInfo.sellQuality}}</text>
					</view>
					<view class="row-split"></view>
					<view class="row-attitued">
						<text class="row-title">沟通态度：</text><text class="row-value">{{sellerInfo.serviceAttitude}}</text>
					</view>
				</view>
			</view>
			<view class="commodity-detail-container">
				{{commodityInfo.info}}
			</view>
			<view class="commodity-bidding-container">
				<view class="bidding-title">出价记录</view>
				<template v-if="biddingList.length > 0">
					<view style="margin-bottom: 10rpx;width: 100%;">
						<view style="width: 13vw;text-align: end;display: inline-block;">{{"排名"}}</view>
						<view style="margin-left:100rpx;display: inline-block;">{{"出价金额"}}</view>
					</view>
					<view v-for="(item,index) in biddingList" :key="'bidding-row-'+index" :class="['bidding-row',item.isMine?'bidding-row-ismine':'']">
						<view class="index-number" :style="{color:index>2?'#808080':biddingIndexNumberColor[index]}">{{index+1}}</view>
						<view class="bidding-number">{{item.commodityAmount}}</view>
						<view class="mybidding-check">{{item.isMine?"我的出价":""}}</view>
						<!-- <view class="mybidding-check">{{checkBiddingBelong(item)}}</view> -->
					</view>
				</template>
				<template v-else>
					<view class="bidding-none">
						{{"暂无出价"}}
					</view>
				</template>
			</view>
			<view class="commodity-tuijian-container"></view>
		</scroll-view>
		<view class="commodity-operation-container" :style="`bottom: ${bottomSafeAreaH}px;`">
			<view class="operation-left">
				<view class="operation-l-item">
					<i v-if="!isFavorite" class="unfavorite-icon iconfont icon-weishoucang" style="font-size: 30px;" @click="changeFavoriteState"></i>
					<i v-if="isFavorite" class="favorited-icon iconfont icon-yishoucang" style="font-size: 30px;" @click="changeFavoriteState"></i>
				</view>
			</view>
			<view class="operation-right">
				<view class="operation-r-item" v-if="commodityInfo.creatorId == currentUserId">
					<up-button ref="search-input-main" text="确认出价" color="#2db371" @click="toConfirmBiddingToOrder"></up-button>
				</view>
				<view v-else-if="commodityInfo.status == 'SELLING'" class="operation-r-item">
					<up-button ref="search-input-main" text="出价" color="#2db371" @click="onBidClick"></up-button>
				</view>
				<view v-else-if="commodityInfo.status == 'SOLD'" class="operation-r-item">
					<up-button ref="search-input-main" text="已售出" color="#b2acb0" @click="()=>{}"></up-button>
				</view>
				<view v-else-if="commodityInfo.status == 'OFF_SHELF'" class="operation-r-item">
					<up-button ref="search-input-main" text="已下架" color="#b2acb0" @click="()=>{}"></up-button>
				</view>
			</view>
		</view>
		<up-modal :show="isShowConfirmBiddingModal" title="确认出价" :closeOnClickOverlay="true" :showCancelButton="true" :holdKeyboard="true" confirmColor="#2db371" @confirm="onConfirmBiddingConfirm" @cancel="onConfirmBiddingCancel" @close="onConfirmBiddingOverlayClose">
			<view class="confirm-bidding-modal-content-container">
				<view class="topbar-container">
					{{"已选出价金额：" + (selectedBidding.id?selectedBidding.commodityAmount:"无")}}
				</view>
				<scroll-view class=".bidding-list-container" scroll-y="true">
					<view v-for="(item,index) in confirmBiddingList" :class="['bidding-row',(selectedBidding.id==item.id?'selected-bidding-row':'')]" :key="'confirm-bidding-'+index" @click="()=>{onConfirmBiddingSelectBidding(item)}">
						<view class="index-number" :style="{color:index>2?'#808080':biddingIndexNumberColor[index]}">{{index+1}}</view>
						<view class="bidding-number">{{item.commodityAmount}}</view>
					</view>
				</scroll-view>
			</view>
		</up-modal>
		<up-modal :show="isShowBiddingModal" title="出价" :closeOnClickOverlay="true" :showCancelButton="true" :holdKeyboard="true" confirmColor="#2db371" @confirm="onBiddingConfirm" @cancel="onBiddingCancel" @close="onBiddingOverlayClose">
			<view class="bidding-modal-content-container">
				<view class="now-row">{{"当前最高:"+(mostBidding > 0?(mostBidding+"元"):"无")}}</view>
				<view class="mine-row">{{"我的出价:"+(mineBidding > 0?(mineBidding+"元"):"无")}}</view>
				<view class="new-row">
					{{"新的出价"}}
					<up-input v-model="newBidding" placeholder="出价金额" :clearable="true" type="number">
					</up-input>
				</view>
			</view>
		</up-modal>
		<up-toast ref="errorMessage"></up-toast>
	</view>
</template>

<script>
	import _ from "lodash";
	import fileApi from "@/libs/file-api.js";
	export default {
		components: {
		},
		data() {
			return {
				layoutContainerH: 0,
				layoutContainerPaddingTop: 0,
				listContainerH: 0,
				topBarAbsoluteTopH: 0,
				topBarBackRowH: 40,
				topBarCategoryOpacity: 0,
				bottomSafeAreaH: 0,
				cImgSwiperH: 430,
				
				img_currentNum: 0,
				
				canBidding: false,
				isShowConfirmBiddingModal: false,
				confirmBiddingList: [],
				selectedBidding: {},
				
				biddingIndexNumberColor: ["#FF0000","#FF3300","#FF6600"],
				isShowBiddingModal: false,
				mostBidding: 0,
				mineBidding: 0,
				newBidding: 0,
				
				currentCategory: "商品",//商品、详情、推荐
				
				commodityInfoLoading: false,
				commodityId: "",
				commodityImgList:[
				],
				commodityInfo: {
					title: "",
					location: "",
					state: "",
				},
				biddingList: [],
				sellerInfo:{
					title: "焦先生",
					transactionNumber: "5000+",
					concernsNumber: "1000+",
					level: 3,
					sellQuality: 5,
					serviceAttitude: 5,
					profileImg: "lalala"
				},
				attentionState: "ED",//UN
				commodityParticular: {},
				isFavorite: false,
				favoriteId: "",
				currentUserId: "",
			}
		},
		onLoad: function (_option) {
			let userInfo = uni.getStorageSync("userInfo");
			this.currentUserId = userInfo.userId;
			this.commodityId = _option.cid;
			this.getCommodityDetail();
			this.getBiddingList();
			if (userInfo.roles.indexOf("admin") >= 0 || userInfo.roles.indexOf("provider") >= 0) {
				this.canBidding = true;
			} else {
				this.canBidding = false;
			}
		},
		mounted() {
			this.mathLayoutParam();
		},
		methods: {
			toConfirmBiddingToOrder(){
				let queryConfig = {
					"isPage": false,
					"pageIndex": 1,
					"pageSize": 10000,
					"input": ""
				};
				uni.request({
					url: `/commodity-api/bidding/queryAll/${this.commodityId}`,
					method: "POST",
					data:queryConfig
				}).then((res)=>{
					let _data = res.data;
					if (_data.code == 0) {
						let result = _data.result.dataList;
						this.confirmBiddingList = result;
						this.selectedBidding = {};
						this.isShowConfirmBiddingModal = true;
					}
				},(err)=>{
					console.log("查询出价记录报错",e);
				})
			},
			onConfirmBiddingConfirm(){
				if (!this.selectedBidding.id){
					this.isShowConfirmBiddingModal = false;
					return;
				}
				uni.request({
					url: `/commodity-api/bidding/sell/${this.selectedBidding.id}`,
					method: "PUT",
				}).then((res)=>{
					let _data = res.data;
					if (_data.code == 0) {
						this.getCommodityDetail();
						this.isShowConfirmBiddingModal = false;
					}
				},(err)=>{
					console.log("出价报错",e);
				})
			},
			onConfirmBiddingCancel(){
				this.isShowConfirmBiddingModal = false;
			},
			onConfirmBiddingOverlayClose(){
				this.isShowConfirmBiddingModal = false;
			},
			onConfirmBiddingSelectBidding(_bidding){
				this.selectedBidding = _.cloneDeep(_bidding);
			},
			showErrorMessage(_info="",_type="default",_position="center",_icon="",_jumpParam={},_loading="false",_duration=5000,_callback=()=>{}){
				let params = {
					message: _info,
					type: _type,
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
			onBidClick(){
				if (!this.canBidding) {
					this.showErrorMessage("请先成为回收商~");
					return;
				}
				let mostBidding = 0;
				let mineBidding = 0;
				_.forEach(this.biddingList,(item)=>{
					if (item.isMine) {
						mineBidding = item.commodityAmount;
					}
					mostBidding = mostBidding<item.commodityAmount?item.commodityAmount:mostBidding;
				});
				this.mostBidding = mostBidding;
				this.mineBidding = mineBidding;
				
				this.isShowBiddingModal = true;
				
			},
			onBiddingConfirm(){//DO BIDDING
				uni.request({
					url: `/commodity-api/bidding/create`,
					method: "POST",
					data:{
						commodityId: this.commodityId,
						commodityAmount: this.newBidding
					}
				}).then((res)=>{
					let _data = res.data;
					if (_data.code == 0) {
						this.isShowBiddingModal = false;
						this.getBiddingList();
					}
				},(err)=>{
					console.log("出价报错",e);
				})
			},
			onBiddingCancel(){
				this.isShowBiddingModal = false;
			},
			onBiddingOverlayClose(){
				this.isShowBiddingModal = false;
			},
			checkBiddingBelong(){
				return "";
			},
			mathLayoutParam(){
				let systemInfo = uni.getSystemInfoSync();
				let layoutContainerPaddingTop = systemInfo.statusBarHeight;
				let layoutContainerH = systemInfo.windowHeight - systemInfo.safeAreaInsets.bottom; //layoutContainerPaddingTop 是顶部要空出来的高度
				this.layoutContainerH = layoutContainerH;
				this.listContainerH = layoutContainerH;// - 30;//30是底部出价等操作栏的高度
				this.topBarAbsoluteTopH = systemInfo.statusBarHeight;
				this.bottomSafeAreaH = systemInfo.safeAreaInsets.bottom;
			},
			getBiddingList(){
				let queryConfig = {
					"isPage": true,
					"pageIndex": 1,
					"pageSize": 10,
					"input": ""
				};
				uni.request({
					url: `/commodity-api/bidding/queryAll/${this.commodityId}`,
					method: "POST",
					data:queryConfig
				}).then((res)=>{
					let _data = res.data;
					if (_data.code == 0) {
						let result = _data.result.dataList;
						_.forEach(result,(item)=>{
							item.isMine = (item.creatorId == this.currentUserId);
						})
						this.biddingList = result;
					}
				},(err)=>{
					console.log("查询出价记录报错",e);
				})
			},
			getCommodityDetail(){
				if (this.commodityInfoLoading) {
					return;
				}
				if (!this.commodityId) {
					return;
				}
				this.commodityInfoLoading = true;
				uni.request({
					url: `/commodity-api/commodity/load-info/${this.commodityId}`,
					method: "GET",
				}).then((res)=>{
					let _data = res.data;
					if (_data.code == 0) {
						let result = _data.result;
						let location = "";
						if (result?.address?.id) {
							let province = result.address?.province || "";
							let district = result.address?.district || "";
							let city = result.address?.city || "";
							let address = result.address?.address || "";
							let list = _.uniq([province,district,city,address]);
							location = _.join(list,"-");
						}
						result.location = location;
						this.commodityInfo = result;
						this.sellerInfo = {
							name: result.creatorName
						};
						if (this.commodityInfo.favoriteId && this.commodityInfo.favoriteId.length > 0) {
							this.isFavorite = true;
							this.favoriteId = "" + this.commodityInfo.favoriteId;
						} else {
							this.isFavorite = false;
							this.favoriteId = "";
						}
					}
					// if (this.commodityInfoLoading) {
					// 	this.commodityInfoLoading = false;
					// }
					if(!this.commodityInfo.belongId){
						return new Promise((resolve)=>{resolve({data:{}})});
					}
					return uni.request({
						url: `/storage-api/fileInfos?belongId=${this.commodityInfo.belongId}`,
						method: "GET",
					});
				},(err)=>{
					if (this.commodityInfoLoading) {
						this.commodityInfoLoading = false;
					}
				}).then((res2)=>{
					let _data = res2.data;
					if (_data.code == 0) {
						let result = _data.result;
						let listResult = [];
						_.forEach(result,(item)=>{
							listResult.push({
								url: fileApi.gerPreviewUrl(item.id),
								type: "image"
							});
						});
						this.commodityImgList = listResult;
					}
					if (this.commodityInfoLoading) {
						this.commodityInfoLoading = false;
					}
				},(err)=>{
					if (this.commodityInfoLoading) {
						this.commodityInfoLoading = false;
					}
				});
			},
			toBackPage(){
				uni.navigateBack();
			},
			changeFavoriteState(){
				if (this.isFavorite) {
					uni.request({
						url: `/commodity-api/favorite/cancel/{${this.commodityId}`,
						method: "PUT",
						data:queryConfig
					}).then((res)=>{
						let _data = res.data;
						if (_data.code == 0) {
							this.isFavorite = !this.isFavorite;
						}
					},(err)=>{
						console.log("取消收藏失败",e);
					})
				} else {
					uni.request({
						url: `/commodity-api/favorite/save/${this.commodityId}`,
						method: "POST",
					}).then((res)=>{
						let _data = res.data;
						if (_data.code == 0) {
							this.isFavorite = !this.isFavorite;
						}
					},(err)=>{
						console.log("收藏失败",e);
					})
				}
			},
			onAttentionConfirm(){
				this.attentionState = "ED";
				//TODO changeSellerAttentionConfirm
			},
			onAttentionCancel(){
				this.attentionState = "UN";
				//TODO changeSellerAttentionConfirm
			},
		}
	}
</script>

<style lang="less">
.commodity-particular-container{
	width: 100%;
	// padding-bottom: 100rpx;
	background-color: #f5f5f5;
	.top-bar-container{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 10000;
		.main-row-container{
			.back-icon-container{
				background-color: rgba(0,0,0,0.3);
				border-radius: 100rpx;
				height: 40px;
				width: 40px;
				line-height: 40px;
				.back-icon{
					display: inline-block;
					font-size: 50rpx;
					// color: #2db371;
					color: #fff;
					margin-left: 10rpx;
					margin-right: 15rpx;
				}
			}
		}
		.category-tab-container{
			height: 70rpx;
			display: flex;
			flex-direction: row;
			.category-item{
				flex: 1;
				font-weight: 400;
				text-align: center;
				.catrgory-item-current-underline{
					display: none;
				}
			}
			.category-item-current{
				flex: 1;
				font-weight: 700;
				text-align: center;
				.catrgory-item-current-underline{
					margin: 0 auto;
					width: 40%;
					height: 0rpx;
					border: 1px solid #2db371;
				}
			}
		}
	}
	.particular-scroll-container{
		height: calc(100% - 100rpx);
	}
	.commodity-img-container{
		height: 100vw;
		background-color: blue;
		.swiper-indicator-num-container{
			padding: 2rpx 20rpx;
			border-radius: 20rpx 0 0 20rpx;
			margin-right: -20px;
			background-color: rgba(0,0,0,0.3);
			.swiper-indicator-num-text{
				color: white;
			}
		}
	}
	.commodity-baseinfo-container{
		width: 100vw;
		padding: 20rpx;
		background-color: #fff;
		.baseinfo-title{
			min-height: 50rpx;
			font-size: x-large;
		}
		.baseinfo-location{
			display: flex;
			align-items: center;
			margin-top: 20rpx;
		}
	}
	.commodity-seller-container{
		width: 100vw;
		padding: 20rpx 20rpx 20rpx 20rpx;
		background-color: #fff;
		margin-top: 20rpx;
		.seller-row-base{
			display: flex;
			align-items: center;
			// flex-direction: column;
			// position: relative;
			width: calc(100% - 40rpx);
			.seller-img{
				width: 120rpx;
				height: 120rpx;
				// background-color: red;
				.default-user-profile{
					width: 120rpx;
					height: 120rpx;
					border-radius: 100%;
					// margin-left: 40rpx;
					border: 4rpx solid #e2e2e2;
					font-size: 70rpx;
					text-align: center;
					line-height: 100rpx;
					color: #8a8a8a;
				}
			}
			.seller-info{
				display: flex;
				flex-direction: column;
				flex: 1;
				margin-left: 20rpx;
				.seller-name{
					font-size: larger;
				}
				.seller-simple-info{
					color: #979598;
				}
			}
			.seller-operation{
				width: 120rpx;
				.seller-button{
					// position: absolute;
					// right: 60rpx;
					// top: calc(50% - 27rpx);
					border-radius: 20rpx;
					width: 120rpx;
					height: 54rpx;
					text-align: center;
					line-height: 54rpx;
				}
				.seller-button-un{
					background-color: #ff5100;
					color: #fff;
				}
				.seller-button-ed{
					background-color: #c9c1c4;
					color: #fff;
				}
			}
		}
		.seller-row-estimate{
			display: flex;
			margin-top: 40rpx;
			.row-quality{
				margin-left: 60rpx;
				flex: 2;
			}
			.row-attitued{
				flex: 2;
			}
			.row-split{
				flex: 1;
				// width: 5rpx;
				border-left: 1px solid #c9c1c4;
			}
			.row-title{
				color: #676668;
			}
			.row-value{
				color: #000;
			}
		}
		.seller-layoutlable{
			position: absolute;
			right: 10rpx;
			height: 10rpx;
			color: #2db371;
		}
	}
	.commodity-detail-container{
		// text-indent: 2em;
		padding: 30rpx;
		background-color: #fff;
		margin-top: 20rpx;
		min-height: 300rpx;
		white-space: pre-wrap; /* 保留换行符，允许正常的换行行为 */
		word-wrap: break-word; /* 在长单词或URL地址内部进行换行 */
	}
	.commodity-bidding-container{
		width: calc(100% - 100rpx);
		padding: 20rpx 50rpx;
		background-color: #fff;
		margin-top: 20rpx;
		display: flex;
		flex-direction: column;
		.bidding-title {
			font-weight: bold;
			margin-bottom: 20rpx;
		}
		.bidding-row{
			display: flex;
			margin-bottom: 10rpx;
			width: 100%;
			.index-number{
				width: 10vw;
				text-align: end;
			}
			.mybidding-check{
				// color: #ffffff;
				width: 30vw;
				text-align: start;
			}
			.bidding-number{
				flex: 1;
				text-align: center;
			}
		}
		.bidding-row-ismine{
			background-color: #ececec;
			border-radius: 10rpx;
			box-shadow: 0 0 14rpx -6rpx #000;
		}
		.bidding-none{
			
		}
	}
	.commodity-tuijian-container{}
	.commodity-operation-container{
		position: absolute;
		height: 100rpx;
		width: 100%;
		// background-color: red;
		border-top: 1px solid rgb(221, 221, 221);
		display: flex;
		.operation-left{
			flex: 1;
			display: flex;
			// padding-left: 40rpx;	
			justify-content: space-around;
			.operation-l-item{
				font-size: 30px;
				height: 100%;
				width: 30px;
				line-height: 100rpx;
			}
			.favorited-icon{
				color: #ffcf00;
			}
		}
		.operation-right{
			width: 40vw;
			.operation-r-item{
				height: 100rpx;
				.u-button--square{
					height: 100rpx;
				}
			}
		}
	}
	.bidding-modal-content-container{
		display: flex;
		.topbar-container {
			height: 50rpx;
		}
		.bidding-list-container{
			flex: 1;
			overflow: auto;
			.bidding-row{
				display: flex;
				margin-bottom: 10rpx;
				width: 100%;
				// padding-right: 30vw;
				.index-number{
					width: 10vw;
					text-align: end;
				}
				.bidding-number{
					flex: 1;
					text-align: center;
				}
				.action-button{
					width: 30vw;
					text-align: cente;
				}
			}
			.selected-bidding-row{
				background-color: #ececec;
				border-radius: 10rpx;
				box-shadow: 0 0 14rpx -6rpx #000;
			}
		}
	}
	.confirm-bidding-modal-content-container{
		.topbar-container{
			
		}
		.bidding-list-container{
			flex: 1;
			overflow: auto;
			.bidding-row{
				display: flex;
				margin-bottom: 10rpx;
				width: 100%;
				// padding-right: 30vw;
				.index-number{
					width: 10vw;
					text-align: end;
				}
				.bidding-number{
					flex: 1;
					text-align: center;
				}
				.action-button{
					width: 30vw;
					text-align: cente;
				}
			}
			.selected-bidding-row{
				background-color: #ececec;
				border-radius: 10rpx;
				box-shadow: 0 0 14rpx -6rpx #000;
			}
		}
	}
}
</style>