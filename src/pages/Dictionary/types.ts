/**
 * 字典类型实体
 */
export interface DictType {
  id: string
  code: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

/**
 * 字典数据实体
 */
export interface DictData {
  id: string
  typeId: string
  label: string
  value: string
  order?: number
  createdAt: string
  updatedAt: string
}

/**
 * 创建字典类型参数
 */
export interface CreateDictTypeParams {
  code: string
  name: string
  description?: string
}

/**
 * 更新字典类型参数
 */
export interface UpdateDictTypeParams {
  code?: string
  name?: string
  description?: string
}

/**
 * 创建字典数据参数
 */
export interface CreateDictDataParams {
  typeId: string
  label: string
  value: string
  order?: number
}

/**
 * 更新字典数据参数
 */
export interface UpdateDictDataParams {
  label?: string
  value?: string
  order?: number
}

/**
 * 批量创建字典项
 */
export interface BatchCreateItem {
  label: string
  value: string
}

/**
 * 批量创建字典参数
 */
export interface BatchCreateParams {
  code: string
  name: string
  items: BatchCreateItem[]
}
