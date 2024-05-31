<template>
	<view class="commodity-publish-container" :style="`height: ${layoutContainerH}px;padding-top: ${layoutContainerPaddingTop}px;`">
		<view class="router-back-container">
			<i class="back-icon iconfont icon-back" @click="toBackPage"></i>
			<i class="title-text">发闲置</i>
		</view>
		<view :class="['info-container',textareaIsFocus?'info-container-onfocus':'info-container-unfocus']">
			<view :class="['description-container']" :style="`height: ${descriptionH}px;`">
				<textarea v-model="commodityTextDescription" 
					class="descrotion-textarea"
					placeholder="描述一下商品的基本信息,请尽量准确描述,并提供尽量完整的照片以供回收商出合适的价格~" 
					border="none"
					placeholder-style="word-wrap: break-word;font-size:24rpx;"
					confirm-type="done"
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
	</view>
</template>

<script>
	import _ from "lodash";
	export default {
		data() {
			return {
				layoutContainerH: 0,
				layoutContainerPaddingTop: 0,
				topBarAbsoluteTopH: 0,
				topBarBackRowH: 40,
				descriptionH: 200,
				
				textareaIsFocus: false,
				
				commodityTextDescription: "",
				
				imgList:[],
			}
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
			.descrotion-textarea{
				position: relative;
				min-height: 300rpx;
				height: 100%;
				width: calc(100% - 40rpx);
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
	}
}
</style>
