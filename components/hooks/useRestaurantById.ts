import { useEffect, useState } from "react";
import { Restaurant } from "@/types/menu/restaurant";

export function useRestaurantById(id: number) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchRestaurant = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/proxy/restaurant/${id}`, {
          credentials: "include",
        });

        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Non autorisé : jeton invalide ou expiré.");
          }
          throw new Error("Impossible de récupérer les données du restaurant.");
        }

        const json = await res.json();
        if (isMounted) {
          setRestaurant(json.data);
        }
      } catch (err: any) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRestaurant();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { restaurant, loading, error };
}
