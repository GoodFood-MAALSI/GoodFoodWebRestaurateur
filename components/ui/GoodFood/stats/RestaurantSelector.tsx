"use client";

import React from "react";
import { ChevronDown, Building2 } from "lucide-react";
import { COLORS } from "@/app/constants";

interface Restaurant {
  id: number;
  name: string;
  description: string;
  image?: string;
  is_open: boolean;
  review_count?: number;
  average_rating?: number;
}

interface RestaurantSelectorProps {
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  loading: boolean;
}

export default function RestaurantSelector({ 
  restaurants, 
  selectedRestaurant, 
  onSelectRestaurant, 
  loading 
}: RestaurantSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200"
        style={{ '--tw-ring-color': COLORS.primary } as React.CSSProperties}
      >
        <div className="flex items-center space-x-3">
          <Building2 className="w-5 h-5 text-gray-400" />
          <div className="text-left">
            {selectedRestaurant ? (
              <>
                <div className="font-medium text-gray-900">
                  {selectedRestaurant.name}
                </div>
                <div className="text-sm text-gray-500 truncate max-w-xs">
                  {selectedRestaurant.description}
                </div>
              </>
            ) : (
              <div className="text-gray-500">
                Sélectionnez un restaurant
              </div>
            )}
          </div>
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {restaurants.length === 0 ? (
            <div className="p-3 text-gray-500 text-center">
              Aucun restaurant trouvé
            </div>
          ) : (
            restaurants.map((restaurant) => (
              <button
                key={restaurant.id}
                onClick={() => {
                  onSelectRestaurant(restaurant);
                  setIsOpen(false);
                }}
                className="w-full text-left p-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">
                      {restaurant.name}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {restaurant.description}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {restaurant.is_open ? (
                      <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
                    ) : (
                      <span className="inline-block w-2 h-2 bg-red-400 rounded-full"></span>
                    )}
                    <span className="text-xs text-gray-400">
                      {restaurant.is_open ? 'Ouvert' : 'Fermé'}
                    </span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
