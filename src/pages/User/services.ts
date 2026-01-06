import { http } from '@/api/request'
import type { User, UserQueryParams, UserListResult, BatchDeleteParams, CreateUserParams } from './types'

/**
 * 获取用户列表(分页)
 */
export const getUserList = (params: UserQueryParams) => {
  return http.get<UserListResult>('/user/query', { params })
}

/**
 * 创建用户
 */
export const createUser = (data: CreateUserParams) => {
  return http.post<User>('/user', data)
}

/**
 * 更新用户
 */
export const updateUser = (id: string, data: Partial<User>) => {
  return http.patch<User>(`/user/${id}`, data)
}

/**
 * 删除用户
 */
export const deleteUser = (id: string) => {
  return http.delete(`/user/${id}`)
}

/**
 * 批量删除用户
 */
export const batchDeleteUsers = (params: BatchDeleteParams) => {
  return http.post('/user/batch-delete', params)
}
