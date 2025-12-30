export interface MarketApp {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "productivity" | "games" | "widgets";
  type: "widget" | "link" | "app";
  widgetType?: string;
  defaultSize?: string;
  url?: string;
  price: number;
  installCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MarketQueryParams {
  category?: string;
  search?: string;
}
