import { http } from '@/api/request'
import type { FileSystemItem } from '@/types'

/**
 * 获取所有文件列表
 */
export const getFiles = () => {
  return http.get<FileSystemItem[]>('/market')
}

/**
 * 获取单个文件详情
 */
export const getFile = (id: string) => {
  return http.get<FileSystemItem>(`/market/${id}`)
}

/**
 * 创建文件/文件夹
 */
export const createFile = (data: Partial<FileSystemItem>) => {
  return http.post<FileSystemItem>('/market', data)
}

/**
 * 更新文件
 */
export const updateFile = (id: string, data: Partial<FileSystemItem>) => {
  return http.patch<FileSystemItem>(`/market/${id}`, data)
}

/**
 * 删除文件
 */
export const deleteFile = (id: string) => {
  return http.delete(`/market/${id}`)
}
