import request from '../request/Request.js';

export function updateProfile(payload) {
  return request.post('/user/update', payload);
}
