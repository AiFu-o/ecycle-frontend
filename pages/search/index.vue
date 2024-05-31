<template>
	<view class="common-search-container" :style="`height: ${layoutContainerH}px;padding-top: ${layoutContainerPaddingTop}px;`">
		<view class="router-back-container">
			<i class="back-icon iconfont icon-back" @click="toBackPage"></i>
			<i class="title-text">有价</i>
		</view>
		<view class="search-input-container">
			<up-input clearable placeholder="" confirmType="search" border="surround" v-model="searchContent" @confirm="onSearchInputConfirm" @change="onSearchInputChange" @clear="onSearchInputClear"></up-input>
			<up-button ref="search-input-main" text="搜索" color="#2db371" @click="onSearchButtonClick"></up-button>
		</view>
		<view v-if="layoutContainerH>0 && showDefault" class="recommend-container">
			<view class="history-container">
				<view class="history-title-tool">
					历史记录
					<i class="delete-all-icon iconfont icon-shanchu" @click="onHistoryDeleteAllClick"></i>
				</view>
				<view class="history-content-container">
					<up-tag v-for="(item,index) in historyList" :key="'historyTag'+index" :name="item.text" :text="item.text" closable @click="(_name)=>{onHistoryTagClick(_name,item)}" @close='(_name)=>{onHistoryTagCloseClick(_name,item)}' bgColor="#f5f5f5" borderColor="#f5f5f5" color="#b9b9b9"></up-tag>
				</view>
			</view>
		</view>
		<up-popup :show="showTagDeleteConfirm" :round="10" mode="center" @close="onTagDeleteConfirmClose" @open="onTagDeleteConfirmOpen">
			<view>
				<text>确定删除该条记录吗</text>
				<up-button text="确定" :plain="true" color="#da0109" @click="onTagDeleteConfirmClickConfirm"></up-button>
				<up-button text="取消" :plain="true" @click="onTagDeleteConfirmClickCancel"></up-button>
			</view>
		</up-popup>
		<up-popup :show="showTagDeleteAllConfirm" :round="10" mode="center" @close="onTagDeleteAllConfirmClose" @open="onTagDeleteConfirmOpen">
			<view>
				<text>确定删除全部记录吗</text>
				<up-button text="确定" :plain="true" color="#da0109" @click="onTagDeleteAllConfirmClickConfirm"></up-button>
				<up-button text="取消" :plain="true" @click="onTagDeleteAllConfirmClickCancel"></up-button>
			</view>
		</up-popup>
	</view>
</template>

<script>
	import _, { cloneDeep } from "lodash";
	const LOCAL_KEY_HISTORY_SEARCH_LIST = "__rd_history_search_list__";
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
				showTagDeleteConfirm: false,
				showTagDeleteAllConfirm: false,
				
				searchContent: "",
				historyList:[{text:"qqq"},{text:"ddadasd"},{text:"哈哈"},{text:"败笔"}],
				toDeleteTagItem: {},
			}
		},
		onLoad: function (option) {
			this.searchContent = "" + option.searchText;
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
		options: {
			styleIsolation: 'shared',
		},
		methods: {
			toBackPage(){
				uni.navigateBack();
			},
			mathLayoutParam(){
				let systemInfo = uni.getSystemInfoSync();
				let layoutContainerPaddingTop = systemInfo.statusBarHeight;
				let layoutContainerH = systemInfo.windowHeight - systemInfo.safeAreaInsets.bottom - layoutContainerPaddingTop;//layoutContainerPaddingTop 是顶部要空出来的高度，52是固定的，底部tabbar的高度
				this.layoutContainerH = layoutContainerH;
				this.layoutContainerPaddingTop = layoutContainerPaddingTop;
			},
			loadSearchHistory(){
				let historyListStr = uni.getStorageSync(LOCAL_KEY_HISTORY_SEARCH_LIST);
				let historyList = [];
				if (historyListStr && historyListStr.length > 0) {
					try{
						historyList = JSON.parse(historyListStr);
					}catch(e){
						// that.historyList = [];
					}
				}
				this.historyList = historyList;
				if (historyList.length <= 0) {
					uni.setStorageSync(LOCAL_KEY_HISTORY_SEARCH_LIST,JSON.stringify(historyList));
				}
			},
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
			},
			onSearchInputConfirm(){
				this.doSearchAction();
			},
			onSearchButtonClick(){
				this.doSearchAction();
			},
			doSearchAction(){
				if (!this.searchContent || this.searchContent.length <= 0) {
					return;
				}
				//TODO search action
				let historyList = _.cloneDeep(this.historyList);
				historyList = _.filter(historyList,(item)=>{
					return item.text != this.searchContent;
				});
				historyList = _.concat({text:this.searchContent},historyList);
				uni.setStorageSync(LOCAL_KEY_HISTORY_SEARCH_LIST,JSON.stringify(historyList));
				this.loadSearchHistory();
			},
			onHistoryTagClick(_name,_item){
				if (_item && _item.text) {
					this.searchContent = "" + _item.text;
				}
			},
			onHistoryTagCloseClick(_name,_item){
				if (!_item || !_item.text) {
					return;
				}
				this.toDeleteTagItem = _.cloneDeep(_item);
				this.showTagDeleteConfirm = true;
			},
			onTagDeleteConfirmClickCancel(){
				this.onTagDeleteConfirmClose();
			},
			onTagDeleteConfirmClickConfirm(){
				if (this.toDeleteTagItem) {
					let historyList = _.cloneDeep(this.historyList);
					historyList = _.filter(historyList,(item)=>{
						return item.text != this.toDeleteTagItem.text;
					});
					this.toDeleteTagItem = null;
					uni.setStorageSync(LOCAL_KEY_HISTORY_SEARCH_LIST,JSON.stringify(historyList));
					this.loadSearchHistory();
				} else {
					console.error("不该存在的错误!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!on onTagDeleteConfirmClick");
				}
				this.showTagDeleteConfirm = false;
			},
			onTagDeleteConfirmClose(){
				this.showTagDeleteConfirm = false;
				this.toDeleteTagItem = null;
			},
			onTagDeleteConfirmOpen(){
				// this.showTagDeleteConfirm = true;
			},
			onHistoryDeleteAllClick(){
				this.showTagDeleteAllConfirm = true;
			},
			onTagDeleteAllConfirmClickConfirm(){
				uni.setStorageSync(LOCAL_KEY_HISTORY_SEARCH_LIST,JSON.stringify({}));
				this.loadSearchHistory();
				this.showTagDeleteAllConfirm = false;
			},
			onTagDeleteAllConfirmClickCancel(){
				this.onTagDeleteAllConfirmClose();
			},
			onTagDeleteAllConfirmClose(){
				this.showTagDeleteAllConfirm = false;
			},
		}
	}
</script>

<style lang="scss">
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
				display: flex;
				flex-wrap: wrap;
				align-content: flex-start;
				.u-tag-wrapper{
					// background-color: black !important;
					margin-right: 10rpx;
				}
			}
		}
	}
	.u-popup__content{
		width: 80vw;
		padding: 40rpx;
		.u-button{
			width: 100rpx !important;
			border: none !important;
			float: right;
			margin-top: 50rpx;
		}
	}
}
</style>