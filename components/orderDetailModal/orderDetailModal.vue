<template>
	<view>
		<view class="title text-center">
			<text>{{ data.foodname }}</text>
		</view>
		<view class="check-box-wrap">
			<view
				v-for="(item, idx) in data.remarkList"
				:key="data.foodid + idx"
				class="o-check"
				:class="{ 'is-active': isRemarkActive(item.remark) }"
				@click="onClickRemark(item.remark)"
			>
				{{ item.remark }}
			</view>
		</view>
		<view class="ipt-wrap">
			<uni-easyinput type="textarea" v-model="formData.remark" placeholder="请输入内容"></uni-easyinput>
		</view>
		<view class="num-btn-wrap">
			<view class="text-primary">{{ formData.goods_count }}</view>
			<condBtns :onAdd="addHandler" :onSub="subHandler"></condBtns>
		</view>

		<view class="flex justify-between flex-wrap">
			<view class="bg-green o-btn btn-cond" @click="onCancel">キャンセル</view>
			<view class="bg-green o-btn btn-cond" @click="onEnter">確認</view>
		</view>
	</view>
</template>

<script setup>
import { reactive } from 'vue';
import store from '@/store/index.js';

const props = defineProps({
	data: {
		type: Object,
		default() {
			return {};
		}
	},
	closeModel: {
		type: Function,
		default() {}
	},
	onConifrmCb: {
		type: Function,
		default() {}
	}
});

const { data, closeModel, onConifrmCb } = props;
const formData = reactive({
	remarkList: [],
	remark: '',
	goods_count: 1
});

const onClickRemark = (text) => {
	const list = formData.remarkList;
	const existIdx = list.findIndex((item) => item === text);

	if (existIdx >= 0) {
		list.splice(existIdx, 1);
	} else {
		list.push(text);
	}
	// formData.remark = arr.join(SPLIT_STR);
};
const isRemarkActive = (val) => {
	return !!formData.remarkList.find((item) => item === val);
};
// const getCountFromStore = () => {
// 	const cartList = store.state.shopCart;
// 	const existList = cartList.find((item) => item.foodid === data.foodid);
// 	formData.goods_count = existList?.goods_count ?? 0;
// };
// getCountFromStore();

const addHandler = () => {
	formData.goods_count += 1;
};
const subHandler = () => {
	let num = formData.goods_count - 1;
	formData.goods_count = num < 1 ? 1 : num;
};

const onEnter = () => {
	const iptVal = formData.remark.trim();
	const remark = (iptVal == '' ? '' : iptVal + ';') + formData.remarkList.join(';');
	onConifrmCb({
		...data,
		...{
			goods_count: formData.goods_count,
			remark
		}
	});
	closeModel();
};
const onCancel = () => {
	closeModel();
};
</script>

<style lang="scss" scoped>
@import '@/common/style/var.scss';

.content {
	padding: 15px;
}
.title {
	font-size: 18px;
}
.o-btn {
	text-align: center;
	margin-bottom: 8px;
	padding: 4px 0;
	border-radius: 4px;

	&.btn-num {
		width: 24%;
	}
	&.btn-cond {
		width: 48%;
	}
}
.ipt-wrap {
	margin: 15px 0;
}
.num-btn-wrap {
	display: flex;
	justify-content: space-between;
	margin-bottom: 15px;
}
.check-box-wrap {
	padding-top: 15px;
	display: flex;
	flex-wrap: wrap;
	.o-check {
		border: 1px solid $border-color;
		padding: 4px 8px;
		border-radius: 4px;
		margin: 0 8px 8px 0;
		&.is-active {
			border-color: $primary;
			background: $primary;
			color: #fff;
		}
	}
}
</style>
