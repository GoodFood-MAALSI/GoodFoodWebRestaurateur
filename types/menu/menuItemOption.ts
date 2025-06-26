import { MenuItemOptionValue } from "./menuItemOptionValue";

export interface MenuItemOption {
  id: number;
  name: string;
  is_required: boolean;
  is_multiple_choice: boolean;
  position: number;
  menuItemOptionValues: MenuItemOptionValue[];
}