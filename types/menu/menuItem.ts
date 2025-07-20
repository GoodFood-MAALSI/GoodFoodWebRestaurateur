import { MenuItemOption } from "./menuItemOption";
export interface MenuItemImage {
  id: number;
  filename: string;
  path: string;
  mimetype: string;
  size: number;
  isMain: boolean;
  restaurant_id: number | null;
  menu_item_id: number;
  entityType: string;
  created_at: string;
}
export interface MenuItem {
  id: number;
  name: string;
  price: string;
  description: string;
  picture?: string;
  promotion: string;
  is_available: boolean;
  position: number;
  menuCategoryId: number;
  menuItemOptions: MenuItemOption[];
  images?: MenuItemImage[];
  imageId?: number;
}