import React, { useState } from "react";
import { MenuItem } from "@/types/menu/menuItem";
import { Button } from "@/components/ui/shadcn/button";
import ConfirmDeleteDialog from "@/components/ui/GoodFood/ConfirmDeleteDialog";
import EditItemForm from "@/components/ui/GoodFood/list-items/EditItemForm";

interface Props {
  item: MenuItem;
  onClose: () => void;
}

const ItemDetailsModal: React.FC<Props> = ({ item, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/menu/items/${item.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Échec de la suppression");
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-black">×</button>

        {!isEditing ? (
          <>
            <img
              src={item.picture || "/GoodFood/logo.png"}
              alt={item.name}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
            <p className="text-gray-600 mb-4">{item.price} €</p>

            <div className="flex justify-between">
              <Button onClick={() => setIsEditing(true)}>Modifier</Button>
              <Button variant="destructive" onClick={() => setConfirmDelete(true)}>
                Supprimer
              </Button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-2">Modifier l'élément</h2>
            <EditItemForm item={item} onSuccess={() => {
              setIsEditing(false);
              onClose();
            }} />
          </>
        )}

        {confirmDelete && (
          <ConfirmDeleteDialog
            onCancel={() => setConfirmDelete(false)}
            onConfirm={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default ItemDetailsModal;
