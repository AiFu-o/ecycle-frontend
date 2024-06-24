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
			<view class="commodity-img-container">
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
					{{commodityInfo.title}}
				</view>
				<view class="baseinfo-location">
					<i class="location-icon iconfont icon-dingwei"></i>
					{{commodityInfo.location}}
				</view>
				<view class="baseinfo-label"></view>
			</view>
			<view class="commodity-seller-container">
				<view class="seller-row-base">
					<view v-if="sellerInfo.profileImg" class="seller-img">
						
					</view>
					<view class="seller-info">
						<view class="seller-name">{{sellerInfo.title}}</view>
						<view class="seller-simple-info">
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
				<view class="seller-row-estimate">
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
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
				<view>产品详情待完善</view>
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
				<view class="operation-r-item">
					<up-button v-if="commodityInfo.state=='ING'" ref="search-input-main" text="出价" color="#2db371" @click="onBidClick"></up-button>
				</view>
				<view class="operation-r-item">
					<up-button v-if="commodityInfo.state=='ED'" ref="search-input-main" text="已售出" color="#2db371" @click="onBidClick"></up-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import _ from "lodash";
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
				
				currentCategory: "商品",//商品、详情、推荐
				
				commodityId: "",
				commodityImgList:[
					{
						url:"/static/imgdemo/a1.jpeg",
						type: 'image'
					},
					{
						url:"/static/imgdemo/a2.jpeg",
						type: 'image'
					},
				],
				commodityInfo: {
					title: "商品名称",
					location: "北京市大兴区西环中路6号",
					state: "ING",//ED
				},
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
			}
		},
		onLoad: function (_option) {
			this.commodityId = _option.cid;
			this.getCommodityDetail();
		},
		mounted() {
			this.mathLayoutParam();
		},
		methods: {
			mathLayoutParam(){
				let systemInfo = uni.getSystemInfoSync();
				let layoutContainerPaddingTop = systemInfo.statusBarHeight;
				let layoutContainerH = systemInfo.windowHeight - systemInfo.safeAreaInsets.bottom; //layoutContainerPaddingTop 是顶部要空出来的高度
				this.layoutContainerH = layoutContainerH;
				this.listContainerH = layoutContainerH;// - 30;//30是底部出价等操作栏的高度
				this.topBarAbsoluteTopH = systemInfo.statusBarHeight;
				this.bottomSafeAreaH = systemInfo.safeAreaInsets.bottom;
			},
			getCommodityDetail(){
				//TODO 查询商品详情
			},
			toBackPage(){
				uni.navigateBack();
			},
			changeFavoriteState(){
				this.isFavorite = !this.isFavorite;
				//TODO changeFavoriteState
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
		padding: 40rpx 20rpx 20rpx 20rpx;
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
				background-color: red;
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
	}
	.commodity-detail-container{
		background-color: #fff;
		margin-top: 20rpx;
		min-height: 300rpx;
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
}
</style>