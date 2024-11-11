<template>
	<view class="box flex flex-col items-center justify-center" @click="onClick">
		<view>
			{{ item.tablename }}
		</view>
		<image src="@/static/images/1537493809416.png" class="o-img" mode="aspectFit"></image>
		<view :class="[item.tabletype == 1 ? 'text-red ' : 'text-primary', 'status']">{{ item.tabletype == 1 ? '待機中' : '食事中' }}</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';

const { item } = defineProps(['item']);

//暂时不用
const onClick = () => {};
// const formatTitle = (name) => {
// 	return String(name).padStart(2, '0');
// };
</script>
<style lang="scss" scoped>
.box {
	padding: 24px 0;
	font-size: 18px;
	.o-img {
		width: 100%;
		height: 100px;
		margin-bottom: 14px;
	}
}

.status {
	font-size: 18px;
}
</style>
