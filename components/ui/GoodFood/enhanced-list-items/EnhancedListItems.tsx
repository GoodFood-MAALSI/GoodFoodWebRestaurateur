import React, { useState } from "react";
import { MenuCategory } from "@/types/menu/menuCategory";
import { MenuItem } from "@/types/menu/menuItem";
import CategoryCard from "../category-card/CategoryCard";
import ItemCard from "../list-items/ItemCard";
import { COLORS } from "@/app/constants";
import { 
  Grid3X3, 
  List, 
  Search, 
  Filter, 
  Eye, 
  EyeOff, 
  RotateCcw,
  ChefHat
} from "lucide-react";

interface EnhancedListItemsProps {
  categories: MenuCategory[];
  loading?: boolean;
}

type ViewMode = 'categories' | 'grid';
type FilterMode = 'all' | 'available' | 'unavailable';

const EnhancedListItems: React.FC<EnhancedListItemsProps> = ({ 
  categories, 
  loading = false 
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('categories');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});

  // Get all items from all categories
  const allItems = categories.flatMap(category => category.menuItems);
  
  // Filter items based on search and filter mode
  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    switch (filterMode) {
      case 'available':
        return matchesSearch && item.is_available;
      case 'unavailable':
        return matchesSearch && !item.is_available;
      default:
        return matchesSearch;
    }
  });

  // Filter categories based on search
  const filteredCategories = categories.map(category => ({
    ...category,
    menuItems: category.menuItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      switch (filterMode) {
        case 'available':
          return matchesSearch && item.is_available;
        case 'unavailable':
          return matchesSearch && !item.is_available;
        default:
          return matchesSearch;
      }
    })
  })).filter(category => category.menuItems.length > 0);

  const totalItems = allItems.length;
  const availableItems = allItems.filter(item => item.is_available).length;
  const unavailableItems = totalItems - availableItems;

  const toggleAllCategories = () => {
    const allExpanded = Object.values(expandedCategories).every(Boolean);
    const newState: Record<number, boolean> = {};
    categories.forEach(category => {
      newState[category.id] = !allExpanded;
    });
    setExpandedCategories(newState);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilterMode('all');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: COLORS.primary }}></div>
        <span className="ml-3 text-gray-600">Chargement des articles...</span>
      </div>
    );
  }

  if (totalItems === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <ChefHat className="w-16 h-16 mx-auto text-gray-300" />
        </div>
        <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.text.secondary }}>
          Aucun article trouvé
        </h3>
        <p style={{ color: COLORS.text.secondary }}>
          Commencez par ajouter votre premier article au menu !
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header with Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Gestion du Menu
            </h2>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Total: {totalItems} articles</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-gray-600">Disponibles: {availableItems}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="text-gray-600">Indisponibles: {unavailableItems}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">Catégories: {categories.length}</span>
            <div className="h-6 w-px bg-gray-300"></div>
            <span className="text-sm font-medium" style={{ color: COLORS.primary }}>
              {filteredItems.length} résultat{filteredItems.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-3">
            {/* Filter Buttons */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  filterMode === 'all' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setFilterMode('available')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
                  filterMode === 'available' 
                    ? 'bg-emerald-100 text-emerald-800 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>Disponibles</span>
              </button>
              <button
                onClick={() => setFilterMode('unavailable')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
                  filterMode === 'unavailable' 
                    ? 'bg-gray-200 text-gray-800 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <EyeOff className="w-3 h-3" />
                <span>Indisponibles</span>
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('categories')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'categories' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Vue par catégories"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Vue en grille"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>

            {/* Reset Button */}
            {(searchQuery || filterMode !== 'all') && (
              <button
                onClick={resetFilters}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                title="Réinitialiser les filtres"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            {/* Expand/Collapse All (only in categories view) */}
            {viewMode === 'categories' && (
              <button
                onClick={toggleAllCategories}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                title="Étendre/Réduire toutes les catégories"
              >
                {Object.values(expandedCategories).every(Boolean) ? 'Réduire tout' : 'Étendre tout'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="mb-4">
            <Search className="w-12 h-12 mx-auto text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-gray-600">
            Aucun résultat trouvé
          </h3>
          <p className="text-gray-500 mb-4">
            Essayez de modifier vos critères de recherche ou filtres
          </p>
          <button
            onClick={resetFilters}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Réinitialiser les filtres</span>
          </button>
        </div>
      ) : (
        <div>
          {viewMode === 'categories' ? (
            <div className="space-y-6">
              {filteredCategories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  defaultExpanded={expandedCategories[category.id] ?? true}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedListItems;
