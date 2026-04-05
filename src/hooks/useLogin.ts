import { useMutation } from '@tanstack/react-query'
import { message } from 'antd'
import { login, type LoginParams } from '../api/auth'

export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginParams) => login(payload),
    onSuccess: () => {
      message.success('登录成功')
    },
  })
}
