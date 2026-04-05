import axios from 'axios'
import {
  attachRequestInterceptors,
  attachResponseInterceptors,
} from './interceptor'

export const request = axios.create({
  baseURL: '/api',
  timeout: 10_000,
})

attachRequestInterceptors(request)
attachResponseInterceptors(request)
