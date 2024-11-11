<template>
	<view class="btn-wrap">
		<view class="o-btn" @click="subHandler">-</view>
		<view class="o-btn" @click="addHandler">+</view>
	</view>
</template>

<script setup>
const props = defineProps(['onAdd', 'onSub']);
const addHandler = props.onAdd || function () {};
const subHandler = props.onSub || function () {};
</script>

<style lang="scss" scoped>
.btn-wrap {
	border: 1px dashed $primary;
	border-radius: 4px;
	display: flex;
	// justify-content: space-between;
	color: $primary;
	.o-btn {
		padding: 2px 15px;
		font-size: 20px;
	}
	.o-btn + .o-btn {
		border-left: 1px dashed $primary;
	}
}
</style>
