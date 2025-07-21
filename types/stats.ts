export interface MenuItem {
  id: number;
  name: string;
  price: string;
  promotion: string;
}
export interface RestaurantStats {
  order_count: number;
  menu_item_id: number;
  menu_item: MenuItem | null;
  item_count: number;
  revenue: number;
}
export interface StatsResponse {
  statusCode: number;
  message: string;
  data: RestaurantStats;
}