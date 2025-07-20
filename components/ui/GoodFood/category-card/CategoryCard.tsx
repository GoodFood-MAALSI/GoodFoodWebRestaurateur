import React, { useState, useEffect } from "react";
import { MenuCategory } from "@/types/menu/menuCategory";
import ItemCard from "../list-items/ItemCard";
import { COLORS } from "@/app/constants";
import { ChevronDown, ChevronUp, Utensils, Clock, Star, Flame } from "lucide-react";
interface CategoryCardProps {
  category: MenuCategory;
  defaultExpanded?: boolean;
  categoryIndex?: number;
  isExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}
const CategoryCard: React.FC<CategoryCardProps> = ({ 
  category, 
  defaultExpanded = true,
  categoryIndex = 0,
  isExpanded: controlledExpanded,
  onExpandedChange
}) => {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  useEffect(() => {
    if (controlledExpanded === undefined) {
      setInternalExpanded(defaultExpanded);
    }
  }, [defaultExpanded, controlledExpanded]);

  const handleToggle = () => {
    if (onExpandedChange) {
      onExpandedChange(!isExpanded);
    } else {
      setInternalExpanded(!isExpanded);
    }
  };

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('entrée') || name.includes('starter') || name.includes('appetizer')) {
      return <Utensils className="w-5 h-5" />;
    }
    if (name.includes('plat') || name.includes('main') || name.includes('principal')) {
      return <Star className="w-5 h-5" />;
    }
    if (name.includes('dessert') || name.includes('sweet')) {
      return <Clock className="w-5 h-5" />;
    }
    if (name.includes('boisson') || name.includes('drink') || name.includes('beverage')) {
      return <Flame className="w-5 h-5" />;
    }
    return <Utensils className="w-5 h-5" />;
  };
  const getCategoryColor = (index: number) => {
    const colorPalette = [
      COLORS.primary,
      COLORS.secondary,
      COLORS.status.light,
      COLORS.status.medium,
      COLORS.status.dark,
      COLORS.status.darker,
      '#10B981',
      '#F59E0B',
      '#EC4899',
      '#3B82F6',
      '#8B5CF6',
      '#F97316',
    ];
    
    return colorPalette[index % colorPalette.length];
  };
  const categoryColor = getCategoryColor(categoryIndex);
  const availableItems = category.menuItems.filter(item => item.is_available);
  const unavailableItems = category.menuItems.filter(item => !item.is_available);
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* Category Header */}
      <div 
        className="cursor-pointer select-none"
        onClick={handleToggle}
      >
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="p-2 rounded-lg text-white"
                style={{ backgroundColor: categoryColor }}
              >
                {getCategoryIcon(category.name)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-500">
                  {category.menuItems.length} article{category.menuItems.length > 1 ? 's' : ''}
                  {availableItems.length !== category.menuItems.length && (
                    <span className="ml-2 text-emerald-600">
                      ({availableItems.length} disponible{availableItems.length > 1 ? 's' : ''})
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div 
                className="px-3 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: categoryColor }}
              >
                Position {category.position}
              </div>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Category Content */}
      {isExpanded && (
        <div className="p-6">
          {category.menuItems.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🍽️</div>
              <p className="text-gray-500">Aucun article dans cette catégorie</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Available Items */}
              {availableItems.length > 0 && (
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      Articles disponibles ({availableItems.length})
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {availableItems.map((item) => (
                      <ItemCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              )}
              {/* Unavailable Items */}
              {unavailableItems.length > 0 && (
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                    <h4 className="text-lg font-semibold text-gray-500">
                      Articles indisponibles ({unavailableItems.length})
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 opacity-60">
                    {unavailableItems.map((item) => (
                      <ItemCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default CategoryCard;
