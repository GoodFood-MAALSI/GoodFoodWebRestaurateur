"use client";

import { useState, useEffect } from 'react';
import { RestaurantType } from '@/types/restaurantType';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

export function useRestaurantTypes() {
  const [restaurantTypes, setRestaurantTypes] = useState<RestaurantType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurantTypes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetchWithAuth('/api/proxy/restaurant/type');
        
        if (response.ok) {
          const data = await response.json();
          const typesArray = Array.isArray(data) ? data : (data.data || data.restaurantTypes || []);
          setRestaurantTypes(typesArray);
        } else {
          setError('Erreur lors du chargement des types de restaurants');
        }
      } catch (err) {
        console.error('Error fetching restaurant types:', err);
        setError('Erreur lors du chargement des types de restaurants');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantTypes();
  }, []);

  return {
    restaurantTypes,
    loading,
    error,
  };
}
