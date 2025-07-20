"use client";
import { useState, useCallback } from "react";
import { MenuCategory } from "@/types/menu/menuCategory";
import { MenuItem } from "@/types/menu/menuItem";
export function useMenuItems() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchItems = useCallback(async (restaurantId: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/proxy/restaurant/${restaurantId}/menu-items`);
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      const data = json.data || json;
      setItems(data as MenuItem[]);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Échec du chargement des articles.");
    } finally {
      setLoading(false);
    }
  }, []);
  const setInitialItems = useCallback(async (restaurantId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/proxy/restaurant/${restaurantId}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données du restaurant.");
      }
      const json = await response.json();
      const menuCategories: MenuCategory[] = json.data.menuCategories;
      const allItems: MenuItem[] = menuCategories.flatMap((category) => category.menuItems);
      setItems(allItems);
    } catch (err) {
      setError("Erreur lors de la récupération des articles.");
    } finally {
      setLoading(false);
    }
  }, []);
  const addItem = useCallback(async (restaurantId: number, data: MenuItem) => {
    try {
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
      setItems((prev) => [...prev, finalMenuItem]);
    } catch (error) {
      throw error;
    }
  }, []);
  return {
    items,
    loading,
    error,
    addItem,
    refetch: fetchItems,
    setInitialItems,
  };
}
