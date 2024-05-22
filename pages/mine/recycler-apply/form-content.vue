<template>
	<view class="recycler-apply-content">
		<view class="recycler-apply-content-title">
			报名加入
		</view>
		<up-form labelPosition="left" error-type="toast" labelWidth="100" :model="applyData" :rules="rules"
			ref="uFormRef">
			<up-form-item label="姓名" prop="name">
				<up-input :disabled="isApprove" disabledColor="transparent" v-model="applyData.name"
					placeholder="请输入您的真实姓名" border="none"></up-input>
			</up-form-item>
			<up-form-item label="手机号" prop="telephone">
				<up-input :disabled="isApprove" disabledColor="transparent" v-model="applyData.telephone"
					placeholder="请输入您的手机号" border="none"></up-input>
			</up-form-item>
			<up-form-item label="身份证" prop="idCard">
				<up-input :disabled="isApprove" disabledColor="transparent" v-model="applyData.idCard"
					placeholder="请输入您的身份证号" border="none"></up-input>
			</up-form-item>
			<up-form-item label="身份证正面">
				<up-upload :deletable="!isApprove" :disabled="isApprove" :fileList="obverseFile" name="obverse"
					@afterRead="afterRead" @delete="deletePic" :maxCount="1" accept="image">
					<view class="recycler-apply-upload">
						<i class="iconfont icon-zhaoxiangji"></i>
						<image class="recycler-apply-upload-img" src="@/static/recycler-apply/obverse.png" />
					</view>
				</up-upload>
			</up-form-item>
			<up-form-item label="身份证反面">
				<up-upload :deletable="!isApprove" :disabled="isApprove" :fileList="reverseFile" @afterRead="afterRead"
					name="reverse" @delete="deletePic" :maxCount="1" accept="image">
					<view class="recycler-apply-upload">
						<i class="iconfont icon-zhaoxiangji"></i>
						<image class="recycler-apply-upload-img" src="@/static/recycler-apply/reverse.png" />
					</view>
				</up-upload>
			</up-form-item>
			<up-form-item label="手持身份证">
				<up-upload :deletable="!isApprove" :disabled="isApprove" :fileList="inHandFile" name="inHand"
					@afterRead="afterRead" @delete="deletePic" :maxCount="1" accept="image">
					<view class="recycler-apply-upload">
						<i class="iconfont icon-zhaoxiangji"></i>
						<image class="recycler-apply-upload-img" src="@/static/recycler-apply/in-hand.png"
							style="width: 50px;" />
					</view>
				</up-upload>
			</up-form-item>
		</up-form>
	</view>
</template>

<script>
	import fileApi from "../../../libs/file-api.js";
	export default {
		data() {
			return {
				obverseFile: [],
				reverseFile: [],
				inHandFile: [],
				isApprove: false,
				rules: {
					'name': {
						type: 'string',
						required: true,
						message: '请输入姓名',
						trigger: ['blur', 'change']
					},
					'telephone': {
						type: 'string',
						required: true,
						message: '请输入手机号',
						trigger: ['blur', 'change']
					},
					'idCard': {
						type: 'string',
						required: true,
						message: '请输入身份证号',
						trigger: ['blur', 'change']
					},
				},
			}
		},
		computed: {
			isApprove() {
				return this.applyData.status == 'APPROVE';
			}
		},
		watch: {
			"applyData.belongId"() {
				if (this.applyData.id) {
					this.loadFileList();
				}
			}
		},
		props: {
			applyData: {
				type: Object,
				default: {}
			}
		},
		mounted() {},
		methods: {
			loadFileList() {
				uni.request({
					url: `/storage-api/fileInfos?belongId=${this.applyData.belongId}`
				}).then(res => {
					if (res && res.statusCode == 200) {
						const data = res.data;
						if (data.code == 0) {
							data.result.forEach(item => {
								this[item.category + "File"] = [{
									id: item.id,
									url: fileApi.baseUrl + item.address,
								}];
							})
						} else {
							uni.$u.toast("获取文件失败," + data.msg);
						}
					} else {
						uni.$u.toast("获取文件失败");
					}
				})
			},
			validate() {
				return new Promise((resolve, reject) => {
					if (this.applyData.status && this.applyData.status == 'APPROVE') {
						reject([{
							message: "您已经成为回收商"
						}]);
						return;
					}
					if (!this.obverseFile || this.obverseFile.length < 1) {
						reject([{
							message: "请上传身份证正面照片"
						}]);
						return;
					}
					if (!this.reverseFile || this.reverseFile.length < 1) {
						reject([{
							message: "请上传身份证背面照片"
						}]);
						return;
					}
					if (!this.inHandFile || this.inHandFile.length < 1) {
						reject([{
							message: "请上传手持身份证照片"
						}]);
						return;
					}
					this.$refs.uFormRef.validate().then(() => {
						resolve(this.applyData);
					}).catch(errors => {
						reject(errors);
					})
				});
			},
			async afterRead(file) {
				console.log(file)
				try {
					const category = file.name;
					const fileResult = await this.uploadFile(file.file, category);
					const data = JSON.parse(fileResult.data);
					file.file.id = data.result;
					this[category + 'File'] = [file.file];
				} catch (err) {
					console.error(err);
				}
			},
			uploadFile(file, category) {
				return uni.uploadFile({
					url: `/storage-api/uploadFile?belongId=${this.applyData.belongId}&category=${category}`,
					filePath: file.url,
					name: 'file'
				});
			},
			deletePic(file) {
				const category = file.name;
				uni.request({
					url: `/storage-api/file/${file.file.id}`,
					method: "DELETE"
				}).then(res => {
					this[category + "File"] = [];
				})
			},
		}
	}
</script>

<style lang="less" scoped>
	.u-upload__wrap__preview {
		width: 224rpx !important;
		height: 132rpx !important;
		background: #F9FBFD;
		border: 1px solid #2db371;
		border-radius: 4px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.recycler-apply-upload {
		width: 224rpx;
		height: 132rpx;
		background: #F9FBFD;
		border: 1px solid #2db371;
		border-radius: 4px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;

		.icon-zhaoxiangji {
			position: absolute;
			left: 88rpx;
			top: 42rpx;
			font-size: 14px;
			height: 48rpx;
			width: 48rpx;
			line-height: 48rpx;
			text-align: center;
			border-radius: 100%;
			background: rgba(45, 179, 113, .5);
			color: #fff;
		}

		.recycler-apply-upload-img {
			width: 70%;
			height: 70%;
		}
	}
</style>