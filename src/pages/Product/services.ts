import { http } from "@/api/request";
import type { FileSystemItem } from "@/types";
import type { MarketApp, MarketQueryParams } from "./types";

/**
 * 获取应用市场列表
 */
export const getMarketApps = (params?: MarketQueryParams) => {
  return http.get<MarketApp[]>("/market", { params });
};

/**
 * 获取应用详情
 */
export const getMarketApp = (id: string) => {
  return http.get<MarketApp>(`/market/${id}`);
};

/**
 * 安装应用
 */
export const installApp = (id: string) => {
  return http.post<FileSystemItem>(`/market/${id}/install`);
};
