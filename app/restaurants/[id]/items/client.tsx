"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/shadcn/sonner";
import MenuWizard from "@/components/ui/GoodFood/menu-wizard/MenuWizard";
import EnhancedListItems from "@/components/ui/GoodFood/enhanced-list-items/EnhancedListItems";
import { useMenuCategories } from "@/components/hooks/useMenuCategories";
import { MenuItem } from "@/types/menu/menuItem";
import { COLORS } from "@/app/constants";

export default function ClientItemForm() {
  const { id } = useParams();
  const restaurantId = Number(id);

  const { categories, loading, error: fetchError, fetchCategories, addItemToCategory } = useMenuCategories();
  const [toastShown, setToastShown] = useState(false);

  useEffect(() => {
    fetchCategories(restaurantId);
  }, [restaurantId, fetchCategories]);

  const allItems = categories.flatMap(category => category.menuItems);

  useEffect(() => {
    if (!loading && !fetchError && allItems.length === 0 && !toastShown) {
      toast("Vous n'avez pas encore d'articles. Créez votre premier article !");
      setToastShown(true);
    }
  }, [allItems, loading, fetchError, toastShown]);

  const handleSubmit = async (data: MenuItem) => {
    try {
      // Use the original useMenuItems hook logic for adding items
      const menuItemPayload = {
        name: data.name,
        price: parseFloat(data.price?.toString() || "0"),
        description: data.description,
        promotion: parseFloat(data.promotion?.toString() || "0"),
        is_available: data.is_available,
        position: data.position,
        menuCategoryId: data.menuCategoryId,
      };

      const menuItemRes = await fetch(
        `/api/proxy/menu-items`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(menuItemPayload),
        }
      );
      if (!menuItemRes.ok) throw new Error("Échec création de l'article");
      
      const menuItemJson = await menuItemRes.json();
      const createdMenuItem: MenuItem = menuItemJson.data ?? menuItemJson;
      const menuItemId = createdMenuItem.id;

      const createdOptions = [];
      for (const option of (data.menuItemOptions || [])) {
        const optionPayload = {
          name: option.name,
          is_required: option.is_required,
          is_multiple_choice: option.is_multiple_choice,
          position: option.position,
          menuItemId: menuItemId,
        };

        const optionRes = await fetch(
          `/api/proxy/menu-item-options`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(optionPayload),
          }
        );
        if (!optionRes.ok) throw new Error(`Échec création de l'option ${option.name}`);
        
        const optionJson = await optionRes.json();
        const createdOption = optionJson.data ?? optionJson;
        createdOptions.push(createdOption);

        const optionValues = option.menuItemOptionValues || [];
        for (const value of optionValues) {
          const valuePayload = {
            name: value.name,
            extra_price: parseFloat(value.extra_price?.toString() || "0"),
            position: value.position,
            menuItemOptionId: createdOption.id,
          };

          const valueRes = await fetch(
            `/api/proxy/menu-item-option-values`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(valuePayload),
            }
          );
          if (!valueRes.ok) throw new Error(`Échec création de la valeur ${value.name}`);
        }
      }

      const finalMenuItem = {
        ...createdMenuItem,
        menuItemOptions: createdOptions,
      };

      addItemToCategory(finalMenuItem);
      toast.success("Article créé avec succès !");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la création de l'article");
    }
  };

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">🍽️ Gestion des Articles</h1>
            <p className="text-gray-600 mb-6 text-lg">Organisez votre menu par catégories avec style</p>
            <div className="flex justify-center">
              <MenuWizard restaurantId={restaurantId} onFinish={handleSubmit} />
            </div>
          </div>

          {fetchError ? (
            <div className="text-center py-8">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
                <div className="text-red-600 text-lg font-medium mb-2">❌ Erreur de chargement</div>
                <p className="text-red-700">{fetchError}</p>
              </div>
            </div>
          ) : (
            <EnhancedListItems categories={categories} loading={loading} />
          )}
        </div>
      </div>
    </>
  );
}
