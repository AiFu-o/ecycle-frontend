<template>
	<view class="recycler-apply" :style="({'paddingBottom':buttonBottom+50+'px'})">
		<FormContent ref="formContent" :apply-data="applyData"></FormContent>
		<view class="recycler-apply-content">
			<view class="recycler-apply-content-title">
				您将获得什么
			</view>
		</view>
		<view class="recycler-apply-content">
			<view class="recycler-apply-content-title">
				为什么选择我们
			</view>
		</view>
		<view class="recycler-apply-content">
			<view class="recycler-apply-content-title">
				有价简介
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
				}
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
</style>