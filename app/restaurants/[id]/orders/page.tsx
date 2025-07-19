"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useRestaurantOrdersAndStats } from "@/components/hooks/useRestaurantOrdersAndStats";
import { useRestaurantById } from "@/components/hooks/useRestaurantById";
import OrdersList from "@/components/ui/GoodFood/orders/OrdersList";
import RestaurantStatsGrid from "@/components/ui/GoodFood/stats/RestaurantStatsGrid";
import { Button } from "@/components/ui/shadcn/button";
import { ArrowLeft } from "lucide-react";
import { Toaster } from "@/components/ui/shadcn/sonner";
import { OrderStatusType } from "@/types/order";
import { toast } from "sonner";

export default function RestaurantOrdersPage() {
  const { id } = useParams();
  const router = useRouter();
  const restaurantId = Number(id);
  
  const { restaurant, loading: restaurantLoading } = useRestaurantById(restaurantId);
  const { orders, stats, loading, error, refetch, updateOrderStatus } = useRestaurantOrdersAndStats(restaurantId);

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

          {/* Stats Grid - Real API Data */}
          <RestaurantStatsGrid 
            orders={orders}
            stats={stats}
            loading={loading}
          />

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
