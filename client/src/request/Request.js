import axios from 'axios';

// 创建 axios 实例
const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 获取 token
    const token = localStorage.getItem('token');

    // 如果存在 token，则自动添加到请求头
    if (token) {
      config.headers.Authorization = token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 直接返回后端返回的数据
    return response.data;
  },
  (error) => {
    // HTTP 状态码
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.log('登录状态失效，请重新登录');
          localStorage.removeItem('token');
          break;

        case 403:
          console.log('没有权限访问');
          break;

        case 404:
          console.log('请求地址不存在');
          break;

        case 500:
          console.log('服务器内部错误');
          break;

        default:
          console.log('请求失败');
      }
    }

    return Promise.reject(error);
  },
);

export default request;
