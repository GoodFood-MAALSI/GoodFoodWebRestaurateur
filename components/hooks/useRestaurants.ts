"use client";

import { useEffect, useState } from "react";

interface Restaurant {
  id: number;
  name: string;
  description: string;
  image?: string;
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
          list.map((r: any) => ({
            id: r.id,
            name: r.name,
            description: r.description,
            image: r.image ?? undefined,
          }))
        );
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [userId]);

  return { restaurants, loading, error };
}
