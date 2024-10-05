<template>
	<view class="o-card shadow-xl">
		<view class="pic-wrap">
			<image mode="aspectFill" :src="data.imagelist?.[0]?.fileurl" class="o-img" :id="imgId" lazy-load></image>
			<view v-show="foodNum > 0" class="o-badage">{{ foodNum }}</view>
		</view>
		<view class="content">
			<view class="title">{{ data.foodname }}</view>
			<view class="bot-row">
				<view class="price-view">{{ data.price }} {{ data.unitname }}</view>
				<!-- <condBtns :onAdd="onAdd" :onSub="onSub"></condBtns> -->
				<uni-icons type="cart" size="30" class="cart-icon" @click="onClickItem"></uni-icons>
			</view>
		</view>
		<uni-popup ref="refDialog" type="dialog">
			<uni-popup-dialog ref="inputClose" mode="input" title="输入内容" value="对话框预置提示内容!" placeholder="请输入内容" @confirm="dialogInputConfirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script setup>
import { computed, ref } from 'vue';
// import { EMIT_EVENT_ADD_CART_SP_EFFECT } from '@/common/enum/order.js';
import store from '@/store/index.js';

const props = defineProps(['data', 'btnDisabled', 'onClickCard', 'onAddFoodToCart']);
const { data, btnDisabled, onClickCard, onAddFoodToCart } = props;

const refDialog = ref();
const onAdd = () => {};
const onSub = () => {};
const imgId = ref('f' + data.foodid + parseInt(Math.random() * 100000000));

const foodNum = computed(() => {
	return store.state.shopCart.find((item) => item.foodid === data.foodid)?.goods_count ?? 0;
});

const onClickItem = () => {
	if (btnDisabled) return;
	// showOrderDetailModal();
	onClickCard(data, imgId.value, () => {
		// addCartSpEffect();
		// onAddFoodToCart();
	});
};
</script>

<style lang="scss" scoped>
@import '@/common/style/var.scss';
.o-card {
	border-radius: 4px;
	display: flex;
	flex-direction: column;
	border: 1px solid $border-color;
	border-radius: 6px;
	overflow: hidden;
}
.content {
	padding: 15px;
	flex: 1;
	display: flex;
	flex-direction: column;
}
.title {
	font-size: 18px;
	text-align: left;
	flex: 1;
}

.bot-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-top: 20px;
	font-size: 16px;
}
.price-view {
	padding-right: 10px;
	color: $text-color-2;
}
.cart-icon {
	color: $text-color-3 !important;
}
.pic-wrap {
	position: relative;
	padding-bottom: 70%;
	.o-img {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
	}
	.o-badage {
		position: absolute;
		left: 6px;
		bottom: 10px;
		background: #fff;
		border: 2px solid $red;
		border-radius: 50%;
		// padding: 3px 8px;
		width: 24px;
		height: 24px;
		line-height: 24px;
		font-size: 14px;
		color: $red;
		min-width: 10px;
	}
}
</style>
