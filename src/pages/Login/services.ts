import { http } from "@/api/request";
import type { LoginParams, LoginResult } from "./types";

/**
 * 用户登录
 */
export const login = (params: LoginParams) => {
  return http.post<LoginResult>("/auth/login", params);
};
