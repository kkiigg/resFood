import {
	md5
} from './md5.js'
// #ifdef H5
const BASE_URL = '/ForwardORDER'
// #endif
// #ifndef H5
const BASE_URL = 'http://3lb79528nz34.vicp.fun/ForwardORDER'
// #endif

const defaultOptions = {
	timeout: 30000,
	dataType: 'json',
	header: {
		'content-type': 'application/json',
	},
};
// const TOKEN_KEY = 'token';
// const LOGIN_INVALID_CODE_LIST = ['INVALID_TOKEN', 'EXPIRED_TOKEN'];

const SUCCESS = 'SUCCESS';
const LOADING_DELAY = 50; // 50ms 延迟
let loadingTimer;
let loadingCount = 0

const handleURL = (request) => {
	// const {
	// 	url
	// } = request;
	// if (!/https|http/.test(url)) {
	// 	request.url = url.startsWith('/') ?
	// 		`${BASE_URL}${url}` :
	// 		`${BASE_URL}/${url}`;
	// }
	request.url = `${BASE_URL}${request.url}`
};

// const handleToken = (request) => {
//   const token = uni.getStorageSync(TOKEN_KEY);
//   if (token) {
//     request.header.Authorization = token;
//   }
// };

const showLoading = () => {
	loadingCount++
	uni.showLoading({
		title: 'Loading',
	});
};

const hideLoading = () => {
	loadingCount--
	if (loadingCount === 0) {
		uni.hideLoading();
	}

};

uni.addInterceptor('request', {
	invoke: function(config) {
		if (config.loading) {
			loadingTimer = setTimeout(showLoading, LOADING_DELAY);
		}
		handleURL(config);
		//   handleToken(config);
	},
	success(res) {
		const {
			data: resData
		} = res;
		const {
			data,
			msg,
			result,
			resultcode
		} = resData
		console.log(data,
			msg,
			result,
			resultcode)

		if (resultcode !== 1) {
			uni.showToast({
				title: msg,
				icon: 'error',
			});
			return Promise.reject(msg);
		}
		return Promise.resolve(data);
	},
	complete() {
		clearTimeout(loadingTimer);
		hideLoading();
	},
});

const padLeft0 = (val) => {
	return String(val).padStart(2, '0')
}
const getDateStr = () => {
	const date = new Date()
	const y = date.getFullYear()
	const mon = padLeft0(date.getMonth() + 1)
	const d = padLeft0(date.getDate())
	// const h = padLeft0(date.getHours())
	// const min = padLeft0(date.getMinutes())
	// const s = padLeft0(date.getSeconds())
	// return `${y}-${mon}-${d} ${h}:${min}:${s}`
	return `${y}${mon}${d}`
}

const wrapRequest = ({
	url = '',
	data = {},
	method = 'GET',
	header = {},
	loading = true,
} = {}) => {
	const s = getDateStr()
	return uni.request({
		...defaultOptions,
		url,
		data: {
			...data,
			...{
				FKEY: md5('USERNAME' + s + ',fh,')
			}
		},
		method,
		loading,
		header: {
			...defaultOptions.header,
			...header,
		},
	});
};

export const get = (params) => wrapRequest({
	...params,
	method: 'GET'
});
export const post = (params) => wrapRequest({
	...params,
	method: 'POST'
});
export const put = (params) => wrapRequest({
	...params,
	method: 'PUT'
});
export const del = (params) => wrapRequest({
	...params,
	method: 'DELETE'
});