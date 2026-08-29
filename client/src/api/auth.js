import request from '../request/Request.js';

export function login(payload) {
  return request.post('/user/login', payload);
}

export function register(payload) {
  return request.post('/user/reg', payload);
}

export function getRequestErrorMessage(error) {
  return error.response?.data?.info || error.message || '请求失败，请稍后重试';
}
