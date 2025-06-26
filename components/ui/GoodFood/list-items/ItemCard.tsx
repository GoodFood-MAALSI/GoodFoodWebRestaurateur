import React from "react";
import { MenuItem } from "@/types/menu/menuItem";
import ItemDetailsModal from "./ItemsDetailsModal";
import { useItemModal } from "@/components/hooks/useItemModal";

interface ItemCardProps {
  item: MenuItem;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const { isOpen, open, close } = useItemModal();

  return (
    <>
      <button
        onClick={open}
        className="border border-gray-300 p-4 rounded-lg flex flex-col items-center shadow-sm bg-white hover:shadow-md transition w-full"
      >
        <img
          src={item.picture || "/GoodFood/logo.png"}
          alt={item.name}
          className="w-36 h-36 object-cover rounded"
        />
        <div className="mt-4 text-center">
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <p className="text-sm text-gray-600">{item.price} €</p>
        </div>
      </button>

      {isOpen && <ItemDetailsModal item={item} onClose={close} />}
    </>
  );
};

export default ItemCard;
