import {
	createStore
} from 'vuex'
import {
	getStorageJson
} from '@/utils/storage.js'
const store = createStore({
	state: {
		// shopInfo 格式：
		//         "shopname": "北京老飯店　みらい平店",
		//         "imagelist": [
		//             {
		//                 "filetype": "P",
		//                 "fileurl": "http://3lb79528nz34.vicp.fun/ForwardORDER/uploadFiles/uploadImageShop/1668336198398.jpg",
		//                 "fileid": "C537A218-1031-4E10-8715-A0D2B96D9173"
		//             }
		//         ],
		shopInfo: null,
		padmacid: uni.getStorageSync('padmacid') || "",
		// 目前绑定的信息（通过/pages/set/index）
		shopid: uni.getStorageSync('shopid') || "", // 店铺信息
		bindFileid: uni.getStorageSync('bindFileid') || "", // 桌号
		bindTableName: uni.getStorageSync('bindTableName') ?? "", // 桌子名称
		// 当前进入点餐页面的桌子信息（持久化,每次进入order重新设置）
		currOrderObj: getStorageJson('currOrderObj') || {
			shopid: '',
			fileid: '',
			tablename: '',
			repastnum: null,
			from: '' // 从哪个入口进来（不包括从购物车来的）
		},
		shopCart: [],
		// 从业员密码state暂存
		clerkSettingState: {
			employpassword: '',
			shopid: ''
		},

	},
	mutations: {
		SET_SHOP_INFOSET_SHOPID(state, val) {
			state.shopInfo = val
		},
		SET_SHOPID(state, val) {
			state.shopid = val
			uni.setStorage({
				key: 'shopid',
				data: val,
			});
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
			state.shopid = ''
			uni.removeStorage({
				key: 'bindFileid',
			});
			uni.removeStorage({
				key: 'bindTableName',
			});
			uni.removeStorage({
				key: 'shopid',
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
		// FORCE_SET_SHOPCART_GOOD_COUNT(state, payload) {
		// 	// 在SET_SHOPCART_GOOD_COUNT不更新视图时使用这个
		// 	const {
		// 		index,
		// 		num,
		// 	} = payload
		// 	const newItem = {
		// 		...state.shopCart[index],
		// 		...{
		// 			goods_count: Number(num)
		// 		}
		// 	}
		// 	state.shopCart.splice(index, 1, newItem)
		// 	console.log(state.shopCart[index].goods_count)
		// },
		DROP_SHOPCART_ITEM_BY_IDX(state, index) {
			state.shopCart.splice(index, 1)
		},
		SET_CLEAR_SETTING_STATE(state, {
			employpassword,
			shopid
		} = {
			employpassword: '',
			shopid: ''
		}) {
			state.clerkSettingState = {
				employpassword,
				shopid
			}
		},
	}
})

export default store