<template>
	<view>
		<baseBackBar title="ショッピングカート" :back-url="'/pages/order/index?from=cart&fileid=' + pageObj.fileid">
			<!-- <view @click="onResOrder">オーダー決済</view> -->
		</baseBackBar>

		<scroll-view scroll-y="true" class="h-sub-back">
			<view class="content-wrap">
				<view class="left-wrap">
					<view class="o-title">注文したメニュー</view>

					<view class="box border-color-box shadow-xl">
						<view class="table-wrap">
							<uni-table border stripe emptyText="数限りな い根拠" class="res-table">
								<!-- 表头行 -->
								<uni-tr>
									<uni-th align="center">メニュー類別</uni-th>
									<uni-th align="center">メニュー名称</uni-th>
									<uni-th align="left">単価</uni-th>
									<uni-th align="left">数</uni-th>
									<uni-th align="left">トタル</uni-th>
									<uni-th align="left">状態</uni-th>
								</uni-tr>
								<!-- 表格数据行 -->
								<uni-tr v-for="(item, idx) in shopCartList" :key="item.foodid">
									<uni-td>{{ item.classtwoname || item.classonename }}</uni-td>
									<uni-td>{{ item.foodname }}</uni-td>
									<uni-td>{{ item.price }} {{ item.unitname }}</uni-td>
									<uni-td>
										<view class="num-box-wrap">
											<view v-if="Number(item.status) === 1">{{ Number(item.goods_count) }}</view>
											<uni-number-box v-else v-model="item.goods_count" @change="onGoodCountChange($event, idx)"></uni-number-box>
										</view>
									</uni-td>
									<uni-td>{{ Number(item.price ?? 0) * Number(item.goods_count ?? 0) }} 円</uni-td>
									<uni-td>
										<view class="o-status" :class="{ 'is-active': Number(item.status) === 1 }">{{ orderStatusFilter(item.status) }}</view>
									</uni-td>
								</uni-tr>
							</uni-table>
						</view>

						<!-- <view class="btn-wrap">
							<button type="primary">全部?</button>
							<button type="primary">全部出品</button>
							<button type="primary">オーダーに則証をつく</button>
							<button type="primary">未完成オーダーする</button>
						</view> -->
					</view>
				</view>
				<view class="right-wrap flex flex-col">
					<view class="o-title">画像でプレビュー</view>
					<view class="shop-detail-gallary border-color-box shadow-xl flex items-center justify-center">
						<scroll-view v-if="shopCartList.length > 0" scroll-y="true" class="scroll-view">
							<view class="detail-box">
								<view v-for="(item, idx) in shopCartList" :key="item.foodid" class="img-wrap">
									<image :src="item.imagelist?.[0]?.fileurl" mode="aspectFill"></image>
								</view>
							</view>
						</scroll-view>

						<noDataTip v-if="shopCartList.length === 0" class="no-data-tip"></noDataTip>
					</view>
					<view class="info-wrap flex-1">
						<view class="flex">
							席の名称:
							<view class="text-red">{{ store.state.currOrderObj?.tablename }}</view>
						</view>

						<view class="flex">
							<!--  已下订单数量 -->
							オーダー済み数:
							<view class="text-red">{{ rightDataComputed.list2Num }}</view>
						</view>
						<view class="flex">
							<!-- 已下订单金额 -->
							オーダー済み金額:
							<view class="text-red">{{ rightDataComputed.list2Total }} 円</view>
						</view>
						<view class="flex">
							内税額:
							<view class="text-red">{{ taxObj.internalTaxAmount }} 円</view>
						</view>
						<view class="flex">
							外稅額:
							<view class="text-red">{{ taxObj.externalTaxAmount }} 円</view>
						</view>
						<view class="flex">
							<!-- 待处理订单数量 -->
							オーダー待ち数:
							<view class="text-red">{{ rightDataComputed.list1Num }}</view>
						</view>
						<view class="flex">
							<!-- 待处理订单金额 -->
							オーダー待ち金額:
							<view class="text-red">{{ rightDataComputed.list1Total }} 円</view>
						</view>
						<view class="flex">
							決済金額:
							<view class="text-red">{{ rightDataComputed.list1Total }} 円</view>
						</view>
						<view class="pay-btn"><button type="primary" @click="sendOrder">オーダーする</button></view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
import { reactive, computed, watch } from 'vue';
import store from '@/store/index.js';
import { placeOrder, getOrder, settleAccountsCheck, payMoneyTax } from '@/utils/api.js';
import { onLoad } from '@dcloudio/uni-app';
const EnumOrderStatus = {
	0: '未注文', // 未下单
	1: '注文済み' // 已下单
};
const orderStatusFilter = (val) => {
	return EnumOrderStatus[val] ?? EnumOrderStatus[0];
};

const pageObj = reactive({
	fileid: store.state.currOrderObj?.fileid,
	repastnum: store.state.currOrderObj?.repastnum,
	orderFoodList: [],
	orderid: ''
});

const shopCartList = computed(() => {
	const formatOrderList = pageObj.orderFoodList.map((item) => ({
		...item,
		...{
			imagelist: [{ fileurl: item.food_pic }],
			price: item.goods_price
		}
	}));
	const arr = [...store.state.shopCart, ...formatOrderList].map((item) => {
		const totalPrice = Number(item.price ?? 0) * Number(item.goods_count ?? 0);
		return {
			...item,
			totalPrice
		};
	});
	return arr;
});

// 右侧数据

const rightDataComputed = computed(() => {
	const oriList = shopCartList.value;
	console.log(oriList);

	const shopcartList = oriList.filter((item) => item.status != 1);
	const list1Num = shopcartList.reduce((total, item) => total + Number(item.goods_count), 0);
	const list1Total = shopcartList.reduce((total, item) => total + Number(item.totalPrice), 0);

	const orderedList = oriList.filter((item) => item.status == 1);
	const list2Num = orderedList.reduce((total, item) => total + Number(item.goods_count), 0);
	const list2Total = orderedList.reduce((total, item) => total + Number(item.totalPrice), 0);

	return {
		list1Num,
		list1Total,
		list2Num,
		list2Total
	};
});
// 获取税额
// let ApiTimer = null;
const taxObj = reactive({
	externalTaxAmount: 0,
	internalTaxAmount: 0
});

const getPayMonTax = async (orderTotal) => {
	if (!orderTotal) return;
	const res = await payMoneyTax({
		shopid: store.state.shopid,
		order_total: orderTotal
	});
	taxObj.externalTaxAmount = res.externalTaxAmount;
	taxObj.internalTaxAmount = res.internalTaxAmount;
};
watch(
	rightDataComputed,
	(nv, ov) => {
		if (nv?.list2Total !== ov?.list2Total) {
			getPayMonTax(nv?.list2Total);
		}
	},
	{
		immediate: true,
		deep: true
	}
);

// 数量变化回调
const onGoodCountChange = (num, index) => {
	store.commit('SET_SHOPCART_GOOD_COUNT', { num, index });
};

// 下单
const sendOrder = async () => {
	let foodjson = '';
	const foodArr = store.state.shopCart.map((item) => {
		const { foodid, goods_count, remark } = item;
		return {
			foodid,
			goods_count,
			remark,
			ifwait: 'N'
		};
	});
	foodjson = JSON.stringify(foodArr);
	await placeOrder({
		padmacid: store.state.padmacid,
		fileid: pageObj.fileid,
		repastnum: pageObj.repastnum,
		foodjson
	});
	await requestGetOrder();
	store.commit('CLEAR_SHOP_CART');

	uni.showToast({
		title: '注文に成功しました'
	});
	playSound();
};
const playSound = () => {
	const audioContext = uni.createInnerAudioContext();
	audioContext.src = '/static/sound/crisp_alert_sound.mp3';
	audioContext.play();
	audioContext.onEnded(() => {
		audioContext.destroy(); // 播放结束后销毁音频上下文
	});
};

const requestGetOrder = async () => {
	const res = await getOrder({
		padmacid: store.state.padmacid,
		fileid: pageObj.fileid
	});

	pageObj.orderFoodList = res?.foodlist;
	pageObj.orderid = res?.order_id ?? '';
};

// 订单结算
const onResOrder = async () => {
	uni.showModal({
		title: '確認しますか？',
		success: async (res) => {
			if (res.confirm) {
				await settleAccountsCheck({
					orderId: pageObj.orderid
				});
				uni.showToast({
					title: '操作が成功しました'
				});
			}
		}
	});
};

onLoad((opt) => {
	requestGetOrder();
});
</script>

<style lang="scss" scoped>
.content-wrap {
	display: flex;
	padding: 20px;
}
.border-color-box {
	border: 1px solid $primary;
	padding: 10px;
	border-radius: 4px;
}
.o-title {
	text-align: center;
	padding-bottom: 15px;
}
/*left*/
.left-wrap {
	flex: 1;
	display: flex;
	flex-direction: column;
	.box {
		flex: 1;
		display: flex;
		flex-direction: column;
		background: #fff;
		.table-wrap {
			flex: 1;
			td,
			th {
				text-align: center !important;
			}
			.o-status {
				color: $red;
				&.is-active {
					color: $primary;
				}
			}
		}
	}
	.num-box-wrap {
		display: flex;
		justify-content: center;
	}
}
.btn-wrap {
	display: flex;
	margin-top: 15px;
	// justify-content: space-between;
	justify-content: flex-end;
	> button {
		font-size: 14px;
		margin: 0;
	}
	button + button {
		margin-left: 20px;
	}
}
.table-wrap {
	border: 1px solid $primary;
	border-top-width: 5px;
}
/*right*/
.info-wrap {
	padding: 15px 0 0;
	.text-red {
		padding-left: 10px;
	}
	> .flex {
		padding: 6px 0;
	}
}
.pay-btn {
	display: flex;
	justify-content: flex-end;
	padding-top: 15px;

	uni-button {
		font-size: 14px;
		margin: 0;
	}
}
.right-wrap {
	min-width: 200px;
	margin-left: 20px;
	.shop-detail-gallary {
		background: #fff;
		.scroll-view {
			height: 240px;
		}
		.no-data-tip {
			height: 200px;
		}
	}
}
.detail-box {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-row-gap: 10px;
	grid-column-gap: 10px;
	width: 100%;
	.img-wrap {
		image {
			width: 100%;
			height: 80px;
		}
	}
}
@media screen and (max-width: 430px) {
	.content-wrap {
		display: block;
		// padding: 20px;
	}
	.right-wrap {
		margin-top: 20px;
		margin-left: 0;
	}
}
</style>
