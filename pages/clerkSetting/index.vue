<template>
	<view class="container">
		<baseBackBar title="從業員操作台" :back-url="getBackUrl()"></baseBackBar>
		<view class="box">
			<uni-forms ref="formRef" :modelValue="formData" :rules="formObj.rules" label-width="200" class="o-form">
				<uni-forms-item label="店舗番号" name="shopid">
					<uni-easyinput type="text" v-model="formData.shopid" placeholder="リンクしたいテーブル... -を選択してください" />
				</uni-forms-item>
				<uni-forms-item label="從業員パスワード" name="employpassword">
					<uni-easyinput type="password" v-model="formData.employpassword" autocomplete="off" placeholder="從業員パッド端末パスワードを入力してください" />
				</uni-forms-item>
				<view class="row-submit" @click="onSubmit">
					設置を完成するGO
					<uni-icons type="arrow-right" size="20" class="o-icon"></uni-icons>
				</view>
			</uni-forms>
		</view>
	</view>
</template>

<script setup>
import { reactive, ref } from 'vue';
// import { onReady } from '@dcloudio/uni-app';
import { onLoad } from '@dcloudio/uni-app';
import store from '@/store/index.js';
import { clerkPasswordCheck } from '@/utils/api';
import { required } from '@/utils/formRules.js';

const formRef = ref();

const formData = reactive({
	shopid: '',
	employpassword: '',
	padmacid: store.state.padmacid
});

const formObj = reactive({
	rules: {
		shopid: {
			rules: [required()]
		},
		employpassword: {
			rules: [required()]
		}
	}
});

const fromRef = ref('');

const FROM_ENUMS = {
	order: {
		submitUrl: '/pages/home/index',
		backUrl: `/pages/order/index?fileid=${store.state.currOrderObj.fileid}&tablename=${store.state.currOrderObj.tablename}`
	},
	home: {
		submitUrl: '/pages/tableConnect/index',
		backUrl: '/pages/home/index'
	}
};

const onSubmit = () => {
	formRef.value
		.validate()
		.then(async (res) => {
			const params =
				fromRef.value === 'order'
					? {
							...formData,
							...{
								padmacidold: store.state.padmacid,
								fileidold: store.state.currOrderObj.fileid
							}
					  }
					: formData;
			if (fromRef.value === 'order') {
				await clerkPasswordCheck(params);
				// store.commit('CLEAR_BIND_INFO');
			}

			uni.navigateTo({
				url: FROM_ENUMS[fromRef.value]?.submitUrl ?? '/pages/home/index',
				success(res) {
					res.eventChannel.emit('sendPsw', { pwd: formData.employpassword, shopid: formData.shopid });
				}
			});
		})
		.catch((err) => {
			console.log('表单错误信息：', err);
		});
};
const getBackUrl = () => {
	return FROM_ENUMS[fromRef.value]?.backUrl ?? '/pages/home/index';
};
onLoad((opt) => {
	const from = opt?.from;
	fromRef.value = from;
});
</script>

<style lang="scss" scoped>
@import '@/common/style/var.scss';
.container {
	width: 100%;
}
.box {
	padding: 40px 20px 20px;
	.o-form {
		max-width: 500px;
		margin: 0 auto;
	}
}
.row-submit {
	text-align: right;
	padding-top: 20px;
}
.o-icon {
	color: $primary !important;
	margin-left: 2px;
}
</style>
