"use client";

import { useState, useCallback, useEffect } from "react";
import { Order, OrderStatusType } from "@/types/order";

export function useOrders(restaurantId?: number) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const endpoint = restaurantId 
        ? `/api/proxy/restaurant/${restaurantId}/orders`
        : `/api/proxy/orders`;
        
      const res = await fetch(endpoint, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Erreur lors du chargement des commandes");
      }

      const json = await res.json();
      
      let ordersData;
      if (json.data && json.data.orders) {
        ordersData = json.data.orders;
      } else if (json.data) {
        ordersData = Array.isArray(json.data) ? json.data : [json.data];
      } else {
        ordersData = Array.isArray(json) ? json : [json];
      }
      
      setOrders(ordersData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement des commandes");
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  const updateOrderStatus = useCallback(async (orderId: number, status: OrderStatusType) => {
    try {
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
      
      const endpoint = restaurantId 
        ? `/api/proxy/restaurant/${restaurantId}/orders/${orderId}`
        : `/api/proxy/orders/${orderId}`;
        
      const res = await fetch(endpoint, {
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

      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, ...updatedOrder } : order
      ));
    } catch (err: unknown) {
      console.error("Error in updateOrderStatus:", err);
      throw new Error(err instanceof Error ? err.message : "Erreur lors de la mise à jour");
    }
  }, [restaurantId]);


  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
    updateOrderStatus,
  };
}
