"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/shadcn/sonner";
import MenuWizard from "@/components/ui/GoodFood/menu-wizard/MenuWizard";
import ListItems from "@/components/ui/GoodFood/list-items/list-items";
import { useMenuItems } from "@/components/hooks/useMenuItems";
import { MenuItem } from "@/types/menu/menuItem";
import { COLORS } from "@/app/constants";

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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Gestion des Articles</h1>
            <p className="text-gray-600 mb-6">Gérez vos articles de menu avec simplicité</p>
            <div className="flex justify-center">
              <MenuWizard restaurantId={restaurantId} onFinish={handleSubmit} />
            </div>
          </div>

          {fetchError ? (
            <div className="text-center py-8">
              <p style={{ color: COLORS.error }} className="text-lg font-medium">
                {fetchError}
              </p>
            </div>
          ) : (
            <ListItems items={items} />
          )}
        </div>
      </div>
    </>
  );
}
