<template>
	<view class="container">
		<orderLeftMenu></orderLeftMenu>
		{{a}}
	</view>
</template>

<script setup>
	import { ref } from 'vue'
	import { onReady } from '@dcloudio/uni-app'
	import store from '@/store/index.js'
	
	const a=ref(store.state.test)
	
	onReady(()=>{
		// uni.request({
		// 	url:'/web/video/v2/getVideoList.json'
		// })
	})
</script>

<style>
	.container {
		padding: 20px;
		font-size: 14px;
		line-height: 24px;
	}
</style>
