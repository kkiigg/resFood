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
		<baseModal width="260px" height="initial" v-model:show="peopleNumObj.active">
			<tabConMemberNum :onConfirm="onConfirm" int="true"></tabConMemberNum>
		</baseModal>
	</view>
</template>

<script setup>
import { reactive, onMounted, getCurrentInstance } from 'vue';
import { getEmployTableNum, employSubset } from '@/utils/api.js';
import store from '@/store/index.js';

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

const queryData = async () => {
	const res = await getEmployTableNum({
		shopid: store.state.shopid
	});

	swiperObj.tableArr = res;
	swiperObj.swiperNum = Math.ceil(res.length / TAB_SIZE_IN_SWIPER);
};
queryData();

// 面板输入
const peopleNumObj = reactive({
	active: false,
	data: {},
	currField: '',
	currFieName: '',
	employpassword: ''
});
const onClickItem = async (pageNum, idx) => {
	const item = getItemInArr(pageNum, idx);
	peopleNumObj.currField = item.fileid;
	peopleNumObj.currFieName = item.tablename;
	if (item.tabletype == 1) {
		peopleNumObj.active = true;
	} else {
		requestEmploySubset(0);
	}
};
const onConfirm = async (num) => {
	console.log(num);
	peopleNumObj.active = false;
	if (!num) {
		return;
	}
	requestEmploySubset(Number(num));
};
const requestEmploySubset = async (num) => {
	await employSubset({
		shopid: store.state.shopid,
		fileid: peopleNumObj.currField,
		employpassword: peopleNumObj.employpassword,
		padmacid: store.state.padmacid,
		type: 1,
		// oldfileid,
		repastnum: num
	});
	let url;
	if (num) {
		url = `/pages/order/index?fileid=${peopleNumObj.currField}&repastnum=${num}&tablename=${peopleNumObj.currFieName}`;
	} else {
		url: `/pages/order/index?fileid=${peopleNumObj.currField}&repastnum=0&tablename=${peopleNumObj.currFieName}`;
	}
	uni.navigateTo({
		url
	});
};
onMounted(() => {
	const instance = getCurrentInstance().proxy;
	const eventChannel = instance.getOpenerEventChannel();
	eventChannel.on('sendPsw', (data) => {
		console.log('rec', data);
		peopleNumObj.employpassword = data.pwd;
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
