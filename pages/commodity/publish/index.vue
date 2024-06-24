<template>
	<view class="commodity-publish-container" :style="`height: ${layoutContainerH}px;padding-top: ${layoutContainerPaddingTop}px;`">
		<view class="router-back-container">
			<i class="back-icon iconfont icon-back" @click="toBackPage"></i>
			<i class="title-text">发闲置</i>
		</view>
		<view :class="['info-container','info-container-unfocus']">
			<view :class="['description-container']" :style="`height: 80rpx;`">
				<up-input v-model="commodityName" 
					class="name-textarea"
					placeholder="请输入一个商品名称或简述,不要超过50个字"
					border="none"
					placeholder-style="word-wrap: break-word;font-size:24rpx;"
					confirm-type="done"
					:maxlength="50"
				></up-input>
				<view class="publish-button">
					<up-button ref="search-input-main" text="发布" color="#2db371" @click="onPublishButtonClick"></up-button>
				</view>
			</view>
		</view>
		<view :class="['info-container',textareaIsFocus?'info-container-onfocus':'info-container-unfocus']">
			<view :class="['description-container']" :style="`height: ${descriptionH}px;`">
				<textarea v-model="commodityTextDescription" 
					class="descrotion-textarea"
					placeholder="描述一下商品的基本信息,请尽量准确描述,并提供尽量完整的照片以供回收商出合适的价格~" 
					border="none"
					placeholder-style="word-wrap: break-word;font-size:24rpx;"
					confirm-type="done"
					:maxlength="2000"
					@focus="onTextareaFocus" @blur="onTextareaBlur" @confirm="onTextareaBlur"
				></textarea>
			</view>
			<view class="img-container" v-show="!textareaIsFocus">
				<up-upload
					:fileList="imgList"
					accept="image"
					@afterRead="afterRead"
					@delete="deletePic"
					name="comimg"
					multiple
					:maxCount="9"
					:uploadText="'优质首图更吸引人~'"
					width="120"
					height="120"
				></up-upload>
			</view>
		</view>
		<view class="extend-info-container">
			<view class="einfo-row">
				<view class="einfo-label">种类</view>
				<view class="einfo-value" v-if="categoryList.length>0" @click="toSelectCategory">
					{{formatCategory(commodityCategory)}}
				</view>
				<i class="select-icon iconfont icon-youjiantou"></i>
			</view>
			<view class="einfo-split"></view>
			<view class="einfo-row">
				<view class="einfo-label">地址</view>
				<view class="einfo-value" v-if="defaultAddressFinish" @click="toSelectAddress">
					{{formatAddress(commodityAddress)}}
				</view>
				<i class="select-icon iconfont icon-youjiantou"></i>
			</view>
		</view>
		<up-popup :show="isShowAddressSelector" :round="20" mode="bottom" @close="onAddressSelectorClose" @open="onAddressSelectorOpen">
			<view style="height: 80vh;position: relative;padding-top: 40rpx;" >
				<addressList class="address-list" :onSelectAddress="onSelectAddress"></addressList>
			</view>
		</up-popup>
		<up-picker :show="isShowCategorySelector" confirmColor="#2db371" :closeOnClickOverlay="true" :columns="categoryList" keyName="name" @confirm="onConfirmCategorySelect" @close="onCloseCategorySelect" @cancel="onCloseCategorySelect"></up-picker>
		<up-toast ref="publishWarningInfo"></up-toast>
		<up-loading-icon :show="isLoading"></up-loading-icon>
	</view>
</template>

<script>
	import _ from "lodash";
	import addressList from "@/pages/address/address.vue";
	import uuid from "@/libs/uuid.js";
	
	export default {
		data() {
			return {
				layoutContainerH: 0,
				layoutContainerPaddingTop: 0,
				topBarAbsoluteTopH: 0,
				topBarBackRowH: 40,
				descriptionH: 200,
				
				textareaIsFocus: false,
				isShowAddressSelector: false,
				isShowCategorySelector: false,
				isLoading: false,
				
				categoryList: [],
				categoryList2: [],//前面的用于展示，这个用于存储数据，懒得取
				defaultAddressFinish: true,
				
				commodityName: "测试啊",
				commodityTextDescription: "测试啊啊",
				commodityCategory: {},
				commodityAddress: {},
				belongId: uuid.create().toString(),
				coverFileId: "",
				
				imgList:[],
				
				uploadInfo: {},//url:{state:'ing/successed/failed',progress:0,totalBytesSent:0,totalBytesExpectedToSend:0},
			}
		},
		onLoad() {
			this.initData();
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
				this.layoutContainerPaddingTop = layoutContainerPaddingTop;
				this.topBarAbsoluteTopH = systemInfo.statusBarHeight;
			},
			initData(){
				this.initCategoryList();
				// this.initDefaultAddress();
			},
			initCategoryList(){
				let that = this;
				uni.request({
					url: "/commodity-api/commodity-category/queryAll",
					method: "GET"
				}).then((res)=>{
					let _data = res.data;
					if (_data.code == 0) {
						let newList = [];
						_.forEach(_data.result,(item)=>{
							newList.push({
								id: item.id,
								name: item.title,
								key: item.name
							});
							// newList.push(item.title);
						});
						that.categoryList = _.cloneDeep([newList]);
						this.categoryList2 = _.cloneDeep(newList);
					}
				},(err)=>{})
			},
			initDefaultAddress(){
				uni.request({
					url: "/auth-api/address/queryMineDefaultAddress",
					method: "GET"
				}).then((res)=>{
					let _data = res.data;
					let defaultAddressFinish = true;
				},(err)=>{})
			},
			formatCategory(_category){
				if (!_category || !_category.id) {
					return "待选择";
				}
				let check = _.find(this.categoryList2,(item)=>{
					return item.id == _category.id;
				})
				if (check) {
					return check.name;
				}
				return "错误信息！";
			},
			formatAddress(_addressObj){
				if (!_addressObj || !_addressObj.id) {
					return "待选择";
				}
				if (_addressObj.title) {
					return _addressObj.title;
				}
				return '错误信息！';
			},
			toBackPage(){
				uni.navigateBack();
			},
			onTextareaFocus(_e){
				this.textareaIsFocus = true;
				this.descriptionH = this.layoutContainerH - _e.detail.height;
			},
			onTextareaBlur(){
				this.textareaIsFocus = false;
				this.descriptionH = 200;
			},
			afterRead(_info,_error){
				this.imgList.push(_info.file[0]);
				// this.imgList = _.concat(this.imgList,_info.file);
			},
			deletePic(_info,_error){
				let rList = [];
				for (let a=0;a<this.imgList.length;a++) {
					if (this.imgList[a].url != _info.file.url) {
						rList.push(this.imgList[a]);
					}
				}
				this.imgList = rList;
			},
			toSelectAddress(){
				this.isShowAddressSelector = true;
			},
			onAddressSelectorClose(){
				this.isShowAddressSelector = false;
			},
			onAddressSelectorOpen(){
				this.isShowAddressSelector = true;
			},
			onSelectAddress(_select){
				this.isShowAddressSelector = false;
				this.commodityAddress = {
					id:_select.id,
					title:_select.title
				};
			},
			toSelectCategory(){
				this.isShowCategorySelector = true;
			},
			onCloseCategorySelect(){
				this.isShowCategorySelector = false;
			},
			onConfirmCategorySelect(_event){
				this.isShowCategorySelector = false;
				let check = _.find(this.categoryList2,(item)=>{
					return item.id == _event.value[0].id;
				});
				if (!check) {
					console.error("选择种类报错，请联系管理员！");
				}
				this.commodityCategory = _.cloneDeep(check);
			},
			onPublishButtonClick(){
				if (!this.beforePublishCheck()) {
					return;
				}
				this.isLoading = true;
				this.publish_uploadImg().then(()=>{
					let isAllSuccess = true;
					_.forIn(this.uploadInfo, function(value, key) {
						if (value.state != "successed") {
							isAllSuccess = false;
						}
					});
					if (!isAllSuccess) {
						this.showToast("上传图片失败，请联系管理员！","error");
						return;
					}
					this.publish_commodity();				
				},(f)=>{
					this.showToast("上传图片失败，请联系管理员！","error");
					this.isLoading = false;
				}).catch((e)=>{
					this.showToast("创建商品失败，请联系管理员！","error");
					this.isLoading = false;
				});
			},
			publish_uploadImg(){
				return new Promise((resolve,reject)=>{
					let that = this;
					this.uploadInfo = {};
					for (let a=0;a<this.imgList.length;a++) {
						that.uploadInfo[that.imgList[a].url] = {state:"ing"};
						let uploadTask = uni.uploadFile({
							url: `/storage-api/uploadFile?belongId=${that.belongId}&category=particular&anonymous=true`,
							filePath:that.imgList[a].url,
							name: 'file',
							success: (uploadFileRes) => {
								console.log(uploadFileRes.data);
								let result = JSON.parse(uploadFileRes.data);
								if (result.code != 0) {
									this.showToast("上传图片时意料之外的错误，请联系管理员！","error");
									return;
								}
								;
								if (a == 0) {
									that.coverFileId = result.result;
								}
								let isAllOver = true;
								that.uploadInfo[that.imgList[a].url].state = "successed";
								_.forIn(that.uploadInfo, function(value, key) {
									if (value.state != "successed") {
										isAllOver = false;
									}
								});
								if (isAllOver) {
									resolve();
								}
							},
							fail: (e) => {
								console.log(e);
								that.uploadInfo[that.imgList[a].url].state = "failed"
								reject();
							}
						});
						let updateListen = uploadTask.onProgressUpdate((res) => {
							// console.log('上传进度' + res.progress);
							// console.log('已经上传的数据长度' + res.totalBytesSent);
							// console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
							that.uploadInfo[that.imgList[a].url].progress = res.progress;
							that.uploadInfo[that.imgList[a].url].totalBytesSent = res.totalBytesSent;
							that.uploadInfo[that.imgList[a].url].totalBytesExpectedToSend = res.totalBytesExpectedToSend;
							let hasFailedOne = false;
							_.forIn(that.uploadInfo, function(value, key) {
								if (value.state == "failed") {
									hasFailedOne = true;
								}
							});
							if (hasFailedOne) {
								uploadTask.abort();
							}
						});
						let receivedListen = uploadTask.onHeadersReceived((res)=>{
							uploadTask.offProgressUpdate(updateListen);
							uploadTask.offProgressUpdate(receivedListen);
						});
					}
				});
			},
			// publish_uploadImg_item(_fileUrl){
			// 	return uni.uploadFile({
			// 		url: `/storage-api/uploadFile?belongId=${this.belongId}&category=particular&anonymous=true`,
			// 		filePath: _fileUrl.url,
			// 		name: 'file',
			// 		success: (uploadFileRes) => {
			// 			console.log(uploadFileRes.data);
			// 			this.uploadInfo[_fileUrl].state = "successed"
			// 		},
			// 		fail: (e) => {
			// 			console.log(e);
			// 			this.uploadInfo[_fileUrl].state = "failed"
			// 		}
			// 	});
			// },
			publish_commodity(){
				let readyCommodity = {
					id: uuid.create().toString(),
					name: "" + this.commodityName,
					info: "" + this.commodityTextDescription,
					categoryId: this.commodityCategory.id + "",
					addressId: this.commodityAddress.id + "",
					belongId: this.belongId + "",
					coverFileId: this.coverFileId + "",
				}
				uni.request({
					url: "/commodity-api/commodity/publish",
					method: "POST",
					data: readyCommodity
				}).then((res)=>{
					if (res.statusCode == 200 && res.data.code == 0) {
						this.showToast("创建商品成功！","success");
						this.isLoading = false;
						uni.redirectTo({
							url: "/pages/commodity/default-list"
						});	
					} else {
						this.showToast(res.data.msg,"error");
						this.isLoading = false;
					}
				},(err)=>{
					this.showToast("创建商品信息失败，请联系管理员！","error");
					this.isLoading = false;
				})
			},
			beforePublishCheck(){
				//publishWarningInfo
				if (!this.commodityName || this.commodityName.length <= 0) {
					this.showToast("商品名称不能为空","error");
					return false;
				}
				if (!this.commodityTextDescription || this.commodityTextDescription.length <= 0) {
					this.showToast("商品详情不能为空","error");
					return false;
				}
				if (!this.commodityCategory || !this.commodityCategory.id) {
					this.showToast("请选择商品类型","error");
					return false;
				}
				if (!this.commodityAddress || !this.commodityAddress.id) {
					this.showToast("请选择地址","error");
					return false;
				}
				if (!this.imgList || this.imgList.length < 1) {
					this.showToast("请至少上传三张图片","error");
					return false;
				}
				return true;
			},
			showToast(_info="",_type="default",_position="center",_icon="",_jumpParam={},_loading="false",_duration=4000,_callback=()=>{}){
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
				this.$refs.publishWarningInfo.show({
					...params
				});
			},
		},
		components:{
			addressList
		}
	}
</script>

<style lang="less">
.commodity-publish-container{
	width: 100%;
	background-color: #f5f5f5;
	.router-back-container{
		height: 70rpx;
		width: 100%;
		line-height: 70rpx;
		.back-icon{
			display: inline-block;
			font-size: 50rpx;
			color: #2db371;
			margin-left: 10rpx;
			margin-right: 15rpx;
		}
		.title-text{
			vertical-align: top;
			display: inline-block;
			margin-left: 35vw;
		}
	}
	.info-container{
		// height: 90vh;
		margin-top: 50rpx;
		width: 100%;
		background-color: #fff;
		padding: 20rpx;
		// border-radius: 40rpx;
		// box-shadow: 0px 0px 16rpx #b9b9b9;
		box-shadow: 0px 0px 100rpx rgba(200,200,200,0.2);
		&::before {
		    content: "";
		    display: table;
		    border-collapse: collapse; /* 防止相邻margin合并 */
		}
		.description-container{
			position: relative;
			display: flex;
			// justify-content: center;
			align-items: center;
			.name-textarea{
				position: relative;
				height: 100%;
				// width: calc(100% - 240rpx);
			}
			.descrotion-textarea{
				position: relative;
				min-height: 300rpx;
				height: 100%;
				width: calc(100% - 40rpx);
			}
			.publish-button{
				width: 120rpx;
				height: 80rpx;
			}
			
		}
		.img-container{
			.u-upload__deletable{
				height: 50rpx;
				width: 50rpx;
			}
			.u-icon__icon{
				font-size: 40rpx !important;
				line-height: 40rpx !important;
			}
		}
	}
	.info-container-onfocus{
		margin-left: 0rpx;
		margin-right: 0rpx;
		width: 100%;
		border-radius: 0rpx;
	}
	.info-container-unfocus{
		margin-left: 20rpx;
		margin-right: 20rpx;
		width: calc(100% - 80rpx);
		border-radius: 20rpx;
		// box-shadow: 0px 0px 16rpx #b9b9b9;
	}
	.extend-info-container{
		margin-top: 50rpx;
		width: 100%;
		background-color: #fff;
		padding: 20rpx;
		margin-left: 20rpx;
		margin-right: 20rpx;
		width: calc(100% - 80rpx);
		border-radius: 20rpx;
		box-shadow: 0px 0px 100rpx rgba(200,200,200,0.2);
		display: flex;
		flex-direction: column;
		.einfo-row{
			height: 80rpx;
			line-height: 80rpx;
			display: flex;
			flex-direction: row;
			.einfo-label{
				flex: 1;
				font-weight: 500;
				padding-left: 20rpx;
			}
			.einfo-value{
				flex: 4;
				text-align: end;
			}
			.select-icon{
				display: inline-block;
				font-size: 40rpx;
				color: #2db371;
				margin-left: 10rpx;
				margin-right: 15rpx;
			}
		}
		.einfo-split{
			height: 1px;
			border-top: 1px solid #e3e3e3;
		}
	}
	.address-list{
		// height: 80vh;
	}
}
</style>
