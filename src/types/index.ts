export * from "./models/fileSystem";

// 通用类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface PaginationParams {
  current: number;
  pageSize: number;
}

export interface PaginationResult<T> {
  list: T[];
  total: number;
  current: number;
  pageSize: number;
}
