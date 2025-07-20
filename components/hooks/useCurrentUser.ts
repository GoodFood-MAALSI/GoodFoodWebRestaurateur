import { useState, useEffect } from 'react';
interface Restaurant {
  id: number;
  name: string;
  description: string;
  image?: string;
  is_open: boolean;
}
interface RestaurantOwner {
  id: number;
  email: string;
  status: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
  __entity: "User";
}
export function useCurrentUser() {
  const [user, setUser] = useState<RestaurantOwner | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchCurrentUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const restaurantResponse = await fetch('/api/proxy/restaurant/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (!restaurantResponse.ok) {
          throw new Error(`Failed to fetch restaurant data: ${restaurantResponse.status}`);
        }
        const restaurantData = await restaurantResponse.json();
        let restaurantList = [];
        if (restaurantData && restaurantData.data && Array.isArray(restaurantData.data.restaurants)) {
          restaurantList = restaurantData.data.restaurants;
        }
        const userResponse = await fetch('/api/proxy/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        let userData = null;
        if (userResponse.ok) {
          const userResponseData = await userResponse.json();
          userData = userResponseData.data || userResponseData;
        } else {
          if (restaurantList.length > 0) {
            const userId = restaurantList[0]?.userId;
            userData = {
              id: userId,
              email: `user${userId}@example.com`,
              first_name: 'Utilisateur',
              last_name: '',
              created_at: restaurantList[0].created_at,
              status: 'active',
              updated_at: restaurantList[0].updated_at,
              __entity: "User" as const
            };
          }
        }
        const processedRestaurants = Array.isArray(restaurantList) ? 
          restaurantList.map((r: {
            id: number;
            name: string;
            description?: string;
            image?: string;
            is_open?: boolean;
          }) => ({
            id: r.id,
            name: r.name,
            description: r.description || '',
            image: r.image ?? undefined,
            is_open: r.is_open ?? false,
          })) : [];
        setUser(userData);
        setRestaurants(processedRestaurants);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch restaurant owner data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);
  return { user, restaurants, loading, error };
}
