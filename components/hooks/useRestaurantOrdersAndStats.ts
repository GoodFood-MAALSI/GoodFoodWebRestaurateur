"use client";
import { useState, useCallback, useEffect } from "react";
import { Order, OrderStatusType } from "@/types/order";
import { RestaurantStats } from "@/types/stats";
interface RestaurantOrderStats {
  orders: Order[];
  stats: RestaurantStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateOrderStatus: (orderId: number, status: OrderStatusType) => Promise<void>;
}
export function useRestaurantOrdersAndStats(restaurantId: number): RestaurantOrderStats {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<RestaurantStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchOrdersAndStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [ordersRes, statsRes] = await Promise.allSettled([
        fetch(`/api/proxy/orders/${restaurantId}`, {
          credentials: "include",
        }),
        fetch(`/api/proxy/orders/${restaurantId}/stats`, {
          credentials: "include",
        })
      ]);
      if (ordersRes.status === 'fulfilled' && ordersRes.value.ok) {
        const ordersJson = await ordersRes.value.json();
        let ordersData;
        if (ordersJson.data && ordersJson.data.orders) {
          ordersData = ordersJson.data.orders;
        } else if (ordersJson.data) {
          ordersData = Array.isArray(ordersJson.data) ? ordersJson.data : [ordersJson.data];
        } else {
          ordersData = Array.isArray(ordersJson) ? ordersJson : [ordersJson];
        }
        setOrders(ordersData || []);
      } else {
        setOrders([]);
      }
      if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
        const statsJson = await statsRes.value.json();
        if (statsJson.statusCode === 200 && statsJson.data) {
          setStats(statsJson.data);
        } else {
          setStats(null);
        }
      } else {
        setStats(null);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement des données");
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
      const res = await fetch(`/api/proxy/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status_id: statusId }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error("Erreur lors de la mise à jour");
      }
      const json = await res.json();
      const updatedOrder = json.data || json;
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, ...updatedOrder } : order
      ));
      await fetchOrdersAndStats();
    } catch (err: unknown) {
      throw new Error(err instanceof Error ? err.message : "Erreur lors de la mise à jour");
    }
  }, [restaurantId, fetchOrdersAndStats]);
  useEffect(() => {
    fetchOrdersAndStats();
  }, [fetchOrdersAndStats]);
  return {
    orders,
    stats,
    loading,
    error,
    refetch: fetchOrdersAndStats,
    updateOrderStatus,
  };
}
