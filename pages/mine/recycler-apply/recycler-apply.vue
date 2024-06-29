<template>
	<view class="recycler-apply" :style="({'paddingBottom':buttonBottom+50+'px'})">
		<FormContent ref="formContent" :apply-data="applyData"></FormContent>
		<view class="recycler-apply-content">
			<view class="recycler-apply-content-title">
				您将获得什么
			</view>
			<view class="recycler-apply-acquire">
				<view class="recycler-apply-acquire-item" v-for="(item, index) in acquire" :key="index">
					<view :class="(`recycler-apply-acquire-icon iconfont icon-${item.icon}`)">
					</view>
					<view class="recycler-apply-acquire-content">
						<view class="recycler-apply-acquire-title">
							{{item.title}}
						</view>
						<view class="recycler-apply-acquire-text">
							{{item.text}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="recycler-apply-content">
			<view class="recycler-apply-content-title">
				为什么选择我们
			</view>
			<view class="recycler-apply-acquire">
				<view class="recycler-apply-acquire-item" v-for="(item, index) in selectMine" :key="index">
					<view :class="(`recycler-apply-acquire-icon iconfont icon-${item.icon}`)">
					</view>
					<view class="recycler-apply-acquire-content">
						<view class="recycler-apply-acquire-title">
							{{item.title}}
						</view>
						<view class="recycler-apply-acquire-text">
							{{item.text}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="recycler-apply-content">
			<view class="recycler-apply-content-title">
				有价简介
			</view>
			<view class="recycler-apply-about-us">
				有价是一个全品类废旧物资回收交易平台，倡导所用之物，皆可变现，通过海量信息采集、深度数据整理、用户行为分析，为用户智能匹配需求、推荐最优信息，提供发布商品+在线估价+上门回收相结合的新型回收服务模式。
			</view>
		</view>
		<view v-if="showButton" class="recycler-apply-buttons" :style="({'paddingBottom':buttonBottom + 10 +'px'})">
			<up-button @click="submit" :loading="saveLoading" type="primary">确认提交</up-button>
		</view>
	</view>
</template>

<script>
	import FormContent from "./form-content.vue";
	import uuid from "@/libs/uuid.js";

	export default {
		data() {
			return {
				buttonBottom: 0,
				saveLoading: false,
				showButton: false,
				applyData: {
					name: "",
					idCard: "",
					telephone: "",
					belongId: uuid.create().toString()
				},
				selectMine: [{
						title: "竞价机制",
						text: "商品发布后，会有多个回收商进行竞价供卖家“价比三家”",
						icon: "jingjiajz"
					},
					{
						title: "灵活的交易模式",
						text: "线上+线下灵活交易的模式",
						icon: "linghuo"
					},
					{
						title: "入住门槛低",
						text: "每一个回收行业人员都能免费入驻平台成为回收商",
						icon: "menkadi"
					},
				],
				acquire: [{
						title: "收入高",
						text: "多劳多得、奖励丰厚",
						icon: "shourugao"
					},
					{
						title: "用户体验好",
						text: "海量订单、新人扶持",
						icon: "tiyanhao"
					},
					{
						title: "社会价值高",
						text: "环保服务、减碳卫士",
						icon: "jiazhigao"
					},
					{
						title: "时间更自由",
						text: "单多好跑、时间自由",
						icon: "ziyou"
					},
				]
			}
		},
		mounted() {
			this.load();
			this.mathBottom();
		},
		methods: {
			load() {
				uni.request({
					url: "/auth-api/provider-apply/loadMine",
					method: "GET"
				}).then(res => {
					if (res && res.statusCode == 200) {
						const data = res.data;
						if (data.code == 0) {
							if (data.result) {
								const applyData = data.result;
								this.applyData = applyData;
								this.showButton = applyData.status !== 'APPROVE';
							} else {
								this.showButton = true;
							}
						} else {
							uni.$u.toast("获取数据失败," + data.msg);
						}
					} else {
						uni.$u.toast("获取数据失败");
					}
				})
			},
			mathBottom() {
				let systemInfo = uni.getSystemInfoSync();
				this.buttonBottom = systemInfo.safeAreaInsets.bottom;
			},
			submit() {
				this.saveLoading = true;
				this.$refs.formContent.validate().then(data => {
					this.doSave(data);
				}).catch(errors => {
					uni.$u.toast(errors[0].message);
					this.saveLoading = false;
				})
			},
			doSave(data) {
				uni.request({
					url: "/auth-api/provider-apply/save",
					method: this.applyData.id ? "PUT" : "POST",
					data,
					success: (res) => {
						this.saveLoading = false;
						if (res && res.statusCode == 200) {
							const data = res.data;
							if (data.code == 0) {
								uni.$u.toast("保存成功");
								uni.navigateTo({
									url: "/pages/mine/mine"
								})
							} else {
								uni.$u.toast("保存失败," + data.msg);
							}
						} else {
							uni.$u.toast("保存失败");
						}
					},
					fail: (err) => {
						this.saveLoading = false;
						uni.$u.toast("保存失败");
						console.log(err)
					}
				})
			}
		},
		components: {
			FormContent
		}
	}
</script>

<style lang="less">
	.recycler-apply {
		height: 100%;
		position: relative;
		background: #F9FBFD;
		box-sizing: border-box;
		padding: 40rpx;

		.recycler-apply-content {
			width: 100%;
			margin: 0 auto;
			margin-bottom: 40rpx;
			box-sizing: border-box;
			padding: 40rpx;
			background: #fff;
			border-radius: 10px;

			.recycler-apply-content-title {
				width: 100%;
				text-align: center;
				font-size: 18px;
				font-weight: 550;
				margin-bottom: 40rpx;
			}

			.u-upload__wrap__preview {
				border-radius: 4px !important;
			}

			.u-upload__wrap__preview__image {
				border: 1px solid #2db371 !important;
				width: 224rpx !important;
				height: 132rpx !important;
			}
		}

		.recycler-apply-buttons {
			position: fixed;
			left: 0;
			width: 100%;
			bottom: 0;
			padding-top: 10px;

			button {
				background: #2db371;
				border-radius: 20rpx;
			}
		}
	}

	.recycler-apply-acquire {
		display: flex;
		flex-direction: column;
		gap: 30rpx;

		.recycler-apply-acquire-item {
			display: flex;
			gap: 40rpx;
			width: 100%;

			.recycler-apply-acquire-icon {
				font-size: 56rpx;
				color: #2db371;
				width: 56rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
			}

			.recycler-apply-acquire-content {
				flex: 1;
				color: #222;

				.recycler-apply-acquire-title {
					font-size: 32rpx;
					line-height: 40rpx;
				}

				.recycler-apply-acquire-text {
					font-size: 12px;
					line-height: 36rpx;
					margin-top: 8rpx;
				}
			}

		}
	}
	
	.recycler-apply-about-us{
		text-indent: 2em;
		font-size: 12px;
		color: #222;
	}
</style>