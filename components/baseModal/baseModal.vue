<template>
	<view v-if="show" class="container" @click="closeModal">
		<view
			class="box round-3xl"
			:style="{
				width,
				height
			}"
			@click.stop="() => {}"
		>
			<slot />
		</view>
	</view>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
	show: Boolean,
	width: String,
	height: String
});
const emits = defineEmits(['update:show']);

const closeModal = () => {
	emits('update:show', false);
};
</script>

<style lang="scss" scoped>
@import '@/common/style/var.scss';

.container {
	background: rgba(0, 0, 0, 0.3);
	position: fixed;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 9999;
}
.box {
	max-width: 90%;
	height: 90%;
	width: 80%;
	heitgh: 80%;
	overflow: auto;
	border: 1px solid $border-color;
	padding: 15px;
	background: #fff;
}
</style>
