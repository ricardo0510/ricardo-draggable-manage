export type MarketAppType = 'widget' | 'link' | 'app'

export interface MarketApp {
  id: string
  title: string
  description: string
  icon: string
  category?: string
  type: MarketAppType
  widgetType?: string
  defaultSize?: string
  url?: string
  price: number
  installCount: number
  createdAt: string
  updatedAt: string
}

export interface MarketAppCreateDto {
  title: string
  description: string
  icon: string
  category?: string
  type: MarketAppType
  widgetType?: string
  defaultSize?: string
  url?: string
  price?: number
}

export interface MarketAppUpdateDto extends Partial<MarketAppCreateDto> {}

export interface MarketQueryParams {
  category?: string
  search?: string
}
