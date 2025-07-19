"use client";

import { useState, useCallback } from "react";
import { MenuCategory } from "@/types/menu/menuCategory";
import { MenuItem } from "@/types/menu/menuItem";

export function useMenuCategories() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async (restaurantId: number) => {
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
      const menuCategories: MenuCategory[] = json.data.menuCategories || [];
      
      // Sort categories by position
      const sortedCategories = menuCategories.sort((a, b) => a.position - b.position);
      
      // Sort items within each category by position
      sortedCategories.forEach(category => {
        category.menuItems = category.menuItems.sort((a, b) => a.position - b.position);
      });

      setCategories(sortedCategories);
    } catch (err) {
      setError("Erreur lors de la récupération des catégories.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addItemToCategory = useCallback((newItem: MenuItem) => {
    setCategories(prev => 
      prev.map(category => 
        category.id === newItem.menuCategoryId
          ? { ...category, menuItems: [...category.menuItems, newItem] }
          : category
      )
    );
  }, []);

  const updateItemInCategory = useCallback((updatedItem: MenuItem) => {
    setCategories(prev => 
      prev.map(category => ({
        ...category,
        menuItems: category.menuItems.map(item => 
          item.id === updatedItem.id ? updatedItem : item
        )
      }))
    );
  }, []);

  const removeItemFromCategory = useCallback((itemId: number) => {
    setCategories(prev => 
      prev.map(category => ({
        ...category,
        menuItems: category.menuItems.filter(item => item.id !== itemId)
      }))
    );
  }, []);

  const getAllItems = useCallback((): MenuItem[] => {
    return categories.flatMap(category => category.menuItems);
  }, [categories]);

  const getItemsByCategory = useCallback((categoryId: number): MenuItem[] => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.menuItems : [];
  }, [categories]);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    addItemToCategory,
    updateItemInCategory,
    removeItemFromCategory,
    getAllItems,
    getItemsByCategory,
  };
}
