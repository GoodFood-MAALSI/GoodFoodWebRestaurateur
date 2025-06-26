import { Item } from "../item";
import { MenuCategory } from "./menuCategory";

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