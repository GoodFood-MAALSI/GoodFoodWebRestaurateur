import React from "react";
import { MenuItem } from "@/types/menu/menuItem";
import MenuItemModal from "@/components/ui/GoodFood/menu-item-modal/MenuItemModal";
import { useItemModal } from "@/components/hooks/useItemModal";

interface ItemCardProps {
  item: MenuItem;
  onUpdate?: (updatedItem: MenuItem) => void;
  onDelete?: (itemId: number) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onUpdate, onDelete }) => {
  const { isOpen, open, close } = useItemModal();

  const handleUpdate = (updatedItem: MenuItem) => {
    if (onUpdate) {
      onUpdate(updatedItem);
    }
    close();
  };

  const handleDelete = (itemId: number) => {
    if (onDelete) {
      onDelete(itemId);
    }
    close();
  };

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
          style={{
            width: '144px',
            height: '144px',
            objectFit: 'cover'
          }}
        />
        <div className="mt-4 text-center">
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <p className="text-sm text-gray-600">{item.price} €</p>
        </div>
      </button>

      <MenuItemModal 
        item={item} 
        open={isOpen} 
        onClose={close} 
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </>
  );
};

export default ItemCard;
