<template>
	<view class="container-full">
		<baseBackBar
			:title="store.state.shopInfo?.shopname ?? '北京老饭店本店'"
			:left-text="store.state.currOrderObj?.from === pageObj.PageFrom.assistant ? null : '從業員'"
			:on-left-text-click="onLeftTextClick"
		>
			<!-- <view class="flex">
				<uni-icons type="search" size="30" style="color: #fff" class="arrow1"></uni-icons>
				<viewNumBtns></viewNumBtns>
			</view> -->
		</baseBackBar>

		<view class="box flex-1 overflow-hidden">
			<view class="wrap-left shadow-xl">
				<scroll-view class="left-scroll-wrap" :scroll-y="true" scroll-x="false">
					<uni-collapse accordion class="res-collapse">
						<uni-collapse-item
							v-for="(item, idx) in dataObj.menuList"
							:key="item.classone"
							:title="item.classonename"
							:class="{ 'is-active': item.classone === dataObj.active }"
							@click.stop="onPickMenu(item)"
						>
							<view
								v-for="(item2, idx2) in item.classtwolist"
								:key="`${item.classone}-${item2.classtwo}`"
								class="menu-wrap"
								:class="{ 'is-active': item2.classtwo === dataObj.active }"
								@click.stop="onPickMenu(item2.classtwo)"
							>
								{{ item2.classtwoname }}
							</view>
						</uni-collapse-item>
					</uni-collapse>
				</scroll-view>
				<view class="shop-cart-title shadow-xl" @click="linkToCart">
					<uni-badge size="small" :text="shopCartTotal" absolute="rightTop" type="error">
						<uni-icons type="cart-filled" size="30" class="cart-icon"></uni-icons>
					</uni-badge>

					ショッピングカート
				</view>
			</view>

			<scroll-view class="wrap-right" :scroll-y="true" scroll-x="false" :lower-threshold="50" @scrolltolower="rightListDataLoad">
				<noDataTip v-if="rightPageObj.showList.length === 0" style="padding-top: 50px"></noDataTip>

				<view class="food-wrap">
					<orderListCard
						v-for="(item, index) in rightPageObj.showList"
						class="food-card"
						:key="item.foodid"
						:data="item"
						:on-click-card="onClickCard"
						:on-add-food-to-cart="onAddFoodToCart"
					></orderListCard>
					<!-- :showOrderDetailModal="() => showOrderDetailModal(item)" -->
				</view>
			</scroll-view>
		</view>

		<baseModal width="400px" height="initial" v-model:show="orderDetailModalObj.active">
			<orderDetailModal :data="orderDetailModalObj.data" :closeModel="() => (orderDetailModalObj.active = false)" :onConifrmCb="onAddFoodToCart"></orderDetailModal>
		</baseModal>
		<!--<view class="fixed-btn-wrap" @click="drawActive = true">
			<uni-badge class="uni-badge-left-margin" :text="10" absolute="rightTop" size="small">
				<uni-icons type="cart" size="30" style="color: #fff"></uni-icons>
			</uni-badge>

			<view class="fake-icon-wrap">
				<uni-icons type="left" size="30" style="color: #fff" class="arrow1"></uni-icons>
				<uni-icons type="left" size="30" style="color: #fff" class="arrow2"></uni-icons>
			</view>
		</view>
		 <orderCar v-model:active="drawActive"></orderCar> -->
		<image v-for="item in cartEffectObj.transiImgList" :key="item.id" :src="item.imgSrc" :style="item.style" class="sp-effect" :class="{ 'is-hide': !item.active }"></image>
	</view>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { onBeforeUnmount } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getClassifyList, getGoodsList, getShopContent } from '@/utils/api.js';
import store from '@/store/index.js';
import { PageFrom } from '@/common/enum/order.js';

const pageObj = reactive({
	fileid: '',
	tableName: '',
	PageFrom
});

// 左上角返回按钮
const onLeftTextClick = () => {
	if (store.state.currOrderObj?.from === PageFrom.assistant) {
		uni.navigateTo({
			url: '/pages/tableConnect/index'
		});
		return;
	}
	uni.navigateTo({
		url: '/pages/clerkSetting/index?from=order'
	});
};

// left
const dataObj = reactive({
	menuList: [],
	active: null
});
const getMenuList = async () => {
	const res = await getClassifyList({
		padmacid: store.state.padmacid
	});
	dataObj.menuList = res;
	dataObj.active = dataObj.menuList?.[0]?.classone ?? '';
};
// getMenuList();

const onPickMenu = (data) => {
	let id = '';
	if (typeof data !== 'string') {
		// 点击1级分类
		if (data?.classtwolist?.length > 0) {
			id = data?.classtwolist[0]?.classtwo;
		} else {
			id = data?.classone;
		}
	} else {
		// 点击2级分类
		id = data;
	}
	dataObj.active = id;
	console.log(id);
	console.log(dataObj.active);
	initRightPageObj(id);
};

//左下角购物车
const shopCartObj = ref(store.state.shopCart);
const shopCartTotal = computed(() => {
	return store.state.shopCart.reduce((total, item) => total + item.goods_count, 0);
});
const linkToCart = () => {
	uni.navigateTo({
		url: '/pages/shopCart/index'
	});
};
// right
// TODO如有性能问题可以用虚拟滚动，目前数据量不大
const pageSize = 12;
const rightPageObj = reactive({
	// 所有的数据列表 (废弃)
	// foodList: [],
	// 每个分类id下的数据列表
	filteredList: [],
	// 根据分页展示的数据列表
	showList: [],
	pageFoodIndex: 1
});

const getFoods = async () => {
	const res = await getGoodsList({
		padmacid: store.state.padmacid
	});
	rightPageObj.foodList = res ?? [];
};
const getFoodsById = async (id) => {
	const res = await getGoodsList({
		padmacid: store.state.padmacid,
		category_id: id
	});
	// rightPageObj.foodList = res ?? [];
	console.log(res);
	return res ?? [];
};

const initRightPageObj = async (id) => {
	rightPageObj.pageFoodIndex = 0;
	rightPageObj.showList = [];
	// rightPageObj.filteredList = rightPageObj.foodList.filter((item) => item.classtwo === dataObj.active || item.classone === dataObj.active);
	const res = await getFoodsById(id);
	rightPageObj.filteredList = res;
	rightListDataLoad();
};

const rightListDataLoad = () => {
	if (rightPageObj.pageFoodIndex >= rightPageObj.filteredList.length) {
		return;
	}
	rightPageObj.showList = [...rightPageObj.showList, ...rightPageObj.filteredList.slice(rightPageObj.pageFoodIndex, rightPageObj.pageFoodIndex + pageSize)];
	rightPageObj.pageFoodIndex += pageSize;
};

// 页面初始化
const initPageRequest = async () => {
	// await Promise.all([getFoods(), getMenuList()]);
	await getMenuList();
	await initRightPageObj(dataObj.active);
};

// 点击添加到购物车按钮
const orderDetailModalObj = reactive({ active: false, data: {}, imgId: '' });
const onClickCard = (data, imgId, callback) => {
	orderDetailModalObj.imgId = imgId;
	orderDetailModalObj.data = data;
	if (data.remarkList.length) {
		showOrderDetailModal();
	} else {
		// callback();
		onAddFoodToCart();
	}
};
// 显示添加商品参数蒙层
const showOrderDetailModal = (data) => {
	orderDetailModalObj.active = true;
};

// 添加到购物车函数
const onAddFoodToCart = (changedData) => {
	addCartSpEffect(orderDetailModalObj.imgId);
	const d = changedData ? changedData : orderDetailModalObj.data;
	store.commit('ADD_SHOP_CART', {
		...d
	});
};

// 添加到购物车特效
const cartEffectObj = reactive({
	active: false,
	imgSrc: '',
	style: '',
	transiImgList: []
});

const addCartSpEffect = () => {
	const query = uni.createSelectorQuery().in(this);
	query
		.select('#' + orderDetailModalObj.imgId)
		.boundingClientRect((d) => {
			const { left, top, width, height } = d;
			const imgSrc = orderDetailModalObj.data.imagelist?.[0]?.fileurl;

			addCartEffect({
				left,
				top,
				width,
				height,
				imgSrc
			});
		})
		.exec();
};

let clearTimer;
const clearEffectImgList = () => {
	// 清除垃圾数据
	clearTimer = setTimeout(() => {
		cartEffectObj.transiImgList = [];
	}, 5000); // 这个时间不能比css transition-duration长
};
const addCartEffect = (data) => {
	clearTimeout(clearTimer);
	clearEffectImgList();
	const { left, top, imgSrc, width, height } = data;
	const idx = cartEffectObj.transiImgList.length;
	cartEffectObj.transiImgList.push({
		imgSrc,
		style: `left:${left}px;top:${top}px;width:${width}px;height:${height}px;opacity:1;transform:rotate(0)`,
		active: true
	});

	setTimeout(() => {
		cartEffectObj.transiImgList[idx].style = 'left:25px;top:calc(100vh - 10px);width:40px;height:40px;opacity:0.4;transform:rotate(720deg)';
		setTimeout(() => {
			cartEffectObj.transiImgList[idx].active = false;
		}, 700);
	}, 300);
};

// 需求：在点餐时获取店铺信息
const requestShopContent = async () => {
	try {
		const res = await getShopContent({
			padmacid: store.state.padmacid,
			fileid: store.state.currOrderObj.fileid
		});
		store.commit('SET_SHOP_INFOSET_SHOPID', res);
	} catch (e) {
		console.log(e);
	}
};

// lifecycles
onLoad((opt) => {
	const isFromCart = opt?.from === 'cart';

	if (!isFromCart) {
		// 非购物车来的
		pageObj.fileid = opt?.fileid ?? store.state.bindFileid;
		pageObj.tablename = opt.tableName;

		store.commit('SET_CURR_ORDER_OBJ', {
			shopid: opt.shopid || store.state.shopid,
			fileid: pageObj.fileid,
			tablename: opt.tablename,
			repastnum: opt?.repastnum,
			from: opt?.from
		});
		// if (pageObj.fileid !== store.state.currOrderObj?.fileid) {
		store.commit('CLEAR_SHOP_CART');
		requestShopContent();
		// }
	} else {
		// 购物车跳转来的
		pageObj.fileid = store.state.currOrderObj?.fileid;
		pageObj.tablename = store.state.currOrderObj?.tablename;
	}

	initPageRequest();
});
</script>

<style lang="scss" scoped>
@import '@/common/style/var.scss';
.box {
	padding: 20px 0 0;
	display: flex;
}
.wrap-left {
	$cartH: 64px;
	width: 180px;
	padding-bottom: $cartH;
	position: relative;
	padding-right: 10px;
	.shop-cart-title {
		position: absolute;
		width: 100%;
		height: $cartH;
		// line-height: $cartH;
		border-top: 1px solid $border-color;
		border-bottom: 1px solid $border-color;
		background-color: $primary;
		color: #fff;
		display: flex;

		align-items: center;
		font-weight: bold;
		text-align: center;
		border-radius: 0 12px 0 0;
		font-size: 14px;
		.cart-icon {
			color: $red !important;
			margin-right: 6px;
		}
		.cart-icon-wrap {
			height: 40px;
		}
	}

	.left-scroll-wrap {
		height: 100%;
	}
}
.menu-wrap {
	font-size: 16px;
}
.wrap-right {
	flex: 1;
	padding: 0 20px 20px;
	border-left: 1px solid $border-color;
	text-align: center;
	.food-wrap {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-column-gap: 15px;
		grid-row-gap: 15px;

		justify-content: space-between;
		// .food-card {
		// 	widoth: 31%;
		// }
	}
}
@media screen and (max-width: 430px) {
	.wrap-left {
		width: 140px;
	}
	.wrap-right {
		.food-wrap {
			grid-template-columns: 1fr;
		}
	}
}
.sp-effect {
	transition: all 1s;
	position: fixed;
	&.is-hide {
		display: none !important;
	}
}
// @keyframes addCartSpEffect{
// 	from{
// 		transform: scale(1) rotate(0);
// 	}
// 	to{
// 		transform: scale(1) rotate(0);
// 	}
// }
// .fixed-btn-wrap {
// 	position: fixed;
// 	right: 0;
// 	top: 50%;
// 	transform: translateY(-50%);
// 	padding: 10px;
// 	padding-top: 30px;
// 	border: 1px dashed #fff;
// 	border-radius: 4px;
// 	background: $light-blue;
// 	outline: 6px solid $deep-blue;
// 	width: 30px;
// 	color: #fff;
// }
// .fake-icon-wrap {
// 	position: relative;
// 	height: 30px;
// 	> * {
// 		position: absolute;
// 		left: 0;
// 		top: 0;
// 	}
// 	.arrow1 {
// 		transform: translateX(-5px);
// 	}
// 	.arrow2 {
// 		transform: translateX(5px);
// 	}
// }
</style>
