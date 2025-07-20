"use client";

import React, { useState } from "react";
import { useAllRestaurantOrders } from "@/components/hooks/useAllRestaurantOrders";
import OrdersList from "@/components/ui/GoodFood/orders/OrdersList";
import { Pagination } from "@/components/ui/GoodFood/pagination/Pagination";
import { Toaster } from "@/components/ui/shadcn/sonner";
import { toast } from "sonner";
import { COLORS, ORDER_STATUS_COLORS, ORDER_STATUS_TEXT_COLORS } from "@/app/constants";
import { OrderStatusType } from "@/types/order";

export default function OrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined);

  const { 
    restaurantOrders, 
    allOrders, 
    allOrdersPagination,
    loading, 
    error, 
    refetch, 
    updateOrderStatus 
  } = useAllRestaurantOrders(13, {
    page: currentPage,
    limit: itemsPerPage,
    statusId: statusFilter,
  });

  const handleStatusChange = async (orderId: number, status: OrderStatusType) => {
    try {
      await updateOrderStatus(orderId, status);
      toast.success("Statut de la commande mis à jour");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
      throw error;
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1); // Reset to first page when changing limit
  };

  const handleStatusFilterChange = (statusId: number | undefined) => {
    setStatusFilter(statusId);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  const getStatusString = (status: unknown): string => {
    if (typeof status === 'object' && status !== null && 'name' in status) {
      return String((status as { name: string }).name).toLowerCase();
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
          
          {/* Status Filter Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => handleStatusFilterChange(undefined)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === undefined
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Toutes les commandes
            </button>
            <button
              onClick={() => handleStatusFilterChange(1)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 1
                  ? 'text-white'
                  : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor: statusFilter === 1 ? ORDER_STATUS_COLORS.pending : ORDER_STATUS_COLORS.pending,
                color: statusFilter === 1 ? 'white' : ORDER_STATUS_TEXT_COLORS.pending,
              }}
            >
              En attente
            </button>
            <button
              onClick={() => handleStatusFilterChange(2)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 2
                  ? 'text-white'
                  : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor: statusFilter === 2 ? ORDER_STATUS_COLORS.accepted : ORDER_STATUS_COLORS.accepted,
                color: statusFilter === 2 ? 'white' : ORDER_STATUS_TEXT_COLORS.accepted,
              }}
            >
              Acceptées
            </button>
            <button
              onClick={() => handleStatusFilterChange(3)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 3
                  ? 'text-white'
                  : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor: statusFilter === 3 ? ORDER_STATUS_COLORS.preparing : ORDER_STATUS_COLORS.preparing,
                color: statusFilter === 3 ? 'white' : ORDER_STATUS_TEXT_COLORS.preparing,
              }}
            >
              En préparation
            </button>
            <button
              onClick={() => handleStatusFilterChange(5)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 5
                  ? 'text-white'
                  : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor: statusFilter === 5 ? ORDER_STATUS_COLORS.delivered : ORDER_STATUS_COLORS.delivered,
                color: statusFilter === 5 ? 'white' : ORDER_STATUS_TEXT_COLORS.delivered,
              }}
            >
              Livrées
            </button>
          </div>
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
            <span className="ml-3">
              {currentPage > 1 ? `Chargement de la page ${currentPage}...` : "Chargement des commandes..."}
            </span>
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
              Vous n&apos;avez pas encore reçu de commandes.
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
              title={`Toutes les commandes${statusFilter ? ' filtrées' : ''}`}
              showRestaurantFilter={true}
            />
            
            {/* Pagination Controls */}
            {allOrdersPagination && allOrdersPagination.totalPages > 1 && (
              <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
                <Pagination
                  currentPage={allOrdersPagination.currentPage}
                  totalPages={allOrdersPagination.totalPages}
                  totalItems={allOrdersPagination.totalItems}
                  itemsPerPage={allOrdersPagination.itemsPerPage}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                  disabled={loading}
                  showItemsPerPage={true}
                />
              </div>
            )}
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
