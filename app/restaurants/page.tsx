"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/shadcn/button";
import { Plus } from "lucide-react";
import { RestaurantCard } from "@/components/ui/GoodFood/restaurant-card/RestaurantCard";
import { useRestaurants } from "@/components/hooks/useRestaurants";
import { TEXTS } from "./constants";
import { COLORS } from "@/app/constants";

const RestaurantListPage = () => {
  const router = useRouter();
  const { restaurants, loading, error } = useRestaurants(1);

  const handleCreateRestaurant = () => {
    router.push("/create-company");
  };

  const handleRedirectToRestaurant = (id: number) => {
    router.push(`/restaurants/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="w-full max-w-[1400px] mx-auto px-6 pt-8 pb-10 space-y-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{TEXTS.pageTitle}</h1>
              <p className="text-gray-600">Gérez et visualisez tous vos restaurants en un coup d'œil</p>
            </div>
            <Button 
              onClick={handleCreateRestaurant} 
              className="flex items-center gap-2 px-6 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
              style={{ backgroundColor: COLORS.primary }}
            >
              <Plus size={20} />
              {TEXTS.createButton}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mb-4" style={{ borderColor: COLORS.primary }}></div>
            <p className="text-gray-600 text-lg">Chargement de vos restaurants...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <div className="text-red-600 text-xl font-semibold mb-2">Une erreur est survenue</div>
            <p className="text-red-700">{error}</p>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Plus size={32} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Aucun restaurant trouvé</h3>
              <p className="text-gray-600 mb-8">Commencez par créer votre premier restaurant pour gérer vos commandes et votre menu.</p>
              <Button 
                onClick={handleCreateRestaurant}
                className="px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                style={{ backgroundColor: COLORS.primary }}
              >
                <Plus size={20} className="mr-2" />
                Créer mon premier restaurant
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-800">
                Mes restaurants ({restaurants.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  onClick={() => handleRedirectToRestaurant(restaurant.id)}
                  className="cursor-pointer transform hover:scale-105 transition-all duration-200 hover:shadow-xl"
                >
                  <RestaurantCard
                    name={restaurant.name}
                    description={restaurant.description}
                    image={restaurant.image}
                    isOpen={restaurant.is_open}
                    averageRating={restaurant.average_rating}
                    reviewCount={restaurant.review_count}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RestaurantListPage;
