export interface Item {
  id?: number;
  name: string;
  description: string;
  price: number;
  picture: string | null;
  promotion: number;
  is_available: boolean;
  position: number;
  menuCategoryId: number;
  options?: {
    name: string;
    is_required: boolean;
    is_multiple_choice: boolean;
    position: number;
    values: {
      name: string;
      extra_price: number;
      position: number;
    }[];
  }[];
}