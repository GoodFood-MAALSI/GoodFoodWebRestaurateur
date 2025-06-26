"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/shadcn/button";
import { Plus } from "lucide-react";
import { RestaurantCard } from "@/components/ui/GoodFood/restaurant-card/RestaurantCard";
import { useRestaurants } from "@/components/hooks/useRestaurants";
import { TEXTS } from "./constants";

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
    <div className="min-h-screen flex flex-col">
      <main className="w-full max-w-[1400px] mx-auto px-6 pt-20 pb-10 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{TEXTS.pageTitle}</h1>
          <Button onClick={handleCreateRestaurant} className="flex items-center gap-2">
            <Plus size={18} />
            {TEXTS.createButton}
          </Button>
        </div>

        {loading ? (
          <p>Chargement...</p>
        ) : error ? (
          <p className="text-red-500">Erreur: {error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                onClick={() => handleRedirectToRestaurant(restaurant.id)}
                className="cursor-pointer"
              >
                <RestaurantCard
                  name={restaurant.name}
                  description={restaurant.description}
                  image={restaurant.image}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default RestaurantListPage;
