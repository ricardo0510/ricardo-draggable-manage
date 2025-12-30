import { getToken } from "@/utils/storage";
import type { ApiResponse } from "@/types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

interface RequestConfig extends RequestInit {
  params?: Record<string, any>;
}

/**
 * 封装的fetch请求
 */
async function request<T = any>(
  url: string,
  config: RequestConfig = {}
): Promise<T> {
  const { params, headers, ...restConfig } = config;

  // 处理查询参数
  let fullUrl = BASE_URL + url;
  if (params) {
    const queryString = new URLSearchParams(params).toString();
    fullUrl += `?${queryString}`;
  }

  // 设置请求头
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  const token = getToken();
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(fullUrl, {
      ...restConfig,
      headers: {
        ...defaultHeaders,
        ...headers,
      },
    });

    const result: ApiResponse<T> = await response.json();

    // 处理业务状态码
    if (result.code === 0) {
      return result.data as T; // 自动解包 data 字段
    } else if (result.code === 401) {
      // 未授权,清除 token 并跳转登录
      localStorage.removeItem("access_token");
      window.location.href = "/login";
      throw new Error(result.msg || "未授权,请重新登录");
    } else {
      // 其他业务错误
      throw new Error(result.msg || "请求失败");
    }
  } catch (error) {
    console.error("Request error:", error);
    throw error;
  }
}

export const http = {
  get: <T = any>(url: string, config?: RequestConfig) =>
    request<T>(url, { ...config, method: "GET" }),

  post: <T = any>(url: string, data?: any, config?: RequestConfig) =>
    request<T>(url, {
      ...config,
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: <T = any>(url: string, data?: any, config?: RequestConfig) =>
    request<T>(url, {
      ...config,
      method: "PUT",
      body: JSON.stringify(data),
    }),

  patch: <T = any>(url: string, data?: any, config?: RequestConfig) =>
    request<T>(url, {
      ...config,
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: <T = any>(url: string, config?: RequestConfig) =>
    request<T>(url, { ...config, method: "DELETE" }),
};
