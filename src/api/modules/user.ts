import { http } from "../request";
import type { LoginParams, LoginResult } from "../types";

/**
 * 用户登录
 */
export const login = (params: LoginParams) => {
  return http.post<LoginResult>("/auth/login", params);
};

/**
 * 用户登出
 */
export const logout = () => {
  return http.post("/auth/logout");
};

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  return http.get("/user/info");
};
