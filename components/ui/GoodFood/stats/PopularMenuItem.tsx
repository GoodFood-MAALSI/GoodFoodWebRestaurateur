"use client";
import React from "react";
import { COLORS } from "@/app/constants";
import { MenuItem } from "@/types/stats";
import { Crown, Euro } from "lucide-react";
interface PopularMenuItemProps {
  menuItem: MenuItem;
  itemCount: number;
}
export default function PopularMenuItem({ menuItem, itemCount }: PopularMenuItemProps) {
  const hasPromotion = parseFloat(menuItem.promotion) > 0;
  const originalPrice = parseFloat(menuItem.price);
  const promotionPrice = originalPrice - parseFloat(menuItem.promotion);
  return (
    <div className="p-6 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="p-3 rounded-lg"
            style={{ 
              backgroundColor: COLORS.warning + '20',
              color: COLORS.warning 
            }}
          >
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Article le plus populaire
            </h3>
            <p className="text-sm text-gray-500">
              Commandé {itemCount} fois
            </p>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-2">
              {menuItem.name}
            </h4>
            <div className="flex items-center space-x-2">
              <Euro className="w-4 h-4 text-gray-600" />
              {hasPromotion ? (
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-green-600">
                    {promotionPrice.toFixed(2)}€
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {originalPrice.toFixed(2)}€
                  </span>
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                    -{menuItem.promotion}€
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-gray-900">
                  {originalPrice.toFixed(2)}€
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg">
              <div className="text-2xl font-bold">
                {itemCount}
              </div>
              <div className="text-xs font-medium">
                commandes
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
