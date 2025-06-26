"use client";

import { useParams, useRouter } from "next/navigation";
import RestaurantDetails from "@/components/features/restaurant/RestaurantDetails";
import { useRestaurantById } from "@/components/hooks/useRestaurantById";
import { Restaurant } from "@/types/menu/restaurant";
import { colors } from "@/app/constants";

export default function RestaurantPage() {
  const { id } = useParams();
  const router = useRouter();
  const restaurantId = Number(id);
  const { restaurant, loading, error } = useRestaurantById(restaurantId);

  if (loading) return <p>Chargement...</p>;
  if (error || !restaurant) return <p className="text-red-500">{error || "Introuvable"}</p>;

  const handleUpdate = async (data: Partial<Restaurant>) => {
    await fetch(`/api/proxy/restaurant/${restaurantId}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  const handleDelete = async () => {
    await fetch(`/api/proxy/restaurant/${restaurantId}`, {
      method: "DELETE",
      credentials: "include",
    });
    router.push("/profile");
  };
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <RestaurantDetails
        restaurant={restaurant}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
      <div className="flex justify-center gap-4">
        <button
          onClick={() => router.push(`/restaurants/${restaurantId}/items`)}
          className="px-6 py-3 rounded-lg font-medium"
          style={{
            backgroundColor: colors.secondary,
            color: "white",
          }}
        >
          Gérer le menu
        </button>
        <button
          onClick={() => router.push(`/restaurants/${restaurantId}/orders`)}
          className="px-6 py-3 rounded-lg font-medium bg-green-600 hover:bg-green-700 text-white"
        >
          Voir les commandes
        </button>
      </div>
    </div>
  );
}
