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
): Promise<ApiResponse<T>> {
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

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
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

  delete: <T = any>(url: string, config?: RequestConfig) =>
    request<T>(url, { ...config, method: "DELETE" }),
};
