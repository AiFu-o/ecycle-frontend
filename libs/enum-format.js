import _ from "lodash";
const defaultText = "[未识别数据]";
const enums = {
	BiddingRecordStatus: [
		{ name: 'BIDDING', title: '竞价中', desc: '竞价中'},
		{ name: 'SUCCESS', title: '竞价成功', desc: '竞价成功'},
		{ name: 'FAIL', title: '竞价失败', desc: '竞价失败'},
		{ name: 'CLOSED', title: '竞价关闭', desc: '竞价关闭'},
	],
	OrderStatus: [
		{ name: 'PENDING_PAYMENT', title: '待支付', desc: '待支付'},
		{ name: 'PAYMENT_ERROR', title: '支付失败', desc: '支付失败'},
		{ name: 'PENDING_VISIT', title: '待上门', desc: '待上门'},
		{ name: 'VISITED', title: '已上门', desc: '已上门'},
		{ name: 'REFUNDED', title: '已上门', desc: '已上门'},
		{ name: 'REFUNDED', title: '已退款', desc: '已退款'},
		{ name: 'PENDING_REVIEW', title: '待评价', desc: '待评价'},
		{ name: 'COMPLETED', title: '已完成', desc: '已完成'},
		{ name: 'CLOSED', title: '竞价关闭', desc: '竞价关闭'},
	],
	CommodityStatus: [
		{ name: 'SELLING', title: '出售中', title2: '竞价中', desc: '出售中'},
		{ name: 'SOLD', title: '已售出', title2: '已成交', desc: '已售出'},
		{ name: 'OFF_SHELF', title: '已下架', title2: '已下架', desc: '已下架'},
	],
};

function getOptionTitle (items, value, _default){
    var item = _.find(items, {name: value});
    return item ? item.title: (_default || defaultText);
}
function getOptionTitle2 (items, value, _default){
    var item = _.find(items, {name: value});
    return item ? (item.title2 || item.title): (_default || defaultText);
}
export function formatEnumToTitle (enumName,value,_default){
	if (!enums[enumName]) {
		return _default || defaultText;
	}
	return getOptionTitle(enums[enumName],value,_default);
};
export function formatEnumToTitle2(enumName,value,_default){
	if (!enums[enumName]) {
		return _default || defaultText;
	}
	return getOptionTitle2(enums[enumName],value,_default);
};