"use client";

import { useParams, useRouter } from "next/navigation";
import RestaurantDetails from "@/components/features/restaurant/RestaurantDetails";
import { useRestaurantById } from "@/components/hooks/useRestaurantById";
import { useRestaurantStats } from "@/components/hooks/useRestaurantStats";
import { COLORS } from "@/app/constants";
import { Star, Utensils, ShoppingBag, TrendingUp, Users, Clock, ArrowLeft, Euro, Package } from "lucide-react";
import { Switch } from "@/components/ui/shadcn/switch";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/shadcn/sonner";
import { useState } from "react";
import Minimap from "@/components/ui/GoodFood/Minimap";

const StarRating = ({ rating, maxStars = 5 }: { rating: number; maxStars?: number }) => {
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: maxStars }, (_, index) => {
        const fillPercentage = Math.max(0, Math.min(100, (rating - index) * 100));
        
        return (
          <div key={index} className="relative">
            <Star className="w-6 h-6 text-gray-300" />
            <div 
              className="absolute top-0 left-0 overflow-hidden"
              style={{ width: `${fillPercentage}%` }}
            >
              <Star className="w-6 h-6 text-yellow-400 fill-current" />
            </div>
          </div>
        );
      })}
      <span className="ml-2 text-sm font-medium text-gray-600">
        {rating.toFixed(1)} / {maxStars}
      </span>
    </div>
  );
};

export default function RestaurantPage() {
  const { id } = useParams();
  const router = useRouter();
  const restaurantId = Number(id);
  const { restaurant, loading, error } = useRestaurantById(restaurantId);
  const { stats, loading: statsLoading } = useRestaurantStats(restaurantId);
  const [isToggling, setIsToggling] = useState(false);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: COLORS.primary }}></div>
    </div>
  );
  
  if (error || !restaurant) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">😕</div>
        <p className="text-xl font-semibold" style={{ color: COLORS.error }}>
          {error || "Restaurant introuvable"}
        </p>
      </div>
    </div>
  );

  const restaurantFormData = {
    id: restaurant.id,
    name: restaurant.name,
    description: restaurant.description,
    street_number: restaurant.street_number,
    street: restaurant.street,
    city: restaurant.city,
    postal_code: restaurant.postal_code,
    country: restaurant.country,
    email: restaurant.email,
    phone_number: restaurant.phone_number,
    siret: restaurant.siret,
    is_open: restaurant.is_open,
    restaurantTypeId: restaurant.restaurantTypeId.toString(),
    images: restaurant.images
  };

  const handleUpdate = async (data: Partial<typeof restaurantFormData>) => {
    const apiData = {
      ...data,
      restaurantTypeId: data.restaurantTypeId ? Number(data.restaurantTypeId) : restaurant.restaurantTypeId
    };
    
    await fetch(`/api/proxy/restaurant/${restaurantId}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(apiData),
    });
  };

  const handleDelete = async () => {
    await fetch(`/api/proxy/restaurant/${restaurantId}`, {
      method: "DELETE",
      credentials: "include",
    });
    router.push("/profile");
  };

  const handleToggleStatus = async () => {
    if (!restaurant) return;
    
    setIsToggling(true);
    try {
      const updatedData = {
        is_open: !restaurant.is_open
      };
      
      const response = await fetch(`/api/proxy/restaurant/${restaurantId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du statut');
      }

      window.location.reload();
      
      toast.success(
        restaurant.is_open 
          ? "Restaurant fermé avec succès" 
          : "Restaurant ouvert avec succès"
      );
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut");
      console.error('Error toggling restaurant status:', error);
    } finally {
      setIsToggling(false);
    }
  };

  const averageRating = restaurant.average_rating || 0;
  const totalReviews = restaurant.review_count || 0;
  const hasReviews = totalReviews > 0;

  // Real stats data or fallbacks
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Use real stats or show loading/fallback values
  const displayStats = {
    ordersCount: stats ? stats.order_count : (statsLoading ? '...' : 0),
    revenue: stats ? formatCurrency(stats.revenue) : (statsLoading ? '...' : formatCurrency(0)),
    itemsSold: stats ? stats.item_count : (statsLoading ? '...' : 0),
    popularItem: stats && stats.menu_item ? stats.menu_item.name : (statsLoading ? 'Chargement...' : 'Aucune donnée')
  };
  
  const mainImage = restaurant.images?.find(img => img.isMain);
  const imageUrl = mainImage?.path || restaurant.images?.[0]?.path;
  const fullImageUrl = imageUrl 
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'}/restaurateur/api${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`
    : null;

  // Only show real rating breakdown if we have reviews
  const ratingBreakdown: { stars: number; count: number; percentage: number }[] = hasReviews ? [
    // This would come from real API data in the future
    // For now, we don't show breakdown without real data
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Toaster />

      <div className="relative h-120 overflow-hidden w-full z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
          style={{
            backgroundImage: fullImageUrl
              ? `url(${fullImageUrl})`
              : `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20" />
        </div>

        <div className="relative z-10 h-full flex flex-col">
          <div className="p-6">
            <button
              onClick={() => router.back()}
              className="group flex items-center space-x-2 px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Retour</span>
            </button>
          </div>

          <div className="px-6 pt-4 pb-8">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
              <div className="text-center text-white flex-1">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-4xl">
                    🍽️
                  </div>
                </div>
                <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
                  {restaurant.name}
                </h1>
                <p className="text-xl text-white/90 max-w-2xl mx-auto mb-6 drop-shadow">
                  {restaurant.description}
                </p>
                
                <div className="flex items-center justify-center space-x-6">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-white/30 ${
                    restaurant.is_open 
                      ? 'bg-green-500/80 text-white' 
                      : 'bg-red-500/80 text-white'
                  }`}>
                    {restaurant.is_open ? '🟢 Ouvert' : '🔴 Fermé'}
                  </span>
                  
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-white font-medium">{averageRating.toFixed(1)}</span>
                    <span className="text-white/80 text-sm">({totalReviews} avis)</span>
                  </div>
                </div>
              </div>

              <div className="ml-8 w-80 h-64">
                <Minimap 
                  latitude={restaurant.lat ? parseFloat(restaurant.lat) : 48.8566} 
                  longitude={restaurant.long ? parseFloat(restaurant.long) : 2.3522}
                  address={`${restaurant.street_number || ''} ${restaurant.street || ''}, ${restaurant.city || ''}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto py-12 px-4 space-y-8">
          

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100 transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4" style={{ backgroundColor: COLORS.secondary + '20' }}>
                <Utensils className="w-6 h-6" style={{ color: COLORS.secondary }} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Type de cuisine</h3>
                <p className="text-xl font-bold" style={{ color: COLORS.text.primary }}>
                  {restaurant.restaurantType?.name || 'Non spécifié'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100 transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4" style={{ backgroundColor: COLORS.primary + '20' }}>
                <ShoppingBag className="w-6 h-6" style={{ color: COLORS.primary }} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Commandes totales</h3>
                <p className="text-xl font-bold" style={{ color: COLORS.text.primary }}>
                  {displayStats.ordersCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100 transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4" style={{ backgroundColor: COLORS.success + '20' }}>
                <Euro className="w-6 h-6" style={{ color: COLORS.success }} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Chiffre d&apos;affaires</h3>
                <p className="text-xl font-bold" style={{ color: COLORS.text.primary }}>
                  {displayStats.revenue}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100 transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4" style={{ backgroundColor: COLORS.status.medium + '20' }}>
                <Package className="w-6 h-6" style={{ color: COLORS.status.medium }} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Articles vendus</h3>
                <p className="text-xl font-bold" style={{ color: COLORS.text.primary }}>
                  {displayStats.itemsSold}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Menu Item Section */}
        {stats && stats.menu_item && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Article le plus populaire
                    </h3>
                    <p className="text-xl font-bold text-gray-800">
                      {stats.menu_item.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(parseFloat(stats.menu_item.price))} • {stats.item_count} ventes
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg">
                    <div className="text-2xl font-bold">#{stats.menu_item_id}</div>
                    <div className="text-xs font-medium">ID Article</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <RestaurantDetails
              restaurant={restaurantFormData}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
            
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-4 h-4 rounded-full ${restaurant.is_open ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Statut du restaurant
                    </h3>
                    <p className="text-sm text-gray-600">
                      {restaurant.is_open 
                        ? "Votre restaurant est actuellement ouvert et peut recevoir des commandes" 
                        : "Votre restaurant est actuellement fermé et ne reçoit pas de commandes"
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    restaurant.is_open 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {restaurant.is_open ? '🟢 Ouvert' : '🔴 Fermé'}
                  </span>
                  <Switch
                    checked={restaurant.is_open}
                    onCheckedChange={handleToggleStatus}
                    disabled={isToggling}
                    className="data-[state=checked]:bg-green-600"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <Star className="w-6 h-6 mr-2" style={{ color: COLORS.warning }} />
                  <h2 className="text-2xl font-bold" style={{ color: COLORS.text.primary }}>
                    Évaluations
                  </h2>
                </div>

                {hasReviews ? (
                  <>
                    <div className="text-center mb-6 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                      <div className="text-5xl font-bold mb-2" style={{ color: COLORS.text.primary }}>
                        {averageRating.toFixed(1)}
                      </div>
                      <StarRating rating={averageRating} />
                      <p className="text-sm text-gray-600 mt-2">
                        Basé sur {totalReviews} avis
                      </p>
                    </div>

                    {ratingBreakdown.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700 mb-3">Détail des notes</h3>
                        {ratingBreakdown.map((rating) => (
                          <div key={rating.stars} className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <span className="text-sm font-medium w-2">{rating.stars}</span>
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            </div>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-yellow-400 transition-all duration-300"
                                style={{ width: `${rating.percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 w-8 text-right">
                              {rating.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <Star className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucun avis pour le moment</h3>
                    <p className="text-gray-500 text-sm">
                      Les premiers avis de vos clients apparaîtront ici.
                    </p>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <Users className="w-4 h-4 mr-1 text-gray-500" />
                    </div>
                    <p className="text-2xl font-bold" style={{ color: COLORS.text.primary }}>{totalReviews}</p>
                    <p className="text-xs text-gray-500">Avis clients</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <Clock className="w-4 h-4 mr-1 text-gray-500" />
                    </div>
                    <p className="text-2xl font-bold" style={{ color: COLORS.text.primary }}>
                      {hasReviews && averageRating >= 4 ? `${Math.round((averageRating / 5) * 100)}%` : '-'}
                    </p>
                    <p className="text-xs text-gray-500">Satisfaction</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-6 mt-8">
          <button
            onClick={() => router.push(`/restaurants/${restaurantId}/items`)}
            className="group relative px-8 py-4 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            style={{ backgroundColor: COLORS.secondary }}
          >
            <div className="flex items-center space-x-3">
              <Utensils className="w-5 h-5" />
              <span>Gérer le menu</span>
            </div>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-200"></div>
          </button>
          
          <button
            onClick={() => router.push(`/restaurants/${restaurantId}/orders`)}
            className="group relative px-8 py-4 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            style={{ backgroundColor: COLORS.primary }}
          >
            <div className="flex items-center space-x-3">
              <ShoppingBag className="w-5 h-5" />
              <span>Voir les commandes</span>
            </div>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-200"></div>
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
