/**
 * 格式化日期
 */
export const formatDate = (
  date: Date | string,
  format: string = "YYYY-MM-DD HH:mm:ss"
): string => {
  // 这里可以使用dayjs
  return new Date(date).toLocaleString();
};

/**
 * 格式化文件大小
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

/**
 * 格式化数字
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};
