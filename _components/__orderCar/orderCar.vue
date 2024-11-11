<template>
	<uni-drawer ref="drawRef" class="res-drawer" mode="right" :mask-click="true" :mask="true" @change="onChange">
		<scroll-view scroll-y="true" class="h-full">
			<view class="drawer-wrap">
				<view class="left-wrap">
					<view class="o-title">注文したメニュー</view>

					<view class="box border-color-box">
						<view class="table-wrap">
							<uni-table border stripe emptyText="数限りな い根拠" class="res-table">
								<!-- 表头行 -->
								<uni-tr>
									<uni-th align="center">メニュー類別</uni-th>
									<uni-th align="center">メニュー名称</uni-th>
									<uni-th align="left">単価</uni-th>
									<uni-th align="left">数</uni-th>
									<uni-th align="left">トタル</uni-th>
									<uni-th align="left">状態</uni-th>
								</uni-tr>
								<!-- 表格数据行 -->
								<uni-tr>
									<uni-td>2020-10-20</uni-td>
									<uni-td>Jeson</uni-td>
									<uni-td>1</uni-td>
									<uni-td>2</uni-td>
									<uni-td>3</uni-td>
									<uni-td>4</uni-td>
								</uni-tr>
								<uni-tr>
									<uni-td>2020-10-20</uni-td>
									<uni-td>Jeson</uni-td>
									<uni-td>1</uni-td>
									<uni-td>2</uni-td>
									<uni-td>3</uni-td>
									<uni-td>4</uni-td>
								</uni-tr>
								<uni-tr>
									<uni-td>2020-10-20</uni-td>
									<uni-td>Jeson</uni-td>
									<uni-td>1</uni-td>
									<uni-td>2</uni-td>
									<uni-td>3</uni-td>
									<uni-td>4</uni-td>
								</uni-tr>
								<uni-tr>
									<uni-td>2020-10-20</uni-td>
									<uni-td>Jeson</uni-td>
									<uni-td>1</uni-td>
									<uni-td>2</uni-td>
									<uni-td>3</uni-td>
									<uni-td>4</uni-td>
								</uni-tr>
							</uni-table>
						</view>

						<view class="btn-wrap">
							<button type="primary">全部?</button>
							<button type="primary">全部出品</button>
							<button type="primary">オーダーに則証をつく</button>
							<button type="primary">未完成オーダーする</button>
						</view>
					</view>
				</view>
				<view class="right-wrap flex flex-col">
					<view class="o-title">画像でプレビュー</view>
					<view class="shop-detail-gallary border-color-box flex-1 flex items-center justify-center">
						<noDataTip></noDataTip>
					</view>
					<view class="info-wrap">
						<view class="flex">
							席の名称:
							<view class="text-red">1</view>
						</view>
						<view class="flex">
							オーダー済み数:
							<view class="text-red">1</view>
						</view>
						<view class="flex">
							オーダー済み金額:
							<view class="text-red">1</view>
						</view>
						<view class="flex">
							内税額:
							<view class="text-red">1</view>
						</view>
						<view class="flex">
							外稅額:
							<view class="text-red">1</view>
						</view>
						<view class="flex">
							オーダー待ち数:
							<view class="text-red">1</view>
						</view>
						<view class="flex">
							オーダー待ち金額:
							<view class="text-red">1</view>
						</view>
						<view class="flex">
							決済金額:
							<view class="text-red">1</view>
						</view>
						<view class="pay-btn"><button type="primary">オーダーする</button></view>
					</view>
				</view>
			</view>
		</scroll-view>
	</uni-drawer>
</template>

<script setup>
const drawRef = ref();
// import { WatchEffect } from 'vue';
import { watch, ref } from 'vue';

const props = defineProps(['drawRef', 'drawActive', 'modelValue']);
const emits = defineEmits(['update:active']);
const isActive = defineModel('active');

const showDrawer = () => {
	drawRef?.value?.open();
	// emits('update:active', true);
};
const closeDrawer = () => {
	drawRef?.value?.close();
	// emits('update:active', false);
};
watch(isActive, (val) => {
	console.log(val);
	if (val) {
		showDrawer();
	} else {
		closeDrawer();
	}
});
const onChange = (val) => {
	emits('update:active', val);
};
</script>

<style lang="scss" scoped>
@import '@/common/style/var.scss';
.drawer-wrap {
	display: flex;
	padding: 20px;
}
.border-color-box {
	border: 1px solid $primary;
	padding: 10px;
	border-radius: 4px;
}
.o-title {
	text-align: center;
	padding-bottom: 15px;
}
/*left*/
.left-wrap {
	flex: 1;
	display: flex;
	flex-direction: column;
	.box {
		flex: 1;
		display: flex;
		flex-direction: column;
		background: #fff;
		.table-wrap {
			flex: 1;
		}
	}
}
.btn-wrap {
	display: flex;
	margin-top: 15px;
	// justify-content: space-between;
	justify-content: flex-end;
	> button {
		font-size: 14px;
		margin: 0;
	}
	button + button {
		margin-left: 20px;
	}
}
.table-wrap {
	border: 1px solid $primary;
	border-top-width: 5px;
}
/*right*/
.info-wrap {
	padding: 15px 0 0;
}
.pay-btn {
	display: flex;
	justify-content: flex-end;
	padding-top: 15px;

	uni-button {
		font-size: 14px;
		margin: 0;
	}
}
.right-wrap {
	min-width: 200px;
	margin-left: 20px;
	.shop-detail-gallary {
		min-height: 200px;
		background: #fff;
	}
}
</style>
