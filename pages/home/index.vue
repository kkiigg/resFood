<template>
	<view class="">
		<uni-drawer class="drawer home-drawer" ref="drawRef" mode="left" :mask-click="false" :mask="false" @change="onDrawChange">
			<view class="drawer-wrap">
				<view @click="closeDrawer" class="arrow">
					<uni-icons type="left" size="50" class="text-white"></uni-icons>
				</view>
				<view class="drawer-inner">
					<view class="o-item" @click="linkTo('/pages/setting/index')">
						<view class="icon-wrap">
							<uni-icons type="gear" size="50"></uni-icons>
						</view>

						<view>テーブルナンバー</view>
						<view>とリンクする</view>
					</view>
					<view class="o-item" @click="linkTo('/pages/clerkSetting/index?from=home')">
						<view class="icon-wrap">
							<uni-icons type="contact" size="50"></uni-icons>
						</view>
						<view>從業員操作台</view>
					</view>
					<view class="o-item" @click="linkTo('')">
						<view class="icon-wrap">
							<uni-icons type="shop-filled" size="50"></uni-icons>
						</view>
						<view>レストラン</view>
					</view>
					<view class="o-item" @click="linkTo('')">
						<view class="icon-wrap">
							<uni-icons type="loop" size="50"></uni-icons>
						</view>
						<view>肌色を切り</view>
						<view>替える</view>
					</view>
				</view>
			</view>
		</uni-drawer>
		<view v-if="!drawStatus" @click="showDrawer" class="out-arrow">
			<uni-icons type="right" size="50" class="text-white"></uni-icons>
		</view>

		<swiper class="swiper" circular :indicator-dots="true" :autoplay="true">
			<swiper-item v-for="(item, idx) in galleryArr" :key="idx">
				<view class="flex flex-wrap">
					<image :src="item.fileurl" mode="aspectFill" class="swip-img"></image>
				</view>
			</swiper-item>
		</swiper>
		<view class="access-btn shadow-xl" @click="linkToOrder">
			<view>注文を始</view>
			<view>めます</view>
		</view>
	</view>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { onReady, onShow } from '@dcloudio/uni-app';
import store from '@/store/index.js';

const drawRef = ref();
const drawStatus = ref(true);

const defaultGalleryList = [{ fileurl: '/static/images/bg1.jpg' }, { fileurl: '/static/images/bg2.jpg' }, { fileurl: '/static/images/bg3.jpg' }];
const galleryArr = computed(() => {
	return store.state.shopInfo?.imagelist ?? defaultGalleryList;
});

const showDrawer = () => {
	drawRef.value.open();
};
const closeDrawer = () => {
	drawRef.value.close();
};
const linkTo = (url) => {
	if (!url) return;
	uni.navigateTo({
		url: url
	});
};

const linkToOrder = () => {
	const bindFileid = store.state.bindFileid;
	if (!bindFileid) {
		uni.showToast({
			icon: 'error',
			// 请先绑定设备
			title: 'まずデバイスをバインドしてください'
		});
		return;
	}
	uni.navigateTo({
		url: '/pages/order/index?fileid=' + bindFileid
	});
};
const onDrawChange = (status) => {
	drawStatus.value = status;
};

const setPadmacid = () => {
	let padmacid = '';
	// #ifdef H5
	const hash = window.location.hash;
	const queryIndex = hash.indexOf('?');
	let queryParams = null;
	if (queryIndex !== -1) {
		const queryString = hash.substring(queryIndex + 1);
		queryParams = new URLSearchParams(queryString);
	}
	padmacid = queryParams ? queryParams.get('padmacid') : null;
	console.log('padmacid', padmacid);
	// #endif
	// #ifndef H5
	const deviceInfo = uni.getDeviceInfo();
	padmacid = deviceInfo.deviceId;
	// #endif
	store.commit('SET_PADMACID', padmacid || store.state.padmacid);
	console.log(padmacid, 'padmacid');
};

setPadmacid();

onReady(() => {
	showDrawer();
});
</script>

<style lang="scss" scoped>
@import '@/common/style/var.scss';
.drawer {
	z-index: 9998;
}
.drawer-wrap {
	position: relative;
	color: #fff;

	.o-item {
		text-align: center;
		font-size: 14px;
	}
	.arrow {
		position: absolute;
		right: 2px;
		top: 50%;
		transform: translateY(-50%);
	}
	.drawer-inner {
		height: 100vh;
		background: rgba(0, 0, 0, 0.3);
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}
}
.out-arrow {
	position: fixed;
	left: -12px;
	top: 50%;
	padding-left: 10px;
	transform: translateY(-50%);
	z-index: 1000;
	background: rgba(0, 0, 0, 0.3);
	border-radius: 30%;
}
.swiper {
	height: 100vh;
	position: relative;
}
.swip-img {
	width: 100%;
	height: 100vh;
}
.access-btn {
	position: fixed;
	right: 60px;
	bottom: 60px;
	width: 100px;
	height: 100px;
	font-size: 18px;
	border: 1px dashed #fff;
	outline: 8px solid $deep-blue;
	background: $light-blue;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	color: #fff;
	z-index: 9999;
	animation: scale 2s infinite;
	animation-direction: alternate;
}
.icon-wrap {
	width: 60px;
	border: 1px dashed #fff;
	border-radius: 4px;
	background: $light-blue;
	outline: 6px solid $deep-blue;
	margin: 0 auto 10px;
	> .uni-icons {
		color: #fff !important;
	}
}
@keyframes scale {
	from {
		outline: 8px solid $deep-blue;
	}
	to {
		outline: 17px solid $deep-blue;
	}
}
</style>
