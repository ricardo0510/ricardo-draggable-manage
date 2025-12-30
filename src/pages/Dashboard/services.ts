import { http } from "@/api/request";
import type { DesktopLayout } from "./types";

/**
 * 保存桌面布局
 */
export const saveLayout = (data: DesktopLayout) => {
  return http.post<DesktopLayout>("/desktop/layout", data);
};

/**
 * 获取桌面布局
 */
export const getLayout = () => {
  return http.get<DesktopLayout>("/desktop/layout");
};
