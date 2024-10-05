<template>
	<view class="btn-wrap">
		<view class="o-btn">
			<view class="grid-icon grid22" @click="btnAHandler">
				<view v-for="item in 4" class="blk-2"></view>
			</view>
		</view>
		<view class="o-btn">
			<view class="grid-icon grid33" @click="btnBHandler">
				<view v-for="item in 9" class="blk-3"></view>
			</view>
		</view>
	</view>
</template>

<script setup>
const props = defineProps(['onBtnA', 'onBtnB']);
const btnAHandler = props.onBtnA || function () {};
const btnBHandler = props.onBtnB || function () {};
</script>

<style lang="scss" scoped>
.btn-wrap {
	border: 1px solid #fff;
	border-radius: 16px;
	display: flex;
	// justify-content: space-between;
	color: #fff;
	.o-btn {
		padding: 2px 15px;
		font-size: 20px;
	}
	.o-btn + .o-btn {
		border-left: 1px solid #fff;
	}
}

.grid-icon {
	display: grid;
	grid-row-gap: 2px;
	grid-column-gap: 2px;
}
.grid22 {
	grid-template-columns: 1fr 1fr 1fr;
}
.grid33 {
	grid-template-columns: 1fr 1fr 1fr;
}
.blk-2 {
}
.blk-3 {
}
</style>
