import React from "react";
import ItemCard from "./ItemCard";
import { MenuItem } from "@/types/menu/menuItem";
import { COLORS } from "@/app/constants";
interface ListItemsProps {
  items?: MenuItem[];
}
const ListItems: React.FC<ListItemsProps> = ({ items = [] }) => (
  <div className="w-full">
    {items.length === 0 ? (
      <div className="text-center py-12">
        <div className="mb-4">
          <span className="text-6xl">🍽️</span>
        </div>
        <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.text.secondary }}>
          Aucun article trouvé
        </h3>
        <p style={{ color: COLORS.text.secondary }}>
          Commencez par ajouter votre premier article au menu !
        </p>
      </div>
    ) : (
      <>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold" style={{ color: COLORS.text.primary }}>
            Vos Articles ({items.length})
          </h2>
          <div className="h-1 flex-1 mx-4 rounded" style={{ backgroundColor: COLORS.primary, opacity: 0.2 }}></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </>
    )}
  </div>
);
export default ListItems;
