import { MapPin, Star, Clock } from "lucide-react";
import { COLORS } from "@/app/constants";
interface RestaurantCardProps {
  name: string;
  description: string;
  image?: string;
  isOpen?: boolean;
  averageRating?: number;
  reviewCount?: number;
  onClick?: () => void;
}
export const RestaurantCard = ({ 
  name, 
  description, 
  image, 
  isOpen = false, 
  averageRating = 0,
  reviewCount = 0,
  onClick 
}: RestaurantCardProps) => {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
    >
      <div className="relative overflow-hidden">
        {image ? (
          <img 
            src={image} 
            alt={name} 
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
            style={{
              width: '100%',
              height: '192px',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div 
            className="w-full h-48 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
              width: '100%',
              height: '192px',
            }}
          >
            <div className="text-white text-center">
              <div className="text-6xl mb-2">🍽️</div>
              <p className="text-lg font-semibold opacity-90">Aucune image</p>
            </div>
          </div>
        )}
        <div className="absolute top-4 right-4">
          {averageRating > 0 && (
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
              {reviewCount > 0 && (
                <span className="text-xs text-gray-500">({reviewCount})</span>
              )}
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-200">
          {name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>Restaurant</span>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            isOpen 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            <Clock className="w-3 h-3" />
            <span>{isOpen ? 'Ouvert' : 'Fermé'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
