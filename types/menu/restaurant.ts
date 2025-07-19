import { Item } from "../item";
import { MenuCategory } from "./menuCategory";

export interface RestaurantImage {
  id: number;
  filename: string;
  path: string;
  mimetype: string;
  size: number;
  isMain: boolean;
  restaurant_id: number;
  menu_item_id: number | null;
  entityType: string;
}

export interface Restaurant {
  menuItems: Item[] | undefined;
  id: number;
  name: string;
  description: string;
  street_number: string;
  street: string;
  city: string;
  postal_code: string;
  country: string;
  email: string;
  phone_number: string;
  siret: string;
  is_open: boolean;
  long: string;
  lat: string;
  restaurantTypeId: number;
  userId: number;
  created_at: string;
  updated_at: string;
  images?: RestaurantImage[];
  review_count?: number;
  average_rating?: number;
  restaurantType: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
  user: {
    id: number;
    email: string;
    status: string;
    first_name: string;
    last_name: string;
    created_at: string;
    updated_at: string;
    __entity: string;
  };
  menuCategories: MenuCategory[];
}