<template>
	<view :style="`height: ${layoutContainerH};`">
		<view v-if="!addressList || addressList.length < 1" class="no-address">
			<view class="no-address-text">
				还没有地址哦～
			</view>
			<up-button type="primary" text="添加地址" @click="createAddress"></up-button>
		</view>
		<view class="address-list">
			<view class="address-list-item" v-for="(item,index) in addressList" :key="item.id"
				@click="()=>{onAddressSelect(item)}">
				<view class="address-list-item-top">
					<view class="address-list-last-name">
						<text class="address-list-last-name-text">
							{{getLastName(item.name)}}
						</text>
					</view>
					<view class="address-list-item-content">
						<view class="address-list-item-content-top">
							<text class="address-list-item-name">
								{{item.name}}
							</text>
							<text class="address-list-item-phone">
								{{item.phone}}
							</text>
							<text class="default-address">默认</text>
						</view>
						<view class="address-list-item-address">
							<text>{{item.province}}</text>
							<text>{{item.district}}</text>
							<text>{{item.city}}</text>
							<text>{{item.stress}}</text>
							<text>{{item.address}}</text>
						</view>
					</view>
					<view class="address-list-item-edit" @click="toEdit(item.id)">
						<i class="iconfont icon-bianji"></i>
					</view>
				</view>
				<view class="address-list-item-bottom" v-if="manageAddress">
					<label class="radio" @click="settingDefaultAddress(item.id, index)">
						<radio :checked="item.defaultAddress" />默认地址
					</label>
					<text class="address-list-item-del" @click="del(item.id)">删除</text>
				</view>
			</view>
			<view class="address-list-buttons">
				<up-button @click="manageAddress = !manageAddress">{{manageAddress?'退出管理':'管理'}}</up-button>
				<up-button type="primary" @click="createAddress">添加地址</up-button>
			</view>
		</view>
		<up-modal :show="showDelConfirm" showCancelButton confirmColor="#2db371" asyncClose @confirm="doDel"
			@cancel="delCancel">
			<view class="slot-content">
				确认要删除该地址吗？
			</view>
		</up-modal>
		<up-toast ref="saveToast"></up-toast>
	</view>
</template>

<script>
	import _ from "lodash"
	export default {
		data() {
			return {
				manageAddress: false,
				addressList: [],
				layoutContainerH: 0,
				showDelConfirm: false,
				dataId: "",
				isFirstQuery:true
			}
		},
		onShow() {
			this.onLoad();
		},
		mounted() {
			this.mathLayoutParam();
			if(this.isFirstQuery){
				this.onLoad();
			}
		},
		props: {
			onSelectAddress: {
				type: Function
			}
		},
		methods: {
			onAddressSelect(_select) {
				if (!this.onSelectAddress) {
					return;
				}
				this.onSelectAddress(_select);
			},
			del(id) {
				this.dataId = id;
				this.showDelConfirm = true;
			},
			doDel() {
				uni.request({
					url: `/commodity-api/address/del/${this.dataId}`,
					method: "DELETE",
				}).then(res => {
					if (res.statusCode == 200) {
						this.showDelConfirm = false;
					}
				})
			},
			delCancel() {
				this.dataId = ""
				this.showDelConfirm = false;
			},
			getLastName(name) {
				return name.charAt(0);
			},
			createAddress() {
				uni.navigateTo({
					url: "/pages/address/edit"
				})
			},
			toEdit(id) {
				uni.navigateTo({
					url: `/pages/address/edit?id=${id}`
				})
			},
			mathLayoutParam() {
				if (this.onSelectAddress) {
					this.layoutContainerH = "100%";
					return;
				}
				let systemInfo = uni.getSystemInfoSync();
				let layoutContainerH = systemInfo.windowHeight - systemInfo.safeAreaInsets.bottom;
				this.layoutContainerH = layoutContainerH + "px";
				// this.layoutContainerPaddingTop = layoutContainerPaddingTop;
			},
			onLoad() {
				uni.request({
					url: "/commodity-api/address/queryMineAll",
					method: "GET",
				}).then(res => {
					if (res.statusCode == 200) {
						if (res.data.code == 0) {
							let aList = res.data.result;
							_.forEach(aList, (item) => {
								if (item.province == item.district) {
									item.title =
										`${item.province}-${item.city}-${item.stress}-${item.address}`;

								} else {
									item.title =
										`${item.province}-${item.district}-${item.city}-${item.stress}-${item.address}`;
								}
							})
							this.addressList = res.data.result;
						}
					}
				})
			},
			settingDefaultAddress(id, index) {
				uni.request({
					url: `/commodity-api/address/default/${id}`,
					method: "PUT",
				}).then(res => {
					if (res.statusCode == 200) {
						if (res.data.code == 0) {
							let addressList = _.cloneDeep(this.addressList)
							addressList[index].defaultAddress = !addressList[index].defaultAddress;
							this.addressList = addressList;
						}
					}
				})
			},
		}
	}
</script>

<style lang="less">
	.no-address {
		display: flex;
		text-align: center;
		justify-content: center;
		flex-direction: column;
		height: 100%;
		background: #F9FBFD;

		button {
			background: #2db371 !important;
			border-radius: 20rpx !important;
			width: 80% !important;
			margin: 40rpx auto 0 auto !important;
		}
	}

	.address-list {
		position: relative;
		height: 100%;
		background: #F9FBFD;
		display: flex;
		flex-direction: column;
		gap: 20rpx;
		overflow-y: auto;
		padding: 20rpx;
		box-sizing: border-box;

		.address-list-item {
			border-radius: 20rpx;
			box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
			border-color: transparent;
		}

		.address-list-item-top {
			display: flex;
			gap: 40rpx;
			padding: 20rpx;
		}

		.address-list-item-bottom {
			border-top: 1px solid #e9eaec;
			height: 80rpx;
			line-height: 80rpx;
			color: #a5a0a0;
			font-size: 14px;
			padding: 0 20rpx;

			radio {
				transform: scale(0.7);
			}

			.address-list-item-del {
				float: right;
			}
		}

		.address-list-last-name-text {
			width: 80rpx;
			height: 80rpx;
			border-radius: 100%;
			text-align: center;
			line-height: 80rpx;
			color: #2db371;
			background: #d0ffe8;
			font-size: 18px;
			font-weight: 550;
		}

		.address-list-last-name {
			display: flex;
			flex-direction: column;
			justify-content: center;
		}

		.address-list-item-content {
			flex: 1;

			.address-list-item-content-top {
				color: #222;
				margin-bottom: 10rpx;
				font-size: 14px;
				line-height: 40rpx;

				.address-list-item-name {
					font-weight: 550;
					margin-right: 12rpx;
				}

				.default-address {
					margin-left: 12rpx;
					color: #2db371;
					border: 1px solid #2db371;
					padding: 1px 4px;
					border-radius: 6px;
					vertical-align: top;
				}

			}

			.address-list-item-address {
				color: #a5a0a0;
				font-size: 14px;
				line-height: 40rpx;
				word-break: break-all;

				text {
					margin-left: 12rpx;
				}

				text:first-child,
				text:last-child {
					margin-left: 0;
				}
			}

		}

		.address-list-item-edit {
			width: 18px;
			display: flex;
			flex-direction: column;
			justify-content: center;

			i {
				font-size: 18px;
				font-weight: 550;
			}
		}

		.address-list-buttons {
			position: absolute;
			bottom: 0;
			height: 120rpx;
			padding: 20rpx;
			box-sizing: border-box;
			left: 0;
			background: #fff;
			width: 100%;
			display: flex;
			gap: 20rpx;

			button {
				width: calc(50% - 20rpx);
			}

		}

		.u-button--primary {
			background-color: #2db371 !important;
		}
	}
</style>