<template>
	<view class="common-search-container" :style="`height: ${layoutContainerH}px;padding-top: ${layoutContainerPaddingTop}px;`">
		<view class="router-back-container">
			<i class="back-icon iconfont icon-back"></i>
			<i class="title-text">有价</i>
		</view>
		<view class="search-input-container">
			<up-input clearable placeholder="" confirmType="search" border="surround" v-model="searchContent" @confirm="onSearchInputConfirm" @change="onSearchInputChange" @clear="onSearchInputClear"></up-input>
			<up-button text="搜索" color="#2db371" @click="onSearchButtonClick"></up-button>
		</view>
		<view v-if="layoutContainerH>0 && showDefault" class="recommend-container">
			<view class="history-container">
				<view class="history-title-tool">
					历史记录
					<i class="delete-all-icon iconfont icon-shanchu"></i>
				</view>
				<view class="history-content-container">
					<jk-tag v-for="(item,index) in historyList" :key="'historyTag'+index" :text="item.text" size="mini" bgColor="#f5f5f5" borderColor="#f5f5f5" color="#b9b9b9"></jk-tag>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {
		},
		props:{
			defaultContent:{
				type: String,
				default:function(){
					return "";
				}
			}
		},
		data() {
			return {
				layoutContainerH: 0,
				layoutContainerPaddingTop: 0,
				recommendContainerH: 0,
				
				showDefault: true,
				
				searchContent: "",
				historyList:[{text:"qqq"},{text:"ddadasd"},{text:"哈哈"},{text:"败笔"}],
			}
		},
		created(){
			if (this.defaultContent) {
				this.searchContent = "" + this.defaultContent;
			}
			this.loadSearchHistory();
		},
		mounted() {
			this.mathLayoutParam();
		},
		methods: {
			mathLayoutParam(){
				let systemInfo = uni.getSystemInfoSync();
				let layoutContainerPaddingTop = systemInfo.statusBarHeight;
				let layoutContainerH = systemInfo.windowHeight - systemInfo.safeAreaInsets.bottom - layoutContainerPaddingTop;//layoutContainerPaddingTop 是顶部要空出来的高度，52是固定的，底部tabbar的高度
				this.layoutContainerH = layoutContainerH;
				this.layoutContainerPaddingTop = layoutContainerPaddingTop;
			},
			loadSearchHistory(){},
			onSearchInputClear(){
			},
			onSearchInputChange(_value){
				if (_value && _value.length > 0) {
					this.showDefault = true;
					//TODO 关键词联想，搜索猜想
				} else {
					//没有内容的时候，默认展示推荐内容和搜索历史记录
					this.showDefault = true;
				}
				console.log("on input change");
			},
			onSearchInputConfirm(){},
			onSearchButtonClick(){},
		}
	}
</script>

<style lang="less">
.common-search-container{
	width: 100%;
	background-color: #f5f5f5;
	position: relative;
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
	.search-input-container{
		height: 70rpx;
		width: 100%;
		// padding: 0 20rpx;
		margin-top: 10rpx;
		position: relative;
		.u-input{
			margin-left: 3vw;
			width: 70vw;
			background-color: #fff;
			border: 1rpx solid #c7c7c7 !important;
			border-radius: 30rpx !important;
			padding-left: 18px !important;
		}
		.u-button{
			position: absolute !important;
			width: 14vw !important;
			background-color: #2db371 !important;
			color: #fff !important;
			border-radius: 30rpx;
			top: 0 !important;
			right: 3vw !important;
			height: 64rpx !important;
		}
	}
	.recommend-container{
		&::before {
		    content: "";
		    display: table;
		    border-collapse: collapse; /* 防止相邻margin合并 */
		}
		height: calc(100% - 170rpx);
		margin-top: 20rpx;
		// position: absolute;
		// bottom: 0;
		background-color: #fff;
		border-radius: 40rpx 40rpx 0 0;
		box-shadow: 0px 0px 16rpx #b9b9b9;
		.history-container{
			margin-top: 30rpx;
			padding: 0rpx 30rpx;
			.history-title-tool{
				height: 40rpx;
				font-size: 30rpx;
				.delete-all-icon{
					float: right;
					color: #777777;
					margin-top: 6rpx;
				}
			}
			.history-content-container{
				min-height: 40rpx;
			}
		}
	}
}
</style>