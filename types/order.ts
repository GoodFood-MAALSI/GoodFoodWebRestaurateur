export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  item: {
    id: number;
    name: string;
    price: number;
    picture?: string;
  };
  selectedOptions: {
    id: number;
    name: string;
    selectedValues: {
      id: number;
      name: string;
      extra_price: number;
    }[];
  }[];
}
export interface DetailedOrderItem {
  id: number;
  order_id: number;
  menu_item_id: number;
  quantity: number;
  unit_price: string;
  notes: string;
  selected_option_value_ids: string[];
  menu_item: {
    id: number;
    name: string;
    price: string;
    promotion: string;
  };
  menu_item_option_values: {
    id: number;
    name: string;
    extra_price: string;
  }[];
}
export interface OrderStatus {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}
export interface OrderClient {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}
export interface OrderRestaurantImage {
  id: number;
  filename: string;
  path: string;
  mimetype: string;
  size: number;
  isMain: boolean;
  restaurant_id: number;
  menu_item_id: number | null;
  entityType: string;
  created_at: string;
}
export interface OrderRestaurant {
  id: number;
  name: string;
  street_number: string;
  street: string;
  city: string;
  postal_code: string;
  country: string;
  email: string;
  phone_number: string;
  long: string;
  lat: string;
  images: OrderRestaurantImage[];
}
export interface OrderDeliverer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
}
export interface Order {
  id: number;
  client_id: number;
  restaurant_id: number;
  deliverer_id: number | null;
  status_id: number;
  description: string;
  subtotal: string;
  delivery_costs: string;
  service_charge: string;
  global_discount: string;
  street_number: string;
  street: string;
  city: string;
  postal_code: string;
  country: string;
  long: string;
  lat: string;
  created_at: string;
  updated_at: string;
  status: OrderStatus;
  client: OrderClient;
  restaurant: OrderRestaurant;
  deliverer: OrderDeliverer | null;
  items_count?: number;
  orderItems?: OrderItem[];
  notes?: string;
  customer?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
  };
}
export interface DetailedOrder {
  id: number;
  client_id: number;
  restaurant_id: number;
  deliverer_id: number | null;
  status_id: number;
  description: string;
  subtotal: string;
  delivery_costs: string;
  service_charge: string;
  global_discount: string;
  street_number: string;
  street: string;
  city: string;
  postal_code: string;
  country: string;
  long: string;
  lat: string;
  created_at: string;
  updated_at: string;
  status: OrderStatus;
  orderItems: DetailedOrderItem[];
  client: OrderClient;
  restaurant: OrderRestaurant;
  deliverer: OrderDeliverer | null;
}
export type OrderStatusType = "pending" | "accepted" | "preparing" | "ready" | "delivered" | "cancelled";