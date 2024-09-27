import {BASE_URL} from '/utils/env'
const defaultOptions = {
  timeout: 15000,
  dataType: 'json',
  header: {
    'content-type': 'application/json',
  },
};
const TOKEN_KEY = 'token';

const LOGIN_INVALID_CODE_LIST = ['INVALID_TOKEN', 'EXPIRED_TOKEN'];
// TODO Z
const SUCCESS = 'SUCCESS';
const LOADING_DELAY = 50; // 50ms 延迟
let loadingTimer;

const handleURL = (request) => {
  const { url } = request;
  if (!/https|http/.test(url)) {
    request.url = url.startsWith('/')
      ? `${BASE_URL}${url}`
      : `${BASE_URL}/${url}`;
  }
};

// const handleToken = (request) => {
//   const token = uni.getStorageSync(TOKEN_KEY);
//   if (token) {
//     request.header.Authorization = token;
//   }
// };

const showLoading = () => {
  uni.showLoading({
	// TODO Z
    title: 'Loading',
  });
};

const hideLoading = () => {
  uni.hideLoading();
};

uni.addInterceptor('request', {
  invoke: function (config) {
    if (config.loading) {
      loadingTimer = setTimeout(showLoading, LOADING_DELAY);
    }
    handleURL(config);
  //   handleToken(config);
  },
  success(res) {
    const { data: resData } = res;
    const { code, message } = resData;
    if (code !== SUCCESS) {
      // 如果响应代码在登录无效代码列表中
      // if (LOGIN_INVALID_CODE_LIST.includes(code)) {
      //   uni.showToast({
      //     title: message,
      //     icon: 'none',
      //   });
      //   uni.navigateTo({
      //     url: '/pages/login/login',
      //   });
      //   return;
      // } else {
        // 处理其他错误代码
        return Promise.reject(resData);
      }
    }
    return Promise.resolve(resData);
  },
  complete() {
    clearTimeout(loadingTimer);
    hideLoading();
  },
});

const wrapRequest = ({
  url = '',
  data = {},
  method = 'GET',
  header = {},
  loading = true,
} = {}) => {
  return uni.request({
    ...defaultOptions,
    url,
    data,
    method,
    loading,
    header: {
      ...defaultOptions.header,
      ...header,
    },
  });
};

export const get = (params) => wrapRequest({ ...params, method: 'GET' });
export const post = (params) => wrapRequest({ ...params, method: 'POST' });
export const put = (params) => wrapRequest({ ...params, method: 'PUT' });
export const del = (params) => wrapRequest({ ...params, method: 'DELETE' });