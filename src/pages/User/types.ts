export interface User {
  id: string
  email: string
  role: 'user' | 'admin' | 'developer'
  createdAt: string
  updatedAt: string
}

export interface UserQueryParams {
  page?: number
  pageSize?: number
  email?: string
  role?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface UserListResult {
  total: number
  page: number
  pageSize: number
  data: User[]
}

export interface BatchDeleteParams {
  ids: string[]
}

export interface CreateUserParams {
  email: string
  password: string
  role?: 'user' | 'admin' | 'developer'
}
