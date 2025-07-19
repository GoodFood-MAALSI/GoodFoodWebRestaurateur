"use client";

import { useEffect, useState } from "react";
import { RestaurantStats } from "@/types/stats";

export function useRestaurantStats(restaurantId: number | null) {
  const [stats, setStats] = useState<RestaurantStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/proxy/orders/${restaurantId}/stats`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Erreur lors du chargement des statistiques");
        }

        const json = await res.json();
        
        if (json.statusCode === 200 && json.data) {
          setStats(json.data);
        } else {
          throw new Error(json.message || "Données invalides");
        }
      } catch (err) {
        console.error("Error fetching restaurant stats:", err);
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [restaurantId]);

  const refetch = () => {
    if (restaurantId) {
      setLoading(true);
      setError(null);
      // Trigger the useEffect again
      setStats(null);
    }
  };

  return { stats, loading, error, refetch };
}
