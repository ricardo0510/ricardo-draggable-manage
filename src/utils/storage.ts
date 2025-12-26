/**
 * 本地存储封装
 */
const PREFIX = "admin_";

export const storage = {
  get: <T = any>(key: string): T | null => {
    try {
      const item = localStorage.getItem(PREFIX + key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (error) {
      console.error("Storage set error:", error);
    }
  },

  remove: (key: string): void => {
    localStorage.removeItem(PREFIX + key);
  },

  clear: (): void => {
    localStorage.clear();
  },
};

// Token相关
export const TOKEN_KEY = "token";

export const getToken = (): string | null => storage.get(TOKEN_KEY);
export const setToken = (token: string): void => storage.set(TOKEN_KEY, token);
export const removeToken = (): void => storage.remove(TOKEN_KEY);
