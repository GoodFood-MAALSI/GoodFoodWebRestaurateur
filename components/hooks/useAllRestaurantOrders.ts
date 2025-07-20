"use client";

import { useState, useCallback, useEffect } from "react";
import { Order, OrderStatusType } from "@/types/order";
import { useRestaurants } from "./useRestaurants";

interface RestaurantWithOrders {
  restaurant: {
    id: number;
    name: string;
    description: string;
    image?: string;
  };
  orders: Order[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  loading: boolean;
  error: string | null;
}

interface PaginationOptions {
  page?: number;
  limit?: number;
  statusId?: number;
}

export function useAllRestaurantOrders(userId: number, options: PaginationOptions = {}) {
  const { page = 1, limit = 10, statusId } = options;
  const { restaurants, loading: restaurantsLoading, error: restaurantsError } = useRestaurants();
  const [restaurantOrders, setRestaurantOrders] = useState<Record<number, RestaurantWithOrders>>({});
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [allOrdersPagination, setAllOrdersPagination] = useState<{
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllOrders = useCallback(async () => {
    if (restaurants.length === 0) return;

    try {
      setLoading(true);
      setError(null);
      
      const ordersPromises = restaurants.map(async (restaurant) => {
        try {
          const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
          });
          
          if (statusId) {
            queryParams.append('status_id', statusId.toString());
          }

          const res = await fetch(`/api/proxy/restaurant/${restaurant.id}/orders?${queryParams.toString()}`, {
            credentials: "include",
          });

          if (!res.ok) {
            throw new Error(`Erreur pour le restaurant ${restaurant.name}`);
          }

          const json = await res.json();
          
          let ordersData;
          let paginationData = null;
          
          if (json.data && json.data.orders) {
            ordersData = json.data.orders;
            paginationData = json.data.pagination || json.pagination;
          } else if (json.data) {
            ordersData = Array.isArray(json.data) ? json.data : [json.data];
          } else {
            ordersData = Array.isArray(json) ? json : [json];
          }

          return {
            restaurant,
            orders: ordersData,
            pagination: paginationData,
            loading: false,
            error: null,
          };
        } catch (err: unknown) {
          console.error(`Error fetching orders for restaurant ${restaurant.id}:`, err);
          return {
            restaurant,
            orders: [],
            pagination: undefined,
            loading: false,
            error: err instanceof Error ? err.message : "Erreur de chargement",
          };
        }
      });

      const results = await Promise.all(ordersPromises);
      
      const ordersMap: Record<number, RestaurantWithOrders> = {};
      const combinedOrders: Order[] = [];
      let totalItems = 0;
      let totalPages = 1;
      
      results.forEach((result) => {
        ordersMap[result.restaurant.id] = result;
        combinedOrders.push(...result.orders);
        if (result.pagination) {
          totalItems += result.pagination.totalItems;
          totalPages = Math.max(totalPages, result.pagination.totalPages);
        }
      });

      setRestaurantOrders(ordersMap);
      setAllOrders(combinedOrders);
      setAllOrdersPagination({
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement des commandes");
    } finally {
      setLoading(false);
    }
  }, [restaurants, page, limit, statusId]);

  useEffect(() => {
    if (!restaurantsLoading && restaurants.length > 0) {
      fetchAllOrders();
    } else if (!restaurantsLoading && restaurants.length === 0) {
      setLoading(false);
    }
  }, [restaurants, restaurantsLoading, fetchAllOrders]);

  const updateOrderStatus = useCallback(async (orderId: number, status: OrderStatusType) => {
    try {
      const restaurantId = Object.values(restaurantOrders)
        .find(({ orders }) => orders.some(order => order.id === orderId))
        ?.restaurant.id;

      if (!restaurantId) {
        throw new Error("Restaurant not found for this order");
      }

      const statusMapping: Record<string, number> = {
        "pending": 1,
        "accepted": 2, 
        "preparing": 3,
        "ready": 4,
        "delivered": 5,
        "cancelled": 6
      };

      const statusString = String(status).toLowerCase();
      const statusId = statusMapping[statusString] || 2;
        
      const res = await fetch(`/api/proxy/restaurant/${restaurantId}/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status_id: statusId }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Status update failed:", errorText);
        throw new Error("Erreur lors de la mise à jour");
      }

      const json = await res.json();
      const updatedOrder = json.data || json;

      setRestaurantOrders(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(id => {
          const restaurantId = parseInt(id);
          updated[restaurantId] = {
            ...updated[restaurantId],
            orders: updated[restaurantId].orders.map(order => 
              order.id === orderId ? { ...order, ...updatedOrder } : order
            )
          };
        });
        return updated;
      });

      setAllOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, ...updatedOrder } : order
      ));
    } catch (err: unknown) {
      console.error("Error in updateOrderStatus:", err);
      throw new Error(err instanceof Error ? err.message : "Erreur lors de la mise à jour");
    }
  }, [restaurantOrders]);

  return {
    restaurants,
    restaurantOrders,
    allOrders,
    allOrdersPagination,
    loading: loading || restaurantsLoading,
    error: error || restaurantsError,
    refetch: fetchAllOrders,
    updateOrderStatus,
  };
}
