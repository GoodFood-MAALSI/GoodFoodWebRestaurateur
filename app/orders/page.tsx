"use client";

import React from "react";
import { useAllRestaurantOrders } from "@/components/hooks/useAllRestaurantOrders";
import OrdersList from "@/components/ui/GoodFood/orders/OrdersList";
import { Toaster } from "@/components/ui/shadcn/sonner";
import { toast } from "sonner";
import { COLORS, ORDER_STATUS_COLORS, ORDER_STATUS_TEXT_COLORS } from "@/app/constants";

export default function OrdersPage() {
  const { 
    restaurants, 
    restaurantOrders, 
    allOrders, 
    loading, 
    error, 
    refetch, 
    updateOrderStatus 
  } = useAllRestaurantOrders(13);

  const handleStatusChange = async (orderId: number, status: any) => {
    try {
      await updateOrderStatus(orderId, status);
      toast.success("Statut de la commande mis à jour");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
      throw error;
    }
  };

  const getStatusString = (status: any): string => {
    if (typeof status === 'object' && status.name) {
      return status.name.toLowerCase();
    }
    return String(status).toLowerCase();
  };

  const getOrderCounts = () => {
    const counts = {
      total: allOrders.length,
      pending: 0,
      accepted: 0,
      preparing: 0,
      ready: 0,
      delivered: 0,
      cancelled: 0,
    };

    allOrders.forEach(order => {
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

  const orderCounts = getOrderCounts();

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des commandes</h1>
          <p className="text-gray-600 mt-2">
            Suivez et gérez toutes vos commandes en temps réel
          </p>
        </div>

        {!loading && allOrders.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            <div className="rounded-lg p-4 text-center" style={{ backgroundColor: ORDER_STATUS_COLORS.total }}>
              <div className="text-2xl font-bold" style={{ color: ORDER_STATUS_TEXT_COLORS.total }}>{orderCounts.total}</div>
              <div className="text-sm" style={{ color: ORDER_STATUS_TEXT_COLORS.total }}>Total</div>
            </div>
            <div className="rounded-lg p-4 text-center" style={{ backgroundColor: ORDER_STATUS_COLORS.pending }}>
              <div className="text-2xl font-bold" style={{ color: ORDER_STATUS_TEXT_COLORS.pending }}>{orderCounts.pending}</div>
              <div className="text-sm" style={{ color: ORDER_STATUS_TEXT_COLORS.pending }}>En attente</div>
            </div>
            <div className="rounded-lg p-4 text-center" style={{ backgroundColor: ORDER_STATUS_COLORS.accepted }}>
              <div className="text-2xl font-bold" style={{ color: ORDER_STATUS_TEXT_COLORS.accepted }}>{orderCounts.accepted}</div>
              <div className="text-sm" style={{ color: ORDER_STATUS_TEXT_COLORS.accepted }}>Acceptées</div>
            </div>
            <div className="rounded-lg p-4 text-center" style={{ backgroundColor: ORDER_STATUS_COLORS.preparing }}>
              <div className="text-2xl font-bold" style={{ color: ORDER_STATUS_TEXT_COLORS.preparing }}>{orderCounts.preparing}</div>
              <div className="text-sm" style={{ color: ORDER_STATUS_TEXT_COLORS.preparing }}>En préparation</div>
            </div>
            <div className="rounded-lg p-4 text-center" style={{ backgroundColor: ORDER_STATUS_COLORS.ready }}>
              <div className="text-2xl font-bold" style={{ color: ORDER_STATUS_TEXT_COLORS.ready }}>{orderCounts.ready}</div>
              <div className="text-sm" style={{ color: ORDER_STATUS_TEXT_COLORS.ready }}>Prêtes</div>
            </div>
            <div className="rounded-lg p-4 text-center" style={{ backgroundColor: ORDER_STATUS_COLORS.delivered }}>
              <div className="text-2xl font-bold" style={{ color: ORDER_STATUS_TEXT_COLORS.delivered }}>{orderCounts.delivered}</div>
              <div className="text-sm" style={{ color: ORDER_STATUS_TEXT_COLORS.delivered }}>Livrées</div>
            </div>
            <div className="rounded-lg p-4 text-center" style={{ backgroundColor: ORDER_STATUS_COLORS.cancelled }}>
              <div className="text-2xl font-bold" style={{ color: ORDER_STATUS_TEXT_COLORS.cancelled }}>{orderCounts.cancelled}</div>
              <div className="text-sm" style={{ color: ORDER_STATUS_TEXT_COLORS.cancelled }}>Annulées</div>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3">Chargement des commandes...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p style={{ color: COLORS.error }}>{error}</p>
          </div>
        )}

        {!loading && !error && Object.keys(restaurantOrders).length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune commande
            </h3>
            <p className="text-gray-600">
              Vous n'avez pas encore reçu de commandes.
            </p>
          </div>
        )}

        {!loading && allOrders.length > 0 && (
          <div className="mb-12">
            <OrdersList
              orders={allOrders}
              loading={loading}
              error={error}
              onRefresh={refetch}
              onStatusChange={handleStatusChange}
              title="Toutes les commandes"
              showRestaurantFilter={true}
            />
          </div>
        )}

        {Object.values(restaurantOrders).map(({ restaurant, orders: restaurantOrdersList }) => (
          <div key={restaurant.id} className="mb-12">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {restaurant.name}
                  </h2>
                  <p className="text-gray-600">{restaurant.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    {restaurantOrdersList.length}
                  </p>
                  <p className="text-sm text-gray-600">commande(s)</p>
                </div>
              </div>

              <OrdersList
                orders={restaurantOrdersList}
                loading={false}
                error={null}
                onRefresh={refetch}
                onStatusChange={handleStatusChange}
                title=""
                showRestaurantFilter={false}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
