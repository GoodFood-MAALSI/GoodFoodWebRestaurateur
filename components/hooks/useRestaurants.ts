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

export function useRestaurants(userId: number) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch(`/api/proxy/restaurant/me`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Erreur lors du chargement des restaurants");
        }

        const json = await res.json();
        const list = json.data?.restaurants;
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
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [userId]);

  return { restaurants, loading, error };
}
