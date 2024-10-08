import {
	get,
} from '@/utils/request.js'


//获取店铺饭桌（店员操作用）
export const getEmployTableNum = ({
	shopid,
}) => {
	return get({
		url: '/baseAndFoodInfo/getemploytablenum',
		data: {
			shopid,
		}
	});
}

//店员点餐设置桌号和点餐人数
export const employSubset = ({
	shopid,
	fileid,
	employpassword,
	padmacid,
	type,
	oldfileid,
	repastnum
}) => {
	return get({
		url: '/baseAndFoodInfo/employsubset',
		data: {
			shopid,
			fileid,
			employpassword,
			padmacid,
			type,
			oldfileid,
			repastnum

		}
	});
}


//获取店铺饭桌（设备绑定用/客人点菜）
export const getTableNum = ({
	shopid
}) => {
	return get({
		url: '/baseAndFoodInfo/gettablenum',
		data: {
			shopid,
		}
	});
}

//设备设置
export const subSet = ({
	shopid,
	padpassword,
	padmacid,
	fileid
}) => {
	return get({
		url: '/baseAndFoodInfo/subset',
		data: {
			shopid,
			padpassword,
			padmacid,
			fileid
		}
	});
}
//获取店铺content
export const getShopContent = ({
	padmacid
}) => {
	return get({
		url: '/baseAndFoodInfo/getshopcontent',
		data: {
			padmacid
		},
		hideError: true
	});
}

//基本信息（现在app应该用不到）
export const getBaseicData = ({
	fileid,
	padmacid
}) => {
	return get({
		url: '/baseAndFoodInfo/getbaseicdata',
		data: {
			fileid,

			padmacid
		}
	});
}
//食品分类列表
export const getClassifyList = ({
	padmacid
}) => {
	return get({
		url: '/baseAndFoodInfo/getclassifylist',
		data: {
			padmacid
		}
	});
}

//食品分类列表
export const getGoodsList = ({
	padmacid
}) => {
	return get({
		url: '/baseAndFoodInfo/getgoodslist',
		data: {
			padmacid
		}
	});
}

//店员密码检查
export const clerkPasswordCheck = ({
	shopid,
	employpassword,
	padmacid
}) => {
	return get({
		url: '/baseAndFoodInfo/clerkpasswordcheck',
		data: {
			shopid,
			employpassword,
			padmacid
		}
	});
}

//getgoodsdetailservice（使用方法待确定）
export const getGoodsDetailService = ({
	fileid
}) => {
	return get({
		url: '/baseAndFoodInfo/getgoodsdetailservice',
		data: {
			fileid,
		}
	});
}

// 下单
export const placeOrder = ({
	padmacid,
	repastnum,
	foodjson,
	fileid,
	remark
}) => {
	return get({
		url: '/baseAndFoodInfo/placeorder',
		data: {
			padmacid,
			repastnum,
			foodjson,
			fileid,
			remark
		}
	});
}

// 获取订单内容
export const getOrder = ({
	padmacid,
	fileid,
}) => {
	return get({
		url: '/baseAndFoodInfo/getorder',
		data: {
			padmacid,
			fileid,
		}
	});
}

// 解除设备绑定
export const unbindTable = ({
	padmacid,
	fileid,
}) => {
	return get({
		url: '/baseAndFoodInfo/unbindtable',
		data: {
			padmacid,
			fileid,
		}
	});
}

// 结账检查/已结账的话可以清空本地点餐数据  
export const settleAccountsCheck = ({
	orderId,
}) => {
	return get({
		url: '/baseAndFoodInfo/settleAccountsCheck',
		data: {
			order_id: orderId,
		}
	});
}

// 税额计算
export const payMoneyTax = ({
	shopid,
	order_total
}) => {
	return get({
		url: '/baseAndFoodInfo/paymoneytax',
		data: {
			shopid,
			order_total
		}
	});
}

// 重新绑定
export const againBinding = ({
	padmacid,
	fileid
}) => {
	return get({
		url: '/baseAndFoodInfo/againbinding',
		data: {
			padmacid,
			fileid
		},

	});
}