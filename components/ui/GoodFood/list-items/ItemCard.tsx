import React from "react";
import { MenuItem } from "@/types/menu/menuItem";
import MenuItemModal from "@/components/ui/GoodFood/menu-item-modal/MenuItemModal";
import { useItemModal } from "@/components/hooks/useItemModal";
import { getMenuItemImageUrl } from "@/lib/imageUtils";
import { Eye, EyeOff, Star, Percent, Settings } from "lucide-react";

interface ItemCardProps {
  item: MenuItem;
  onUpdate?: (updatedItem: MenuItem) => void;
  onDelete?: (itemId: number) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onUpdate, onDelete }) => {
  const { isOpen, open, close } = useItemModal();

  const handleUpdate = (updatedItem: MenuItem) => {
    if (onUpdate) {
      onUpdate(updatedItem);
    }
    close();
  };

  const handleDelete = (itemId: number) => {
    if (onDelete) {
      onDelete(itemId);
    }
    close();
  };

  const imageUrl = getMenuItemImageUrl(item);
  const hasPromotion = parseFloat(item.promotion?.toString() || "0") > 0;
  const hasOptions = item.menuItemOptions && item.menuItemOptions.length > 0;

  return (
    <>
      <div 
        onClick={open}
        className={`group relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
          !item.is_available ? 'opacity-75' : ''
        }`}
      >
        {/* Availability Badge */}
        <div className="absolute top-3 left-3 z-10">
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            item.is_available 
              ? 'bg-emerald-100 text-emerald-800' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {item.is_available ? (
              <>
                <Eye className="w-3 h-3" />
                <span>Disponible</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3 h-3" />
                <span>Indisponible</span>
              </>
            )}
          </div>
        </div>

        {/* Promotion Badge */}
        {hasPromotion && (
          <div className="absolute top-3 right-3 z-10">
            <div className="flex items-center space-x-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              <Percent className="w-3 h-3" />
              <span>-{item.promotion}%</span>
            </div>
          </div>
        )}

        {/* Image Container */}
        <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = "/GoodFood/logo.png";
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Edit Button (visible on hover) */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
              <Settings className="w-4 h-4 text-gray-700" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors">
              {item.name}
            </h3>
            <p className="text-gray-600 text-sm mt-1 leading-relaxed overflow-hidden" style={{ 
              display: '-webkit-box', 
              WebkitLineClamp: 2, 
              WebkitBoxOrient: 'vertical' 
            }}>
              {item.description || "Aucune description disponible"}
            </p>
          </div>

          {/* Price and Features */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">
                {item.price}€
              </span>
              {hasPromotion && (
                <span className="text-sm text-gray-500 line-through">
                  {(parseFloat(item.price?.toString() || "0") * (1 + parseFloat(item.promotion?.toString() || "0") / 100)).toFixed(2)}€
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {hasOptions && (
                <div className="text-blue-600" title="Article avec options">
                  <Settings className="w-4 h-4" />
                </div>
              )}
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Pos. {item.position}
              </div>
            </div>
          </div>

          {/* Options Count */}
          {hasOptions && (
            <div className="text-xs text-gray-500 bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
              {item.menuItemOptions.length} option{item.menuItemOptions.length > 1 ? 's' : ''} disponible{item.menuItemOptions.length > 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <MenuItemModal 
        item={item} 
        open={isOpen} 
        onClose={close} 
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </>
  );
};

export default ItemCard;
