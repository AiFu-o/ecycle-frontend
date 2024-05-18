<template>
	<view class="address-edit">
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
			<up-form-item label="所在地区" required>
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
			<up-button @click="submit" type="primary">保存</up-button>
		</view>
	</view>
</template>

<script>
	import RegionSelect from "./select.vue";

	export default {
		data() {
			return {
				buttonBottom: 0,
				addressData: {
					name: "",
					defaultAddress: false,
					address: "",
					region: []
				},
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
					'phone': {
						type: 'string',
						required: true,
						message: '请输入手机号',
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
		methods: {
			submit() {
				this.$refs.uFormRef.validate().then(res => {
					uni.$u.toast('校验通过')
				}).catch(errors => {
					uni.$u.toast('校验失败')
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
						debugger
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
		padding: 40rpx;

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
			left: 0;
			width: 100%;

			button {
				background: #2db371;
			}

		}
	}
</style>