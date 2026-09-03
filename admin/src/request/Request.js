import axios from 'axios'
import { clearAuthSession, getAuthToken } from '../utils/authSession.js'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

request.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) config.headers.Authorization = token
  return config
})

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) clearAuthSession()
    return Promise.reject(error)
  },
)

export default request
