"use client";

import React from "react";
import { Order } from "@/types/order";
import { RestaurantStats } from "@/types/stats";
import { COLORS, ORDER_STATUS_COLORS, ORDER_STATUS_TEXT_COLORS } from "@/app/constants";
import { 
  ShoppingBag, 
  Euro, 
  TrendingUp, 
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
  Truck,
  XCircle
} from "lucide-react";

interface RestaurantStatsGridProps {
  orders: Order[];
  stats: RestaurantStats | null;
  loading: boolean;
}

export default function RestaurantStatsGrid({ orders, stats, loading }: RestaurantStatsGridProps) {
  const getStatusString = (status: unknown): string => {
    if (typeof status === 'object' && status !== null && 'name' in status) {
      return String((status as { name: string }).name).toLowerCase();
    }
    return String(status).toLowerCase();
  };

  const getOrderCounts = () => {
    const counts = {
      total: orders.length,
      pending: 0,
      accepted: 0,
      preparing: 0,
      ready: 0,
      delivered: 0,
      cancelled: 0,
    };

    orders.forEach(order => {
      const statusString = getStatusString(order.status);
      if (statusString.includes('attente') || statusString === 'pending') {
        counts.pending++;
      } else if (statusString === 'accepted') {
        counts.accepted++;
      } else if (statusString === 'preparing') {
        counts.preparing++;
      } else if (statusString === 'ready') {
        counts.ready++;
      } else if (statusString === 'delivered') {
        counts.delivered++;
      } else if (statusString === 'cancelled') {
        counts.cancelled++;
      }
    });

    return counts;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const calculateAverageOrderValue = () => {
    if (!stats || stats.order_count === 0) return 0;
    return stats.revenue / stats.order_count;
  };

  const orderCounts = getOrderCounts();

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Real-time Order Status Counts */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2" style={{ color: COLORS.primary }} />
          État des commandes en temps réel
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="rounded-lg p-4 text-center" style={{ backgroundColor: ORDER_STATUS_COLORS.total }}>
            <div className="text-2xl font-bold" style={{ color: ORDER_STATUS_TEXT_COLORS.total }}>
              {orderCounts.total}
            </div>
            <div className="text-sm" style={{ color: ORDER_STATUS_TEXT_COLORS.total }}>
              Total
            </div>
          </div>
          <div className="rounded-lg p-4 text-center" style={{ backgroundColor: ORDER_STATUS_COLORS.pending }}>
            <div className="text-2xl font-bold" style={{ color: ORDER_STATUS_TEXT_COLORS.pending }}>
              {orderCounts.pending}
            </div>
            <div className="text-sm" style={{ color: ORDER_STATUS_TEXT_COLORS.pending }}>
              En attente
            </div>
          </div>
          <div className="rounded-lg p-4 text-center" style={{ backgroundColor: ORDER_STATUS_COLORS.accepted }}>
            <div className="text-2xl font-bold" style={{ color: ORDER_STATUS_TEXT_COLORS.accepted }}>
              {orderCounts.accepted}
            </div>
            <div className="text-sm" style={{ color: ORDER_STATUS_TEXT_COLORS.accepted }}>
              Acceptées
            </div>
          </div>
          <div className="rounded-lg p-4 text-center" style={{ backgroundColor: ORDER_STATUS_COLORS.preparing }}>
            <div className="text-2xl font-bold" style={{ color: ORDER_STATUS_TEXT_COLORS.preparing }}>
              {orderCounts.preparing}
            </div>
            <div className="text-sm" style={{ color: ORDER_STATUS_TEXT_COLORS.preparing }}>
              En préparation
            </div>
          </div>
          <div className="rounded-lg p-4 text-center" style={{ backgroundColor: ORDER_STATUS_COLORS.ready }}>
            <div className="text-2xl font-bold" style={{ color: ORDER_STATUS_TEXT_COLORS.ready }}>
              {orderCounts.ready}
            </div>
            <div className="text-sm" style={{ color: ORDER_STATUS_TEXT_COLORS.ready }}>
              Prêtes
            </div>
          </div>
          <div className="rounded-lg p-4 text-center" style={{ backgroundColor: ORDER_STATUS_COLORS.delivered }}>
            <div className="text-2xl font-bold" style={{ color: ORDER_STATUS_TEXT_COLORS.delivered }}>
              {orderCounts.delivered}
            </div>
            <div className="text-sm" style={{ color: ORDER_STATUS_TEXT_COLORS.delivered }}>
              Livrées
            </div>
          </div>
        </div>
      </div>

      {/* Business Statistics from API */}
      {stats && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" style={{ color: COLORS.secondary }} />
            Statistiques commerciales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="p-3 rounded-lg"
                  style={{ 
                    backgroundColor: COLORS.primary + '20',
                    color: COLORS.primary 
                  }}
                >
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-1 uppercase tracking-wide">
                  Commandes totales
                </h4>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.order_count}
                </p>
                <p className="text-sm text-gray-500">
                  Commandes complétées
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="p-3 rounded-lg"
                  style={{ 
                    backgroundColor: COLORS.secondary + '20',
                    color: COLORS.secondary 
                  }}
                >
                  <Euro className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-1 uppercase tracking-wide">
                  Chiffre d'affaires
                </h4>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.revenue)}
                </p>
                <p className="text-sm text-gray-500">
                  Revenue total
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="p-3 rounded-lg"
                  style={{ 
                    backgroundColor: COLORS.status.medium + '20',
                    color: COLORS.status.medium 
                  }}
                >
                  <Package className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-1 uppercase tracking-wide">
                  Articles vendus
                </h4>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.item_count}
                </p>
                <p className="text-sm text-gray-500">
                  Articles au total
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="p-3 rounded-lg"
                  style={{ 
                    backgroundColor: COLORS.status.darker + '20',
                    color: COLORS.status.darker 
                  }}
                >
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-1 uppercase tracking-wide">
                  Panier moyen
                </h4>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(calculateAverageOrderValue())}
                </p>
                <p className="text-sm text-gray-500">
                  Par commande
                </p>
              </div>
            </div>
          </div>

          {/* Popular Menu Item */}
          <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  🏆 Article le plus populaire
                </h4>
                <p className="text-lg font-medium text-gray-800">
                  {stats.menu_item.name}
                </p>
                <p className="text-sm text-gray-600">
                  {formatCurrency(parseFloat(stats.menu_item.price))} • Commandé {stats.item_count} fois
                </p>
              </div>
              <div className="text-right">
                <div className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg">
                  <div className="text-xl font-bold">#{stats.menu_item_id}</div>
                  <div className="text-xs font-medium">ID Article</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
