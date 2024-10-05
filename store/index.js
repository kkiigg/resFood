import {
	createStore
} from 'vuex'
import {
	getStorageJson
} from '@/utils/storage.js'
const store = createStore({
	state: {
		shopInfo: null,
		// shopInfo 格式：
		//         "shopname": "北京老飯店　みらい平店",
		//         "imagelist": [
		//             {
		//                 "filetype": "P",
		//                 "fileurl": "http://3lb79528nz34.vicp.fun/ForwardORDER/uploadFiles/uploadImageShop/1668336198398.jpg",
		//                 "fileid": "C537A218-1031-4E10-8715-A0D2B96D9173"
		//             }
		//         ],

		shopid: "005",
		padmacid: uni.getStorageSync('padmacid') ?? "",
		// 绑定的桌号（持久化）
		bindFileid: uni.getStorageSync('bindFileid') ?? "",
		bindTableName: uni.getStorageSync('bindTableName') ?? "",
		// 当前进入点餐页面的桌子信息（持久化,每次进入order重新设置）
		currOrderObj: getStorageJson('currOrderObj') || {
			fileid: '',
			tablename: '',
			repastnum: null
		},
		shopCart: [],

	},
	mutations: {
		SET_SHOP_INFOSET_SHOPID(state, val) {
			state.shopInfo = val
		},
		SET_SHOPID(state, val) {
			state.shopid = val
		},
		SET_PADMACID(state, val) {
			state.padmacid = val
			uni.setStorage({
				key: 'padmacid',
				data: val,
			});
		},
		SET_BIND_FILEED(state, val) {
			state.bindFileid = val
			uni.setStorage({
				key: 'bindFileid',
				data: val,
			});
		},
		SET_BIND_FILENANE(state, val) {
			state.bindTableName = val
			uni.setStorage({
				key: 'bindTableName',
				data: val,
			});
		},
		CLEAR_BIND_INFO(state) {
			state.bindFileid = ''
			state.bindTableName = ''
			uni.setStorage({
				key: 'bindFileid',
				data: '',
			});
			uni.setStorage({
				key: 'bindTableName',
				data: '',
			});
		},
		SET_CURR_ORDER_OBJ(state, payload) {
			state.currOrderObj = payload
			uni.setStorage({
				key: 'currOrderObj',
				data: JSON.stringify(payload),
			});
		},

		/* 购物车 */
		// 添加
		ADD_SHOP_CART(state, data) {
			// 	fooddata,
			// 	goods_count,
			// 	remark,
			// 	ifwait
			const {
				foodid,
				remark
			} = data
			const existItem = state.shopCart.find(item => item.foodid === foodid && item.remark === remark)
			const addNum = data?.goods_count ?? 1

			if (!!existItem) {
				existItem.goods_count += addNum
			} else {
				state.shopCart.push({
					...{
						goods_count: addNum
					},
					...{
						...data
					},
				})
			}

		},
		// 清空
		CLEAR_SHOP_CART(state) {
			state.shopCart = []
		},
		// 设置数量
		SET_SHOPCART_GOOD_COUNT(state, payload) {
			const {
				index,
				num,
			} = payload
			state.shopCart[index].goods_count = Number(num)
		},
	}
})

export default store