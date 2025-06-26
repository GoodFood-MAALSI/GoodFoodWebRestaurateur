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
    } catch (err: any) {
      setError(err.message || "Échec du chargement des articles.");
    } finally {
      setLoading(false);
    }
  }, []);

  const setInitialItems = useCallback(async (restaurantId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/restaurateur/api/restaurant/${restaurantId}`);
      const json = await response.json();

      const menuCategories: MenuCategory[] = json.data.menuCategories;
      const allItems: MenuItem[] = menuCategories.flatMap((category) => category.menuItems);

      setItems(allItems);
    } catch (err) {
      setError("Erreur lors de la récupération des articles.");
      console.error(err);
    } finally {
      setLoading(false);4235674127
    }
  }, []);

  const addItem = useCallback(async (restaurantId: number, data: MenuItem) => {
    const payload = {
      name: data.name,
      price: data.price,
      description: data.description,
      picture: data.picture ?? null,
      promotion: data.promotion,
      is_available: data.is_available,
      position: data.position,
      menuCategoryId: data.menuCategoryId,
      options: data.menuItemOptions || [],
    };

    const res = await fetch(
      `/api/proxy/restaurant/${restaurantId}/menu-items`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) throw new Error("Échec ajout");
    const json = await res.json();
    const created: MenuItem = json.data ?? json;
    setItems((prev) => [...prev, created]);
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
