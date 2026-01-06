export interface Category {
  id: string
  name: string
  description?: string
  icon?: string
  color?: string
  createdAt: string
  updatedAt: string
}

export interface CategoryQueryParams {
  page?: number
  pageSize?: number
  name?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface CategoryListResult {
  total: number
  page: number
  pageSize: number
  data: Category[]
}

export interface BatchDeleteParams {
  ids: string[]
}

export interface CreateCategoryParams {
  name: string
  description?: string
  icon?: string
  color?: string
}
