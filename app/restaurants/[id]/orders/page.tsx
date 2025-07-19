"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useOrders } from "@/components/hooks/useOrders";
import { useRestaurantById } from "@/components/hooks/useRestaurantById";
import OrdersList from "@/components/ui/GoodFood/orders/OrdersList";
import { Button } from "@/components/ui/shadcn/button";
import { ArrowLeft } from "lucide-react";
import { Toaster } from "@/components/ui/shadcn/sonner";
import { OrderStatusType } from "@/types/order";
import { toast } from "sonner";
import { ORDER_STATUS_COLORS, ORDER_STATUS_TEXT_COLORS } from "@/app/constants";

export default function RestaurantOrdersPage() {
  const { id } = useParams();
  const router = useRouter();
  const restaurantId = Number(id);
  
  const { restaurant, loading: restaurantLoading } = useRestaurantById(restaurantId);
  const { orders, loading, error, refetch, updateOrderStatus } = useOrders(restaurantId);

  const handleStatusChange = async (orderId: number, status: OrderStatusType) => {
    try {
      await updateOrderStatus(orderId, status);
      toast.success("Statut de la commande mis à jour");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
      throw error;
    }
  };

  if (restaurantLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3">Chargement...</span>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Restaurant introuvable</h1>
          <p className="text-gray-600 mb-4">Le restaurant demandé n&apos;existe pas.</p>
          <Button onClick={() => router.push("/restaurants")}>
            Retour aux restaurants
          </Button>
        </div>
      </div>
    );
  }

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

  const orderCounts = getOrderCounts();

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Commandes - {restaurant.name}
                </h1>
                <p className="text-gray-600 mt-2">
                  {restaurant.description}
                </p>
              </div>
            </div>
          </div>

          {!loading && orders.length > 0 && (
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

        <div className="mt-6">
          <OrdersList
            orders={orders}
            loading={loading}
            error={error}
            onRefresh={refetch}
            onStatusChange={handleStatusChange}
            title={`Commandes (${orders.length})`}
            showRestaurantFilter={false}
          />
        </div>
      </div>
    </div>
  );
}
