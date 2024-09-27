<template>
	<view class="container">
		{{a}}
	</view>
</template>

<script setup>
	import { ref } from 'vue'
	import { onReady } from '@dcloudio/uni-app'
	
	const a=ref(1)
</script>

<style>
	.container {
		padding: 20px;
		font-size: 14px;
		line-height: 24px;
	}
</style>
