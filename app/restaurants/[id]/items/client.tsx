"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/shadcn/sonner";
import MenuWizard from "@/components/ui/GoodFood/menu-wizard/MenuWizard";
import ListItems from "@/components/ui/GoodFood/list-items/list-items";
import { useMenuItems } from "@/components/hooks/useMenuItems";
import { MenuItem } from "@/types/menu/menuItem";

export default function ClientItemForm() {
  const { id } = useParams();
  const restaurantId = Number(id);

  const { items, loading, error: fetchError, addItem, setInitialItems } = useMenuItems();
  const [toastShown, setToastShown] = useState(false);

  useEffect(() => {
    setInitialItems(restaurantId);
  }, [restaurantId, setInitialItems]);

  useEffect(() => {
    if (!loading && !fetchError && items.length === 0 && !toastShown) {
      toast("Vous n'avez pas encore d'articles. Créez votre premier article !");
      setToastShown(true);
    }
  }, [items, loading, fetchError, toastShown]);

  const handleSubmit = async (data: MenuItem) => {
    try {
      await addItem(restaurantId, data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Toaster />
      <div>
        <MenuWizard restaurantId={restaurantId} onFinish={handleSubmit} />
        {fetchError ? (
          <p className="text-red-500">{fetchError}</p>
        ) : (
          <ListItems items={items} />
        )}
      </div>
    </>
  );
}
