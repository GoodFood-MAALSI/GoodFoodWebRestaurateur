import React, { useState } from "react";
import { Order, OrderStatusType } from "@/types/order";
import OrderCard from "./OrderCard";
import OrderDetailModal from "./OrderDetailModal";
import { Button } from "@/components/ui/shadcn/button";
import { Badge } from "@/components/ui/shadcn/badge";
import { RefreshCw } from "lucide-react";
import { COLORS } from "@/app/constants";

interface OrdersListProps {
  orders: Order[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onStatusChange: (orderId: number, status: OrderStatusType) => Promise<void>;
  title?: string;
  showRestaurantFilter?: boolean;
}

const statusFilters: { label: string; value: OrderStatusType | "all" }[] = [
  { label: "Toutes", value: "all" },
  { label: "En attente", value: "pending" },
  { label: "Acceptées", value: "accepted" },
  { label: "En préparation", value: "preparing" },
  { label: "Prêtes", value: "ready" },
  { label: "Livrées", value: "delivered" },
  { label: "Annulées", value: "cancelled" },
];

export default function OrdersList({
  orders,
  loading,
  error,
  onRefresh,
  onStatusChange,
  title = "Commandes",
  showRestaurantFilter = false,
}: OrdersListProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatusType | "all">("all");
  const [restaurantFilter, setRestaurantFilter] = useState<number | "all">("all");

  const handleOrderUpdate = (updatedOrder: Order) => {
    setSelectedOrder(updatedOrder);
  };

  const getStatusString = (status: any): string => {
    if (typeof status === 'object' && status.name) {
      return status.name.toLowerCase();
    }
    return String(status).toLowerCase();
  };

  const filteredOrders = orders.filter((order) => {
    const orderStatus = getStatusString(order.status);
    const statusMatch = statusFilter === "all" || orderStatus === statusFilter;
    const restaurantMatch = 
      !showRestaurantFilter || 
      restaurantFilter === "all" || 
      order.restaurant?.id === restaurantFilter;
    return statusMatch && restaurantMatch;
  });

  const restaurants = showRestaurantFilter 
    ? Array.from(new Set(orders.map(order => order.restaurant?.id).filter(Boolean)))
        .map(id => orders.find(order => order.restaurant?.id === id)?.restaurant)
        .filter(Boolean)
    : [];

  const getStatusCount = (status: OrderStatusType | "all") => {
    if (status === "all") return orders.length;
    return orders.filter(order => getStatusString(order.status) === status).length;
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <RefreshCw className="w-6 h-6 animate-spin" />
        <span className="ml-2">Chargement des commandes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p style={{ color: COLORS.error }} className="mb-4">{error}</p>
        <Button onClick={onRefresh} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Button onClick={onRefresh} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Filtrer par statut</h3>
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <Badge
                key={filter.value}
                variant={statusFilter === filter.value ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => setStatusFilter(filter.value)}
              >
                {filter.label} ({getStatusCount(filter.value)})
              </Badge>
            ))}
          </div>
        </div>

        {showRestaurantFilter && restaurants.length > 1 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Filtrer par restaurant</h3>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={restaurantFilter === "all" ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => setRestaurantFilter("all")}
              >
                Tous les restaurants
              </Badge>
              {restaurants.map((restaurant) => (
                <Badge
                  key={restaurant!.id}
                  variant={restaurantFilter === restaurant!.id ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => setRestaurantFilter(restaurant!.id)}
                >
                  {restaurant!.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Aucune commande trouvée</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={onStatusChange}
              onView={setSelectedOrder}
            />
          ))}
        </div>
      )}

      <OrderDetailModal
        order={selectedOrder}
        isOpen={selectedOrder !== null}
        onClose={() => setSelectedOrder(null)}
        onStatusChange={onStatusChange}
        onOrderUpdate={handleOrderUpdate}
      />
    </div>
  );
}
