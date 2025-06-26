import React from "react";
import ItemCard from "./ItemCard";
import { MenuItem } from "@/types/menu/menuItem";

interface ListItemsProps {
  items?: MenuItem[];
}

const ListItems: React.FC<ListItemsProps> = ({ items = [] }) => (
  <div className="max-w-screen-xl mx-auto px-4">
    <h2 className="text-2xl font-bold mb-4">Articles</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  </div>
);

export default ListItems;
