"use client";
import React, { useState, useEffect } from "react";
import { useRestaurants } from "@/components/hooks/useRestaurants";
import { useCurrentUserId } from "@/components/hooks/useCurrentUserId";
import { useRestaurantStats } from "@/components/hooks/useRestaurantStats";
import StatsCard from "@/components/ui/GoodFood/stats/StatsCard";
import PopularMenuItem from "@/components/ui/GoodFood/stats/PopularMenuItem";
import RestaurantSelector from "@/components/ui/GoodFood/stats/RestaurantSelector";
import { COLORS } from "@/app/constants";
import { 
  BarChart3, 
  ShoppingBag, 
  Euro, 
  TrendingUp, 
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { Toaster } from "@/components/ui/shadcn/sonner";
interface Restaurant {
  id: number;
  name: string;
  description: string;
  image?: string;
  is_open: boolean;
  review_count?: number;
  average_rating?: number;
}
export default function StatsPage() {
  const { userId, loading: userLoading } = useCurrentUserId();
  const { restaurants, loading: restaurantsLoading } = useRestaurants();
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const { stats, loading: statsLoading, error: statsError, refetch } = useRestaurantStats(
    selectedRestaurant?.id || null
  );
  useEffect(() => {
    if (restaurants.length > 0 && !selectedRestaurant) {
      setSelectedRestaurant(restaurants[0]);
    }
  }, [restaurants, selectedRestaurant]);
  const handleRefresh = () => {
    refetch();
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
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <BarChart3 className="w-8 h-8" style={{ color: COLORS.primary }} />
                <span>Statistiques</span>
              </h1>
              <p className="text-gray-600 mt-2">
                Analysez les performances de vos restaurants
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={statsLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ '--tw-ring-color': COLORS.primary } as React.CSSProperties}
            >
              <RefreshCw className={`w-4 h-4 ${statsLoading ? 'animate-spin' : ''}`} />
              <span>Actualiser</span>
            </button>
          </div>
        </div>
        {/* Restaurant Selector */}
        <div className="mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Sélectionner un restaurant
            </h2>
            <RestaurantSelector
              restaurants={restaurants}
              selectedRestaurant={selectedRestaurant}
              onSelectRestaurant={setSelectedRestaurant}
              loading={restaurantsLoading}
            />
          </div>
        </div>
        {/* Stats Content */}
        {!selectedRestaurant && !restaurantsLoading ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun restaurant sélectionné
            </h3>
            <p className="text-gray-600">
              Sélectionnez un restaurant pour voir ses statistiques
            </p>
          </div>
        ) : statsError ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Erreur de chargement
            </h3>
            <p className="text-gray-600 mb-4">{statsError}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
            >
              Réessayer
            </button>
          </div>
        ) : statsLoading ? (
          <div className="space-y-8">
            {/* Loading skeleton for stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="w-24 h-4 bg-gray-200 rounded"></div>
                      <div className="w-16 h-8 bg-gray-200 rounded"></div>
                      <div className="w-20 h-3 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Loading skeleton for popular menu item */}
            <div className="animate-pulse">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="space-y-2">
                    <div className="w-48 h-5 bg-gray-200 rounded"></div>
                    <div className="w-32 h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="space-y-3">
                    <div className="w-64 h-5 bg-gray-200 rounded"></div>
                    <div className="w-40 h-6 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : stats ? (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Nombre de commandes"
                value={stats.order_count}
                subtitle="Commandes totales"
                icon={ShoppingBag}
                color={COLORS.primary}
              />
              <StatsCard
                title="Chiffre d'affaires"
                value={formatCurrency(stats.revenue)}
                subtitle="Revenue total"
                icon={Euro}
                color={COLORS.secondary}
              />
              <StatsCard
                title="Articles vendus"
                value={stats.item_count}
                subtitle="Articles au total"
                icon={BarChart3}
                color={COLORS.status.medium}
              />
              <StatsCard
                title="Panier moyen"
                value={formatCurrency(calculateAverageOrderValue())}
                subtitle="Par commande"
                icon={TrendingUp}
                color={COLORS.status.darker}
              />
            </div>
            {/* Popular Menu Item */}
            <PopularMenuItem 
              menuItem={stats.menu_item}
              itemCount={stats.item_count}
            />
            {/* Additional insights */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Article star
                  </h4>
                  <p className="text-blue-700 text-sm">
                    {stats.menu_item ? (
                      `"${stats.menu_item.name}" représente votre article le plus commandé avec ${stats.item_count} ventes.`
                    ) : (
                      `Aucun article populaire identifié pour le moment.`
                    )}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900 mb-2">
                    Performance
                  </h4>
                  <p className="text-green-700 text-sm">
                    Votre panier moyen est de {formatCurrency(calculateAverageOrderValue())} 
                    avec {stats.order_count} commande{stats.order_count > 1 ? 's' : ''} au total.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune donnée disponible
            </h3>
            <p className="text-gray-600">
              Il n'y a pas encore de statistiques pour ce restaurant
            </p>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
}
