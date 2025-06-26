import { MenuItemOption } from "./menuItemOption";

export interface MenuItem {
  id: number;
  name: string;
  price: string;
  description: string;
  picture: string;
  promotion: string;
  is_available: boolean;
  position: number;
  menuCategoryId: number;
  menuItemOptions: MenuItemOption[];
  imageId?: number;
}