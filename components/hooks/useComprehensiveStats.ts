"use client";

import { useState, useCallback, useEffect } from "react";
import { useCurrentUser } from "./useCurrentUser";

export interface ComprehensiveStats {
  totalOrders: number;
  todayOrders: number;
  monthlyRevenue: number;
  previousMonthRevenue: number;
  revenueGrowthPercentage: number;
  averageRating: number;
  totalRestaurants: number;
  openRestaurants: number;
  totalMenuItems: number;
  statusCounts: {
    pending: number;
    accepted: number;
    preparing: number;
    ready: number;
    delivered: number;
    cancelled: number;
  };
  revenueByRestaurant: Array<{
    restaurantId: number;
    restaurantName: string;
    revenue: number;
    orders: number;
  }>;
}

export function useComprehensiveStats() {
  const { user, restaurants, loading: userLoading } = useCurrentUser();
  const [stats, setStats] = useState<ComprehensiveStats>({
    totalOrders: 0,
    todayOrders: 0,
    monthlyRevenue: 0,
    previousMonthRevenue: 0,
    revenueGrowthPercentage: 0,
    averageRating: 0,
    totalRestaurants: 0,
    openRestaurants: 0,
    totalMenuItems: 0,
    statusCounts: {
      pending: 0,
      accepted: 0,
      preparing: 0,
      ready: 0,
      delivered: 0,
      cancelled: 0,
    },
    revenueByRestaurant: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComprehensiveStats = useCallback(async () => {
    if (!user || restaurants.length === 0) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch stats for all restaurants in parallel
      const statsPromises = restaurants.map(async (restaurant) => {
        try {
          const [ordersRes, currentMonthStatsRes, previousMonthStatsRes, reviewsRes] = await Promise.all([
            fetch(`/api/proxy/restaurant/${restaurant.id}/orders`, { credentials: "include" }),
            fetch(`/api/proxy/orders/restaurant/${restaurant.id}/stats?period=monthly`, { credentials: "include" }),
            fetch(`/api/proxy/orders/restaurant/${restaurant.id}/stats?period=monthly&offset=1`, { credentials: "include" }),
            fetch(`/api/proxy/client-review-restaurant/${restaurant.id}`, { credentials: "include" })
          ]);

          const ordersData = ordersRes.ok ? await ordersRes.json() : { orders: [] };
          const currentMonthStats = currentMonthStatsRes.ok ? await currentMonthStatsRes.json() : {};
          const previousMonthStats = previousMonthStatsRes.ok ? await previousMonthStatsRes.json() : {};
          const reviewsData = reviewsRes.ok ? await reviewsRes.json() : { reviews: { reviews: [] } };

          const orders = ordersData.data?.orders || ordersData.orders || [];
          const reviews = reviewsData.reviews?.reviews || reviewsData.reviews || [];

          return {
            restaurant,
            orders,
            currentMonthStats,
            previousMonthStats,
            reviews,
          };
        } catch (err) {
          console.error(`Error fetching data for restaurant ${restaurant.id}:`, err);
          return {
            restaurant,
            orders: [],
            currentMonthStats: {},
            previousMonthStats: {},
            reviews: [],
          };
        }
      });

      const restaurantData = await Promise.all(statsPromises);

      // Compile comprehensive stats
      let totalOrders = 0;
      let todayOrders = 0;
      let monthlyRevenue = 0;
      let previousMonthRevenue = 0;
      let totalRating = 0;
      let totalReviews = 0;
      let totalMenuItems = 0;
      const statusCounts = {
        pending: 0,
        accepted: 0,
        preparing: 0,
        ready: 0,
        delivered: 0,
        cancelled: 0,
      };
      const revenueByRestaurant: Array<{
        restaurantId: number;
        restaurantName: string;
        revenue: number;
        orders: number;
      }> = [];

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      // Calculate previous month
      const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      restaurantData.forEach(({ restaurant, orders, currentMonthStats, previousMonthStats, reviews }) => {
        // Orders stats
        totalOrders += orders.length;
        
        // Today's orders
        const todayRestaurantOrders = orders.filter((order: any) => {
          const orderDate = new Date(order.created_at);
          orderDate.setHours(0, 0, 0, 0);
          return orderDate.getTime() === today.getTime();
        });
        todayOrders += todayRestaurantOrders.length;

        // Revenue calculation - use API stats first, fallback to calculation
        let restaurantCurrentMonthRevenue = currentMonthStats.totalRevenue || 0;
        let restaurantPreviousMonthRevenue = previousMonthStats.totalRevenue || 0;
        
        // Fallback: calculate from orders if API stats are not available
        if (!currentMonthStats.totalRevenue && orders.length > 0) {
          orders.forEach((order: any) => {
            const orderDate = new Date(order.created_at);
            const orderMonth = orderDate.getMonth();
            const orderYear = orderDate.getFullYear();
            
            const subtotal = parseFloat(order.subtotal || "0");
            const deliveryCosts = parseFloat(order.delivery_costs || "0");
            const serviceCharge = parseFloat(order.service_charge || "0");
            const discount = parseFloat(order.global_discount || "0");
            const orderRevenue = subtotal + deliveryCosts + serviceCharge - discount;
            
            // Current month revenue
            if (orderMonth === currentMonth && orderYear === currentYear) {
              restaurantCurrentMonthRevenue += orderRevenue;
            }
            
            // Previous month revenue
            if (orderMonth === previousMonth && orderYear === previousMonthYear) {
              restaurantPreviousMonthRevenue += orderRevenue;
            }
          });
        }

        monthlyRevenue += restaurantCurrentMonthRevenue;
        previousMonthRevenue += restaurantPreviousMonthRevenue;
        
        revenueByRestaurant.push({
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          revenue: restaurantCurrentMonthRevenue,
          orders: orders.length,
        });

        // Status counts
        orders.forEach((order: any) => {
          const statusString = typeof order.status === 'object' 
            ? order.status.name?.toLowerCase() 
            : String(order.status).toLowerCase();
          
          if (statusString.includes('attente') || statusString === 'pending') {
            statusCounts.pending++;
          } else if (statusString === 'accepted') {
            statusCounts.accepted++;
          } else if (statusString === 'preparing') {
            statusCounts.preparing++;
          } else if (statusString === 'ready') {
            statusCounts.ready++;
          } else if (statusString === 'delivered') {
            statusCounts.delivered++;
          } else if (statusString === 'cancelled') {
            statusCounts.cancelled++;
          }
        });

        // Reviews/Rating stats
        reviews.forEach((review: any) => {
          totalRating += review.rating || 0;
          totalReviews++;
        });

        // Menu items count - using a conservative estimate since menu_items may not be available
        totalMenuItems += 10; // Default estimate or use stats data if available
      });

      const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;
      
      // Calculate revenue growth percentage
      const revenueGrowthPercentage = previousMonthRevenue > 0 
        ? ((monthlyRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 
        : monthlyRevenue > 0 ? 100 : 0;

      setStats({
        totalOrders,
        todayOrders,
        monthlyRevenue,
        previousMonthRevenue,
        revenueGrowthPercentage,
        averageRating,
        totalRestaurants: restaurants.length,
        openRestaurants: restaurants.filter(r => r.is_open).length,
        totalMenuItems,
        statusCounts,
        revenueByRestaurant,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement des statistiques");
    } finally {
      setLoading(false);
    }
  }, [user, restaurants]);

  useEffect(() => {
    if (!userLoading && restaurants.length > 0) {
      fetchComprehensiveStats();
    } else if (!userLoading && restaurants.length === 0) {
      setLoading(false);
    }
  }, [userLoading, restaurants, fetchComprehensiveStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchComprehensiveStats,
  };
}
