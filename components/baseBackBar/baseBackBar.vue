<template>
	<view
		class="wrap bg-green round-bottom flex justify-between items-center shadow-xl"
		:style="{
			'margin-top': safeTop + 'px'
		}"
	>
		<view v-if="!leftText" @click="linkTo">
			<image src="@/static/images/back.png" style="width: 20px; height: 15px; padding-left: 15px" mode="aspectFit"></image>
		</view>
		<view v-else class="left-text" @click="onClickLeftText">
			{{ leftText }}
		</view>

		<text class="title">{{ title }}</text>
		<view><slot /></view>
	</view>
</template>

<script setup>
import { ref, useSlots } from 'vue';
const { title, backUrl, leftText, onLeftTextClick } = defineProps(['title', 'backUrl', 'leftText', 'onLeftTextClick']);

const safeTop = ref(getApp().globalData.statusBarHeight);

const onClickLeftText = () => {
	if (onLeftTextClick) {
		onLeftTextClick();
	} else {
		linkTo();
	}
};
const linkTo = () => {
	if (!backUrl) {
		uni.navigateBack();
		return;
	}
	uni.navigateTo({
		url: backUrl
	});
};
</script>

<style scoped>
.round-bottom {
	border-radius: 0 0 8px 8px;
}
.wrap {
	height: 64px;
	position: relative;
	padding-right: 20px;
}
.left-text {
	padding-left: 15px;
	font-size: 16px;
}
.title {
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	max-width: 70%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 16px;
}
</style>
