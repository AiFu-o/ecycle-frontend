<template>
	<view class="order-detail-container" :style="`height: ${layoutContainerH}px;`">
		<view class="order-top-bar" @click="onSearchRowClick">
			<i class="back-icon iconfont icon-back" @click="toBackPage"></i>
			<view class="title-layout">订单详情</view>
		</view>
		<scroll-view class="particular-scroll-container" :style="`height: ${listContainerH}px;`" scroll-y="true">
			<view class="status-row">{{"订单状态：" + generateStatusTitle(orderInfo.status)}}</view>
			<view class="commodity-container" v-if="orderInfo.commodity">
				<view class="img-container" v-if="orderInfo.commodity.coverFileUrl">
					<img class="img-comp" :src="orderInfo.commodity.coverFileUrl">
				</view>
				<view class="info-col-container">
					<view class="title-row">{{orderInfo.commodity.name}}</view>
					<view class="info-text-row">{{orderInfo.commodity.info}}</view>
				</view>
			</view>
			<view class="bidding-row">
				<view>{{"最终定价"}}</view>
				<view style="color:#f3202e;font-weight: bold;"><text style="font-size: 22rpx;">￥</text>{{orderInfo.commodityAmount}}</view>
			</view>
			<view class="info-row">
				<view style="font-weight: bold;">{{"订单编号"}}</view>
				<view style="color:#757575;font-size: 22rpx;" >
					{{orderInfo.billCode}}
					<view class="button-item">
						<up-button shape="circle" size="mini" text="复制" @click="copyOrderBillCode"></up-button>
					</view>
				</view>
			</view>
			<view class="operation-container">
				<view class="pay-service-charge" v-if="orderInfo.status == 'PENDING_PAYMENT'">
					<view class="amount-container">
						<view>{{"待支付服务费"}}</view>
						<view style="color:#f3202e;font-weight: bold;"><text style="font-size: 22rpx;">￥</text>{{orderInfo.serviceChargeReceivable}}</view>
					</view>
					<view class="button-item">
						<up-button shape="circle" :loading="payLoading" :plain="false" iconColor="#fff" color="#2db371" loadingText="支付中" text="去支付" @click="payServiceCharge"></up-button>
					</view>
				</view>
				<view class="commodity-location" v-if="orderInfo.status != 'PENDING_PAYMENT' && orderInfo.status != 'PAYMENT_ERROR' && orderInfo.status != 'REFUNDED' && orderInfo.status != 'CLOSED'">
					<view class="row-con">
						<view>{{"联系方式"}}</view>
						<view>
							{{(orderInfo?.address?.phone || "无")}}
							<view style="display: inline-block;">
								<i class="iconfont icon-lianxiwomen" @click="callPhone"></i>
							</view>
						</view>
					</view>
					<view style="margin-top: 40rpx;margin-bottom: 20rpx;">{{"具体位置"}}</view>
					<view><text style="font-weight: bold;">{{orderInfo.location}}</text></view>
					<view style="margin-top: 40rpx;" v-if="orderInfo.status == 'PENDING_VISIT'">
						<up-button shape="circle" :loading="arrivedLoading" :plain="false" iconColor="#fff" color="#2db371" text="已到达" @click="onHaveArrived"></up-button>
					</view>
					<view style="margin-top: 40rpx;" v-if="orderInfo.status == 'VISITED'">
						<up-button shape="circle" :loading="completedLoading" :plain="false" iconColor="#fff" color="#2db371" text="已完成" @click="onHaveCompleted"></up-button>
					</view>
				</view>
			</view>
		</scroll-view>
		<up-toast ref="commonMessage"></up-toast>
	</view>
</template>

<script>
	import _ from "lodash";
	import {formatEnumToTitle} from "@/libs/enum-format.js";
	import fileApi from "@/libs/file-api.js";
	export default {
		components: {
		},
		data() {
			return {
				layoutContainerH: 0,
				layoutContainerPaddingTop: 0,
				listContainerH: 0,
				
				orderId: "",
				dataInfoLoading: false,
				orderInfo: {},
				
				arrivedLoading: false,
				completedLoading: false,
			}
		},
		onLoad: function (_option) {
			this.orderId = _option.cid;
			this.loadOrderData();
		},
		mounted() {
			this.mathLayoutParam();
		},
		methods: {
			generateStatusTitle(_status){
				return formatEnumToTitle("OrderStatus",_status,"未识别的状态！");
			},
			loadOrderData(){
				if (this.dataInfoLoading) {
					return;
				}
				if (!this.orderId) {
					return;
				}
				this.dataInfoLoading = true;
				uni.request({
					url: `/commodity-api/order/loadInfo/${this.orderId}`,
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
						
						// location = "some where";
						// result.status = "PENDING_VISIT";
						// result.address = {phone:"15101017610"};
						
						result.commodity.coverFileUrl = fileApi.gerPreviewUrl(result.commodity.coverFileId);
						result.location = location;
						this.orderInfo = result;
					}
					if (this.dataInfoLoading) {
						this.dataInfoLoading = false;
					}
				},(err)=>{
					if (this.dataInfoLoading) {
						this.dataInfoLoading = false;
					}
				})
			},
			toBackPage(){
				uni.navigateBack();
			},
			mathLayoutParam(){
				let systemInfo = uni.getSystemInfoSync();
				let layoutContainerPaddingTop = systemInfo.statusBarHeight;
				let layoutContainerH = systemInfo.windowHeight - systemInfo.safeAreaInsets.bottom;//layoutContainerPaddingTop 是顶部要空出来的高度，52是固定的，底部tabbar的高度
				this.layoutContainerH = layoutContainerH;
				this.layoutContainerPaddingTop = layoutContainerPaddingTop;
				this.listContainerH = layoutContainerH - 100 - 44 - 52;
			},
			copyOrderBillCode(){
				uni.setClipboardData({
					data: this.orderInfo.billCode,
				});
			},
			callPhone(){
				if (!this.orderInfo.address || !this.orderInfo.address.phone) {
					this.showMessage("没有电话!","error");
					return;
				}
				uni.makePhoneCall({
					phoneNumber: result.address.phone
				});
			},
			clearPageInfo(){
				this.orderInfo = {};
			},
			payServiceCharge(){
				if (this.payLoading) {
					return;
				}
				if (!this.orderInfo.id) {
					console.error("支付失败，没有对应的出价id");
					return;
				}
				this.payLoading = true;
				uni.request({
					url: `/commodity-api/order/payServiceCharge/${this.orderInfo.id}`,
					method: "PUT",
					header: {
						"Content-Type": "application/json",
					},
				}).then((res)=>{
					let _data = res.data;
					let that = this;
					if (_data.code == 0) {
						let result = JSON.parse(_data.result);
						let param = {...result,
							package:result.packageVal,
							timeStamp:result.timestamp};
						console.log("准备调用支付：",param);
						uni.requestPayment({
							...result,
							package:result.packageVal,
							timeStamp:result.timestamp,
							success: function (res) {
								setTimeout(() => {
									that.showMessage("支付成功！","success");
									this.clearPageInfo();
									that.loadOrderData();
									that.payLoading = false;
								}, 1000);
							},
							fail: function (err) {
								console.error("支付失败！",err);
								that.showMessage("支付失败!","error");
								that.payLoading = false;
							}
						})
					} else {
						console.error("获取支付信息失败！");
						this.showMessage("支付失败","error");
						this.payLoading = false;
					}
				},(err)=>{
					console.error("获取支付信息失败！!",err);
					this.showMessage("支付失败","error");
					this.payLoading = false;
				});
			},
			onHaveArrived(){
				if (this.arrivedLoading) {
					return;
				}
				this.arrivedLoading = true;
				uni.request({
					url: `/commodity-api/order/arrived/${this.orderId}`,
					method: "PUT",
				}).then((res)=>{
					let _data = res.data;
					if (_data.code == 0) {
						this.showMessage("操作成功","success");
						this.loadOrderData();
					} else {
						this.showMessage("操作失败","error");
					}
					this.arrivedLoading = false;
				},(err)=>{
					this.showMessage("操作失败","error");
					this.arrivedLoading = false;
				})
			},
			onHaveCompleted(){
				if (this.completedLoading) {
					return;
				}
				this.completedLoading = true;
				uni.request({
					url: `/commodity-api/order/finish/${this.orderId}`,
					method: "PUT",
				}).then((res)=>{
					let _data = res.data;
					if (_data.code == 0) {
						this.showMessage("操作成功","success");
						this.loadOrderData();
					} else {
						this.showMessage("操作失败","error");
					}
					this.completedLoading = false;
				},(err)=>{
					this.showMessage("操作失败","error");
					this.completedLoading = false;
				})
			},
			showMessage(_info="",_type="default",_position="center",_icon="",_jumpParam={},_loading="false",_duration=5000,_callback=()=>{}){
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
				this.$refs.commonMessage.show({
					...params
				});
			},
		}
	}
</script>

<style lang="less">
.order-detail-container{
	width: 100%;
	padding-bottom: 100rpx;
	background-color: #f5f5f5;
	.order-top-bar{
		height: 180rpx;
		width: 100vw;
		background-color: #2db371;
		position: relative;
		.back-icon{
			display: inline-block;
			font-size: 50rpx;
			margin-left: 10rpx;
			margin-right: 15rpx;
			position: absolute;
			bottom: 10rpx;
			left: 10rpx;
			color: #fff;
		}
		.title-layout{
			position: absolute;
			bottom: 10rpx;
			left: calc(50% - 34px);
		}
	}
	.particular-scroll-container{
		// height: calc(100% - 100rpx);
		display: flex;
		flex-direction: column;
		.status-row{
			width: 90vw;
			height: 46rpx;
			margin: 20rpx auto;
			padding: 20rpx;
			background-color: #fff;
			border-radius: 20rpx;
			font-size: 32rpx;
			font-weight: bold;
		}
		.commodity-container{
			display: flex;
			height: 150rpx;
			width: 90vw;
			margin: 0rpx auto;
			margin-bottom: 20rpx;
			padding: 20rpx;
			background-color: #fff;
			border-radius: 20rpx;
			.img-container{
				width: 150rpx;
				position: relative;
				margin-right: 20rpx;
				.img-comp{
					width: 100%;
					height: 100%;
				}
			}
			.info-col-container{
				flex: 1;
				display: flex;
				flex-direction: column;
				.title-row{
					font-size: 30rpx;
				}
				.info-text-row{
					flex: 1;
					font-size: 28rpx;
					max-height: 80rpx;
					overflow: hidden;
				}
			}
		}
		.bidding-row{
			display: flex;
			justify-content: space-between;
			width: 90vw;
			height: 46rpx;
			margin: 0rpx auto;
			margin-bottom: 20rpx;
			padding: 20rpx;
			background-color: #fff;
			border-radius: 20rpx;
		}
		.info-row{
			display: flex;
			justify-content: space-between;
			width: 90vw;
			height: 46rpx;
			margin: 0rpx auto;
			margin-bottom: 20rpx;
			padding: 20rpx;
			background-color: #fff;
			border-radius: 20rpx;
			.button-item{
				height: 40rpx;
				display: inline-block;
			}
		}
		.operation-container{
			width: 90vw;
			margin: 0rpx auto;
			margin-bottom: 20rpx;
			padding: 20rpx;
			background-color: #fff;
			border-radius: 20rpx;
			.pay-service-charge{
				.amount-container{
					display: flex;
					justify-content: space-between;
				}
				.button-item{
					margin-top: 40rpx;
				}
			}
			.commodity-location{
				.row-con{
					display: flex;
					justify-content: space-between;
				}
			}
		}
	}
}
</style>