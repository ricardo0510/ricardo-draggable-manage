import { FileSystemState } from "@/types/models/fileSystem";

export const INITIAL_DATA: FileSystemState = {
  "1": {
    id: "1",
    parentId: "root",
    name: "My Computer",
    type: "app",
    icon: "monitor",
    position: { x: 0, y: 0 },
  },
  "2": {
    id: "2",
    parentId: "root",
    name: "Documents",
    type: "folder",
    icon: "folder",
    position: { x: 0, y: 1 },
  },
  "3": {
    id: "3",
    parentId: "root",
    name: "Google",
    type: "web",
    url: "https://google.com",
    icon: "globe",
    position: { x: 1, y: 0 },
  },
  "4": {
    id: "4",
    parentId: "root",
    name: "Clock Widget",
    type: "widget",
    widgetType: "clock",
    size: "2x1",
    position: { x: 2, y: 0 },
  },
};

// 其他常量
export const APP_NAME = "Admin System";
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
