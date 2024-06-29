<template>
	<view class="address-edit">
		<view class="address-edit-content">
			<view class="address-edit-title">
				<text style="font-size: 16px;font-weight: 550;">地址信息</text>
				<label class="radio">
					<radio :checked="addressData.defaultAddress" @click="clickDefaultAddress" />默认地址
				</label>
			</view>

			<up-form labelPosition="left" error-type="toast" labelWidth="100" :model="addressData" :rules="rules"
				ref="uFormRef">
				<up-form-item label="联系人" prop="name" required>
					<up-input v-model="addressData.name" placeholder="名字" border="none"></up-input>
				</up-form-item>
				<up-form-item label="手机号" prop="phone" required>
					<up-input v-model="addressData.phone" placeholder="手机号" border="none"></up-input>
				</up-form-item>
				<up-form-item label="所在地区" prop="region" required>
					<RegionSelect v-model="addressData.region"></RegionSelect>
				</up-form-item>
				<up-form-item label="详细地址" prop="address" required>
					<up-textarea v-model="addressData.address" placeholder="小区、写字楼、门牌号等" border="none"></up-textarea>
					<view class="address-icon" @click="getLocation">
						<i class="iconfont icon-dingwei"></i>
					</view>
				</up-form-item>
			</up-form>
			<view class="address-edit-buttons" :style="({'bottom':buttonBottom+'px'})">
				<up-button @click="submit" type="primary" :loading="saveLoading">保存</up-button>
			</view>
			<up-toast ref="saveToast"></up-toast>
		</view>
	</view>
</template>

<script>
	import RegionSelect from "./select.vue";
	import _ from "lodash";

	export default {
		data() {
			return {
				saveLoading: false,
				buttonBottom: 0,
				addressData: {
					name: "",
					defaultAddress: false,
					address: "",
					region: []
				},
				dataId: "",
				rules: {
					'name': {
						type: 'string',
						required: true,
						message: '请输入姓名',
						trigger: ['blur', 'change']
					},
					'phone': {
						type: 'string',
						required: true,
						message: '请输入手机号',
						trigger: ['blur', 'change']
					},
					'region': {
						validator: (rule, value, callback) => {
							return value && value.length == 4;
						},
						message: '请选择所在地区'
					},
					'address': {
						type: 'string',
						required: true,
						message: '请输入详细地址',
						trigger: ['blur', 'change']
					},
				},
			}
		},
		components: {
			RegionSelect
		},
		mounted() {
			this.mathBottom();

		},
		onLoad: function(option) {
			this.init(option);
		},
		methods: {
			init(option) {
				if (!option || !option.id) {
					return
				}
				this.dataId = option.id;
				uni.request({
					url: `/commodity-api/address/load/${this.dataId}`,
					method: "GET"
				}).then(res => {
					if (res.statusCode == 200) {
						if (res.data.code == 0) {
							let addressData = res.data.result;
							let region = []
							if (addressData.provinceCode && addressData.province) {
								region.push({
									code: addressData.provinceCode,
									name: addressData.province
								})
							}
							if (addressData.districtCode && addressData.district) {
								region.push({
									code: addressData.districtCode,
									name: addressData.district
								})
							}
							if (addressData.cityCode && addressData.city) {
								region.push({
									code: addressData.cityCode,
									name: addressData.city
								})
							}
							if (addressData.stressCode && addressData.stress) {
								region.push({
									code: addressData.stressCode,
									name: addressData.stress
								})
							}
							addressData.region = region;
							this.addressData = addressData;
						}
					}
				})
			},
			submit() {
				this.$refs.uFormRef.validate().then(res => {
					this.doSave()
				}).catch(errors => {
					console.log(errors)
					uni.$u.toast(errors[0].message);
				})
			},
			doSave() {
				this.saveLoading = true;
				let data = _.cloneDeep(this.addressData);
				let region = data.region;
				data.province = region[0].name;
				data.provinceCode = region[0].code;
				data.district = region[1].name;
				data.districtCode = region[1].code;
				data.city = region[2].name;
				data.cityCode = region[2].code;
				data.stress = region[3].name;
				data.stressCode = region[3].code;
				uni.request({
					url: "/commodity-api/address/save",
					method: this.dataId ? "PUT" : "POST",
					data,
					success: (res) => {
						if (res && res.statusCode == 200) {
							this.saveLoading = false;
							this.$refs.saveToast.show({
								type: 'success',
								icon: false,
								message: "保存成功",
							})
							uni.navigateBack();
						} else {
							this.$refs.saveToast.show({
								type: 'error',
								icon: false,
								message: "保存失败",
							})
						}
					},
					fail: (err) => {
						this.$refs.saveToast.show({
							type: 'error',
							icon: false,
							message: "保存失败",
						})
						console.log(err)
					}
				})
			},
			mathBottom() {
				let systemInfo = uni.getSystemInfoSync();
				this.buttonBottom = systemInfo.safeAreaInsets.bottom;
			},
			clickDefaultAddress() {
				this.addressData.defaultAddress = !this.addressData.defaultAddress;
			},
			getLocation() {
				uni.chooseLocation({
					success: (res) => {
						this.getRegion(res.latitude, res.longitude)
					},
					fail(err) {
						console.log(err)
					}
				});
			},
			getRegion(latitude, longitude) {
				uni.request({
					url: `/commodity-api/region-data/geocode?longitude=${longitude}&latitude=${latitude}`,
					success: (res) => {
						let data = res.data.result.regeocode.addressComponent;
						let stressCode = data.towncode.substring(0, 9);
						let city = data.city;
						if (!data.city || data.city.length < 1) {
							city = data.province;
						}
						this.addressData.region = [{
								"code": stressCode.substring(0, 2),
								"name": data.province
							},
							{
								"code": stressCode.substring(0, 4),
								"name": city
							},
							{
								"code": stressCode.substring(0, 6),
								"name": data.district
							},
							{
								"code": stressCode,
								"name": data.township
							}
						]
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.address-edit {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background: #F9FBFD;

		.address-edit-content {
			padding: 40rpx;
			flex: 1;
		}

		.radio {
			font-size: 14px;
			float: right;

			radio {
				transform: scale(0.7);
			}
		}


		.u-form-item__body {
			position: relative;

			.u-form-item__body__right__content {
				padding: 20rpx;
				border: 1px solid #f4f4f4;
				border-radius: 20rpx;
			}

			// .u-form-item__body__left__content__required {
			// 	left: -15px !important;
			// 	line-height: 80rpx !important;
			// 	top: 0 !important;
			// }
		}

		.address-icon {
			position: absolute;
			font-size: 24px;
			right: 30rpx;
			top: 74rpx;

			.icon-dingwei {
				font-size: 24px;
			}
		}

		.u-textarea {
			padding: 0 40rpx 0 0 !important;

			textarea {
				line-height: 40rpx;
				height: 200rpx;
			}
		}

		.address-edit-buttons {
			position: fixed;
			left: 5%;
			width: 90%;


			button {
				background: #2db371;
				border-radius: 20rpx;
			}

		}
	}
</style>