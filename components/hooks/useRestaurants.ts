"use client";

import { useEffect, useState } from "react";

interface RestaurantImage {
  id: number;
  filename: string;
  path: string;
  mimetype: string;
  size: number;
  isMain: boolean;
  restaurant_id: number;
  menu_item_id: number | null;
  entityType: string;
}

interface Restaurant {
  id: number;
  name: string;
  description: string;
  image?: string;
  is_open: boolean;
  review_count?: number;
  average_rating?: number;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface UseRestaurantsProps {
  page?: number;
  limit?: number;
}

interface UseRestaurantsReturn {
  restaurants: Restaurant[];
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo | null;
  refetch: () => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

export function useRestaurants({ page = 1, limit = 10 }: UseRestaurantsProps = {}): UseRestaurantsReturn {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(page);
  const [currentLimit, setCurrentLimit] = useState(limit);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`/api/proxy/restaurant/me?page=${currentPage}&limit=${currentLimit}`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Erreur lors du chargement des restaurants");
      }

      const json = await res.json();
      console.log('API Response:', json);
      
      // Handle both single restaurant and array responses
      let list;
      let meta = null;
      
      if (json.data && typeof json.data === 'object') {
        // If data is a single restaurant object (has 'name' property)
        if (json.data.name) {
          list = [json.data];
          // Create pagination metadata for single restaurant
          meta = {
            currentPage: 1,
            totalPages: 1,
            totalItems: 1,
            itemsPerPage: currentLimit,
            hasNextPage: false,
            hasPrevPage: false,
          };
        } 
        // If data has restaurants array (paginated response)
        else if (json.data.restaurants && Array.isArray(json.data.restaurants)) {
          list = json.data.restaurants;
          meta = json.data.meta || json.meta;
        }
        // If data is an array directly
        else if (Array.isArray(json.data)) {
          list = json.data;
        }
      }
      // Fallback: if response is an array directly
      else if (Array.isArray(json)) {
        list = json;
      }
      
      if (!Array.isArray(list)) {
        throw new Error("Données restaurants invalides");
      }

      setRestaurants(
        list.map((r: {
          id: number;
          name: string;
          description: string;
          is_open?: boolean;
          images?: RestaurantImage[];
          review_count?: number;
          average_rating?: number;
        }) => {
          const mainImage = r.images?.find((img: RestaurantImage) => img.isMain);
          const imageUrl = mainImage?.path || r.images?.[0]?.path;
          
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
          const fullImageUrl = imageUrl ? `${backendUrl}/restaurateur/api${imageUrl}` : undefined;
          
          return {
            id: r.id,
            name: r.name,
            description: r.description,
            image: fullImageUrl,
            is_open: r.is_open ?? false,
            review_count: r.review_count ?? 0,
            average_rating: r.average_rating ?? 0,
          };
        })
      );

      // Set pagination info if available
      if (meta) {
        setPagination({
          currentPage: meta.currentPage || currentPage,
          totalPages: meta.totalPages || 1,
          totalItems: meta.totalItems || list.length,
          itemsPerPage: meta.itemsPerPage || currentLimit,
          hasNextPage: meta.hasNextPage || false,
          hasPrevPage: meta.hasPrevPage || false,
        });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [currentPage, currentLimit]);

  const setPage = (page: number) => {
    setCurrentPage(page);
  };

  const setLimit = (limit: number) => {
    setCurrentLimit(limit);
    setCurrentPage(1); // Reset to first page when changing limit
  };

  return { 
    restaurants, 
    loading, 
    error, 
    pagination, 
    refetch: fetchRestaurants,
    setPage,
    setLimit
  };
}
