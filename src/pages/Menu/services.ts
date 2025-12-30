import { http } from "@/api/request";
import type {
  Category,
  CategoryQueryParams,
  CategoryListResult,
  BatchDeleteParams,
  CreateCategoryParams,
} from "./types";

/**
 * 获取分类列表(分页)
 */
export const getCategoryList = (params: CategoryQueryParams) => {
  return http.get<CategoryListResult>("/menu/query", { params });
};

/**
 * 创建分类
 */
export const createCategory = (data: CreateCategoryParams) => {
  return http.post<Category>("/menu", data);
};

/**
 * 更新分类
 */
export const updateCategory = (id: string, data: Partial<Category>) => {
  return http.patch<Category>(`/menu/${id}`, data);
};

/**
 * 删除分类
 */
export const deleteCategory = (id: string) => {
  return http.delete(`/menu/${id}`);
};

/**
 * 批量删除分类
 */
export const batchDeleteCategories = (params: BatchDeleteParams) => {
  return http.post("/menu/batch-delete", params);
};
