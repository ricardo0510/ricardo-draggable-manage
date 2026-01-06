export type ITEM_TYPE_APP = 'app'
export type ITEM_TYPE_FOLDER = 'folder'
export type ITEM_TYPE_WEB = 'web'
export type ITEM_TYPE_WIDGET = 'widget'

export type ItemType = ITEM_TYPE_APP | ITEM_TYPE_FOLDER | ITEM_TYPE_WEB | ITEM_TYPE_WIDGET

export type WidgetSize = '1x1' | '1x2' | '2x1' | '2x2'

export interface FileSystemItem {
  id: string
  parentId: string | 'root' // 'root' represents the desktop
  name: string
  type: ItemType
  content?: string // If file/app, text content
  icon?: string // Custom icon path
  position?: { x: number; y: number } // Grid or pixel position
  url?: string // If web, the URL
  size?: WidgetSize // If widget, the size
  // Component specific fields
  widgetType?: 'clock' | 'calendar' | 'weather'
}

export type FileSystemState = Record<string, FileSystemItem>
