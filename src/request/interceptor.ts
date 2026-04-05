import { message } from 'antd'
import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { getToken } from '../utils/storage'
import type { ApiResponse } from './types'

export function attachRequestInterceptors(instance: AxiosInstance) {
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  })
}

export function attachResponseInterceptors(instance: AxiosInstance) {
  instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse<unknown>>) => response,
    (error: AxiosError<ApiResponse<null>>) => {
      const errorMessage =
        error.response?.data?.message || error.message || '请求失败，请稍后重试'

      message.error(errorMessage)
      return Promise.reject(error)
    },
  )
}
