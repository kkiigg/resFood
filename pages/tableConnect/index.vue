<template>
	<view class="container">
		<baseBackBar title="店舗テーブル番号" back-url="/pages/home/index"></baseBackBar>

		<!-- 轮播 -->
		<swiper class="swiper" :indicator-dots="true" :autoplay="false">
			<swiper-item v-for="(item, pageNum) in swiperObj.swiperNum" :key="pageNum">
				<view class="swiper-box">
					<tabConTableItem
						v-for="(item, idx) in compTableNum(pageNum)"
						class="o-table"
						:item="getItemInArr(pageNum, idx)"
						@click="onClickItem(pageNum, idx)"
					></tabConTableItem>
				</view>
			</swiper-item>

			<view v-if="swiperObj.tableArr.length === 0">
				<view class="h-sub-back flex-center">
					<noDataTip></noDataTip>
				</view>
			</view>
		</swiper>

		<!-- 输入面板 -->
		<baseModal width="260px" height="initial" v-model:show="formData.active">
			<tabConMemberNum :onConfirm="onConfirm" int="true"></tabConMemberNum>
		</baseModal>
	</view>
</template>

<script setup>
import { reactive, onMounted, getCurrentInstance } from 'vue';
import { getEmployTableNum, employSubset, againBinding } from '@/utils/api.js';
import store from '@/store/index.js';
import { PageFrom } from '@/common/enum/order.js';
// 桌子轮播
const TAB_SIZE_IN_SWIPER = 8;

const swiperObj = reactive({
	tableArr: [],
	swiperNum: 0,
	lastPageNum: 0
});

const compTableNum = (pageNum) => {
	const len = swiperObj.tableArr.length;

	if (len === 0) {
		return 0;
	}
	if (pageNum !== swiperObj.swiperNum - 1) {
		return TAB_SIZE_IN_SWIPER;
	} else {
		return len % TAB_SIZE_IN_SWIPER;
	}

	// pageNum===swiperObj.swiperNum?8:swiperObj.lastPageNum
};
const getItemInArr = (pageNum, idx) => {
	const index = pageNum * TAB_SIZE_IN_SWIPER + idx;

	return { ...swiperObj.tableArr[index], index };
};

// 面板输入
const formData = reactive({
	active: false,
	data: {},
	currField: '',
	currFieName: '',
	employpassword: '',
	shopid: ''
});

const queryData = async () => {
	const res = await getEmployTableNum({
		shopid: formData.shopid
	});

	swiperObj.tableArr = res;
	swiperObj.swiperNum = Math.ceil(res.length / TAB_SIZE_IN_SWIPER);
};

const onClickItem = async (pageNum, idx) => {
	const item = getItemInArr(pageNum, idx);
	formData.currField = item.fileid;
	formData.currFieName = item.tablename;
	if (item.tabletype == 1) {
		formData.active = true;
	} else {
		requestAgainBinding();
	}
};

const onConfirm = async (num) => {
	console.log(num);
	formData.active = false;
	if (!num) {
		return;
	}
	requestEmploySubset(Number(num));
};
const requestAgainBinding = async () => {
	await againBinding({
		padmacid: store.state.padmacid,
		fileid: formData.currField
	});
	uni.navigateTo({
		url: `/pages/order/index?fileid=${formData.currField}&tablename=${formData.currFieName}&shopid=${formData.shopid}&from=${PageFrom.assistant}`
	});
};
const requestEmploySubset = async (num) => {
	await employSubset({
		shopid: formData.shopid,
		fileid: formData.currField,
		employpassword: formData.employpassword,
		padmacid: store.state.padmacid,
		type: 1,
		// oldfileid,
		repastnum: num
	});
	let url;
	if (num) {
		url = `/pages/order/index?fileid=${formData.currField}&repastnum=${num}&tablename=${formData.currFieName}&shopid=${formData.shopid}&from=${PageFrom.assistant}`;
	}
	// else {
	// 	url: `/pages/order/index?fileid=${formData.currField}&repastnum=0&tablename=${formData.currFieName}`;
	// }
	uni.navigateTo({
		url
	});
};
onMounted(() => {
	const instance = getCurrentInstance().proxy;
	const eventChannel = instance.getOpenerEventChannel();
	eventChannel.on('sendPsw', (data) => {
		console.log('rec', data);
		formData.employpassword = data.pwd;
		formData.shopid = data.shopid;
		queryData();
	});
});
</script>

<style lang="scss" scoped>
.container {
	height: 100vh;
	display: flex;
	flex-direction: column;
	.swiper-box {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: 1fr 1fr;
		height: 100%;
	}
}
// .o-table {
// 	width: 23%;
// }
.swiper {
	flex: 1;
	padding: 0 20px;
}
</style>
