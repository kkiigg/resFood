<script>
export default {
	onLaunch: function () {
		console.warn('当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！');
		console.log('App Launch');
		const that = this;
		uni.getSystemInfo({
			success(res) {
				that.globalData.statusBarHeight = res.statusBarHeight;
			}
		});
		// #ifndef H5
		plus.screen.lockOrientatio('landscape-primary');
		// #endif
	},
	onShow: function () {
		console.log('App Show');
	},
	onHide: function () {
		console.log('App Hide');
	},
	globalData: {
		statusBarHeight: '' //手机顶部状态栏高度
	}
};
</script>

<style lang="scss">
/*每个页面公共css */
@import '@/uni_modules/uni-scss/index.scss';
/* #ifndef APP-NVUE */
@import '@/static/customicons.css';
// 设置整个项目的背景色
page {
	background-color: #f5f5f5;
}

/* #endif */
.example-info {
	font-size: 14px;
	color: #333;
	padding: 10px;
}
</style>
