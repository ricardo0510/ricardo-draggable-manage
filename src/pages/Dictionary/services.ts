import { http } from '@/api/request'
import type {
  DictType,
  DictData,
  CreateDictTypeParams,
  UpdateDictTypeParams,
  CreateDictDataParams,
  UpdateDictDataParams,
  BatchCreateParams
} from './types'

// ==================== 字典类型 API ====================

/**
 * 创建字典类型 (管理员)
 */
export const createDictType = (data: CreateDictTypeParams) => {
  return http.post<DictType>('/dictionary/type', data)
}

/**
 * 查询所有字典类型
 */
export const getDictTypes = () => {
  return http.get<DictType[]>('/dictionary/type')
}

/**
 * 按编码查询字典类型
 */
export const getDictTypeByCode = (code: string) => {
  return http.get<DictType>(`/dictionary/type/code/${code}`)
}

/**
 * 更新字典类型 (管理员)
 */
export const updateDictType = (id: string, data: UpdateDictTypeParams) => {
  return http.patch<DictType>(`/dictionary/type/${id}`, data)
}

/**
 * 删除字典类型 (管理员)
 */
export const deleteDictType = (id: string) => {
  return http.delete(`/dictionary/type/${id}`)
}

// ==================== 字典数据 API ====================

/**
 * 创建字典数据 (管理员)
 */
export const createDictData = (data: CreateDictDataParams) => {
  return http.post<DictData>('/dictionary/data', data)
}

/**
 * 按类型编码查询数据
 */
export const getDictDataByCode = (code: string) => {
  return http.get<DictData[]>(`/dictionary/data/code/${code}`)
}

/**
 * 更新字典数据 (管理员)
 */
export const updateDictData = (id: string, data: UpdateDictDataParams) => {
  return http.patch<DictData>(`/dictionary/data/${id}`, data)
}

/**
 * 删除字典数据 (管理员)
 */
export const deleteDictData = (id: string) => {
  return http.delete(`/dictionary/data/${id}`)
}

// ==================== 批量创建 API ====================

/**
 * 批量创建字典 (便捷 API)
 */
export const batchCreateDict = (data: BatchCreateParams) => {
  return http.post('/dictionary/batch', data)
}
