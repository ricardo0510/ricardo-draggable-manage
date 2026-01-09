import { http } from '@/api/request'
import type { MarketApp, MarketAppCreateDto, MarketAppUpdateDto, MarketQueryParams } from '@/types'

/**
 * 获取应用市场列表
 */
export const getMarketApps = (params?: MarketQueryParams) => {
  return http.get<MarketApp[]>('/market', { params })
}

/**
 * 获取单个应用详情
 */
export const getMarketApp = (id: string) => {
  return http.get<MarketApp>(`/market/${id}`)
}

/**
 * 创建应用 (管理员)
 */
export const createMarketApp = (data: MarketAppCreateDto) => {
  return http.post<MarketApp>('/market', data)
}

/**
 * 更新应用 (管理员)
 */
export const updateMarketApp = (id: string, data: MarketAppUpdateDto) => {
  return http.patch<MarketApp>(`/market/${id}`, data)
}

/**
 * 删除应用 (管理员)
 */
export const deleteMarketApp = (id: string) => {
  return http.delete<{ id: string; title: string; message: string }>(`/market/${id}`)
}
