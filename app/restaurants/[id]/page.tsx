"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader } from "@/components/ui/shadcn/card";
import { Button } from "@/components/ui/shadcn/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/shadcn/avatar";
import { Plus } from "lucide-react";

const mockRestaurants = [
  {
    id: 1,
    name: "Le Gourmet Express",
    image: "/images/gourmet.jpg",
    description: "Cuisine française rapide et raffinée.",
  },
  {
    id: 2,
    name: "Pasta Fresca",
    image: "/images/pasta.jpg",
    description: "Spécialités italiennes faites maison.",
  },
];

const RestaurantCard: React.FC<{
  name: string;
  image: string;
  description: string;
}> = ({ name, image, description }) => {
  return (
    <Card className="shadow-md transition-all hover:shadow-xl">
      <CardHeader className="flex items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-bold">{name}</h2>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </CardHeader>
    </Card>
  );
};

const RestaurantListPage: React.FC = () => {
  const router = useRouter();

  const handleCreateRestaurant = () => {
    router.push("/creer-restaurant");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="w-full max-w-[1400px] mx-auto px-6 pt-20 pb-10 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Mes restaurants</h1>
          <Button onClick={handleCreateRestaurant} className="flex items-center gap-2">
            <Plus size={18} />
            Nouveau restaurant
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              name={restaurant.name}
              image={restaurant.image}
              description={restaurant.description}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default RestaurantListPage;