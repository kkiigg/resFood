<template>
	<view>
		<view class="title text-center">
			<text>利用人数</text>
		</view>
		<view class="num-wrap round-xl">{{ peopleNum }}</view>
		<view class="flex justify-between flex-wrap">
			<view v-for="(item, idx) in numArr" :key="idx" class="bg-green o-btn btn-num" @click="onEnterNum(idx)">
				{{ item }}
			</view>
		</view>
		<view class="flex justify-between flex-wrap">
			<view class="bg-green o-btn btn-cond" @click="onCancel">キャンセル</view>
			<view class="bg-green o-btn btn-cond" @click="onEnter">確認</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps(['onConfirm']);
const { onConfirm } = props;

const arrNumTen = new Array(9).fill(null).map((item, idx) => idx + 1);
const numArr = [...arrNumTen, 0, '.', '削除'];

const peopleNum = ref('0');

const onEnterNum = (idx) => {
	if (peopleNum.value == '0') {
		peopleNum.value = '';
	}
	if (idx < 9) {
		//1-9
		peopleNum.value += String(idx + 1);
	} else if (idx === 9) {
		// 0
		peopleNum.value += '0';
	} else if (idx === 10) {
		//TODO Z 这玩意没用吧 人数怎么会有小数
		if (peopleNum.value.indexOf('.') < 0) {
			peopleNum.value += '.';
			if (peopleNum.value === '.') {
				peopleNum.value = '0.';
			}
		}
	} else if (idx === 11) {
		// 删除
		const slcieRes = peopleNum.value.slice(0, -1);
		peopleNum.value = slcieRes || '0';
	}
};

const onEnter = () => {
	onConfirm(peopleNum.value);
};
const onCancel = () => {
	onConfirm();
};
</script>

<style lang="scss" scoped>
@import '@/common/style/var.scss';

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

.num-wrap {
	border: 1px solid $border-color;
	margin-bottom: 8px;
	padding: 4px;
}
.title {
	padding-bottom: 20px;
}
</style>
