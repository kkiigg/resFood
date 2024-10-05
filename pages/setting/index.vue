<template>
	<view class="">
		<baseBackBar title="設置" back-url="/pages/home/index">
			<view @click="cancelBind">アンタイド</view>
		</baseBackBar>

		<scroll-view scroll-y="true" scroll-x="false" class="flex-1 h-sub-back">
			<view class="box">
				<uni-forms :modelValue="formData" :rules="formObj.rules" label-width="200" class="o-form">
					<uni-forms-item label="店舗番号" name="shopid">
						<uni-easyinput type="text" v-model="formData.shopid" placeholder="リンクしたいテーブル... -を選択してください" />
					</uni-forms-item>
					<uni-forms-item label="テーブルナンバーとリンクする" name="fileid">
						<uni-data-select v-model="formData.fileid" :localdata="formObj.range"></uni-data-select>
					</uni-forms-item>
					<uni-forms-item label="店長パスワード" name="padpassword">
						<uni-easyinput type="password" v-model="formData.padpassword" placeholder="店長パッド端末パスワードを入力してください" />
					</uni-forms-item>
					<view class="row-submit" @click="onSubmit">
						設置を完成するGO
						<uni-icons type="arrow-right" size="20" class="o-icon"></uni-icons>
					</view>
				</uni-forms>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
import { reactive, ref } from 'vue';
import store from '@/store/index.js';
import { required } from '@/utils/formRules.js';
import { getTableNum, subSet, unbindTable } from '@/utils/api.js';

const formData = reactive({
	fileid: store.state.bindFileid,
	padpassword: '',
	shopid: store.state.shopid
});
const formObj = reactive({
	rules: {
		fileid: {
			rules: [required()]
		},
		padpassword: {
			rules: [required()]
		},
		shopid: {
			rules: [required()]
		}
	},
	range: []
});
const getOptArr = async () => {
	const res = await getTableNum({
		shopid: store.state.shopid
	});

	formObj.range = res.map((item) => {
		return {
			value: item.fileid,
			text: item.tablename
		};
	});
};
getOptArr();

const onSubmit = async () => {
	await subSet({
		...formData,
		...{
			padmacid: store.state.padmacid
		}
	});
	store.commit('SET_BIND_FILEED', formData.fileid);

	const bindTableName = formObj.range.find((item) => item.value === formData.fileid)?.text;

	store.commit('SET_BIND_FILENANE', bindTableName);

	uni.showToast({
		title: '操作が成功しました'
	});
	setTimeout(() => {
		uni.navigateTo({
			url: '/pages/order/index?fileid=' + formData.fileid + '&tablename=' + bindTableName
		});
	}, 1000);
};

//解除绑定
const cancelBind = () => {
	uni.showModal({
		title: '解除を確認しますか？',
		success: async () => {
			await unbindTable({
				padmacid: store.state.padmacid
			});
			store.commit('SET_BIND_FILEED', '');
			store.commit('SET_BIND_FILENANE', '');

			uni.showToast({
				title: '操作が成功しました'
			});
		}
	});
};
</script>

<style lang="scss" scoped>
@import '@/common/style/var.scss';
.box {
	padding: 40px 20px 20px;
	.o-form {
		max-width: 500px;
		margin: 0 auto;
	}
}
.row-submit {
	display: flex;
	justify-content: flex-end;
	// text-align: right;
	padding-top: 20px;
}
.o-icon {
	color: $primary !important;
	margin-left: 2px;
}
</style>
