import { MenuItem } from "./menuItem";
export interface MenuCategory {
  id: number;
  name: string;
  position: number;
  menuItems: MenuItem[];
}