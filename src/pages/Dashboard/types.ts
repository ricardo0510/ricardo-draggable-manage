export interface DesktopLayout {
  desktopOrder: string[]
  folderOrders: {
    [folderId: string]: string[]
  }
}
