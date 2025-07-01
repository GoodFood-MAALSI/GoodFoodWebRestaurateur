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

export interface OrderStatus {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  client_id: number;
  restaurant_id: number;
  status_id: number;
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
  items_count: number;
  status: OrderStatus;
  customer?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
  };
  restaurant?: {
    id: number;
    name: string;
  };
  orderItems?: OrderItem[];
  notes?: string;
}

export type OrderStatusType = "pending" | "accepted" | "preparing" | "ready" | "delivered" | "cancelled";
