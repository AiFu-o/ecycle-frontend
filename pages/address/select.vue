<template>
	<view class="region-select-all" @click="">
		<view @click="show = true" style="font-size: 15px;"
			:class="({'input-placeholder':!modelValue || modelValue.length < 1})">
			{{regionText}}
		</view>

		<up-popup :show="show" :round="10" mode="bottom">
			<view class="region-select">
				<view class="region-select-title">
					请选择所在地区
					<i class="iconfont icon-close" @click="close"></i>
				</view>
				<view class="region-select-line">
					<view class="region-select-line-item"
						:class="({'region-select-line-item-current':currentIndex == index})"
						@click="clickLineItem(index)" v-for="(item, index) in region" :key="item.code">
						{{item.name}}
					</view>
				</view>
				<view class="region-select-options">
					<view class="region-select-divide">

					</view>
					<view @click="changeCurrentValue(item)" class="region-select-option"
						:class="({'region-select-option-current':region[currentIndex] && item.code == region[currentIndex].code})"
						v-for="item in dataList[currentIndex]">
						{{item.name}}
					</view>
				</view>
			</view>
		</up-popup>
	</view>
</template>

<script>
	import _ from "lodash";

	export default {
		data() {
			return {
				show: false,
				dataList: [
					[],
					[],
					[],
					[]
				],
				currentIndex: 1,
			}
		},
		watch: {
			show: {
				immediate: true,
				handler(val) {
					this.init();
				}
			}
		},
		mounted() {

		},
		methods: {
			close() {
				this.show = false
			},
			changeModelValue() {
				let region = _.cloneDeep(this.region);
				if (region[region.length - 1].code == 'select') {
					region.pop();
				}
				this.$emit("update:modelValue", region);
			},
			changeCurrentValue(item) {
				let lastIndex = this.currentIndex + 1;
				this.region[this.currentIndex] = item;
				this.changeModelValue();
				if (lastIndex == 4) {
					this.show = false;
					return;
				}
				if (!this.region[lastIndex]) {
					this.region[lastIndex] = {
						code: "select",
						name: this.getSelectText()
					}
				}
				this.loadSelectDataList(lastIndex).then(() => {
					this.currentIndex = lastIndex;
				});
			},
			clickLineItem(index) {
				this.currentIndex = index;
			},
			init() {
				let region = _.cloneDeep(this.modelValue);
				if (region.length < 4) {
					region.push({
						code: "select",
						name: this.getSelectText()
					})
				}
				this.region = region;
				let queryList = [];
				region.forEach((item, index) => {
					queryList.push(this.loadSelectDataList(index))
				})
				Promise.all(queryList).then(() => {
					this.currentIndex = region.length - 1;
				})
			},
			loadSelectDataList(index) {
				return new Promise((resolve, reject) => {
					let url = "/commodity-api/region-data/"
					let pCode = "";
					let saveKey = "provinceList";

					if (index > 0) {
						pCode = this.region[index - 1].code;
					}
					if (!index) {
						url += "getProvinceList";
					} else if (index == 1) {
						url += `getCityList/${pCode}`;
					} else if (index == 2) {
						url += `getAreaList/${pCode}`;
					} else if (index == 3) {
						url += `getStreetList/${pCode}`;
					}
					uni.request({
						url: url,
						method: "GET",
						success: (res) => {
							this.dataList[index] = res.data.result;
							resolve();
						}
					})
				});
			},
			getSelectText() {
				if (this.region && this.region.length == 2) {
					return "请选择县";
				} else if (this.region && this.region.length == 3) {
					return "请选择街道";
				} else {
					return "请选择城市";
				}
			}
		},

		computed: {
			regionText() {
				if (!this.modelValue || this.modelValue.length < 1) {
					return "省、市、区、街道";
				}
				let textList = [];
				this.modelValue.forEach(item => {
					textList.push(item.name);
				})
				return textList.join(",");
			},
		},
		props: {
			modelValue: Array
		}
	}
</script>

<style lang="less">
	.region-select {
		height: 60vh;
		padding: 40rpx 0;
		display: flex;
		flex-direction: column;
	}

	.region-select-title {
		font-size: 40rpx;
		font-weight: 600;
		color: #222;
		text-align: center;
		margin-bottom: 40rpx;
		position: relative;

		.icon-close {
			position: absolute !important;
			right: 20px !important;
			top: 0px !important;
			font-size: 18px;
		}
	}

	.region-select-line {
		padding: 0 40rpx;
		border-bottom: 1px solid #f2f2f2;
		padding-bottom: 40rpx;

		.region-select-line-item::after {
			content: "";
			width: 16rpx;
			height: 16rpx;
			border-radius: 100%;
			background: #2db371;
			position: absolute;
			top: 0;
			left: -8rpx;
			box-sizing: border-box;
		}

		.region-select-line-item {
			position: relative;
			height: 40rpx;
			line-height: 20rpx;
			padding-bottom: 60rpx;
			color: #222;
			padding-left: 30rpx;
			border-left: 1px #2db371 solid;
			font-size: 32rpx;
		}

		.region-select-line-item-current {
			color: #2db371;
		}

		.region-no-select-line-item {
			border-left: none;
		}

		.region-no-select-line-item::after {
			background: #fff;
			border: 1px #2db371 solid;
		}

		.region-select-line-item:last-child {
			border-left: none;
			padding-bottom: 0;
		}
	}

	.region-select-options {
		overflow: hidden;
		overflow-y: auto;
		flex: 1;
		padding: 0 40rpx;
		padding-top: 40rpx;

		.region-select-option {
			line-height: 80rpx;
			height: 80rpx;
			font-size: 32rpx;
			color: #222;
		}

		.region-select-option-current {
			color: #2db371;
		}
	}
</style>