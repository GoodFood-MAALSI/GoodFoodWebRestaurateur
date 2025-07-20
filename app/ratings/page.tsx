"use client";
import React, { useState } from 'react';
import { useCurrentUser } from '@/components/hooks/useCurrentUser';
import { useReviews } from '@/components/hooks/useReviews';
import { Button } from '@/components/ui/shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card';
import { Badge } from '@/components/ui/shadcn/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/shadcn/select';
import { Pagination } from '@/components/ui/GoodFood/pagination/Pagination';
import { 
  Star, 
  User, 
  Calendar,
  MessageSquare,
  TrendingUp,
  Users,
  BarChart3,
  RefreshCw,
  Filter
} from 'lucide-react'; 
export default function RatingsPage() {
  const { restaurants, loading: userLoading } = useCurrentUser();
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [ratingFilter, setRatingFilter] = useState<number | undefined>(undefined);
  const currentRestaurantId = selectedRestaurantId || (restaurants && restaurants.length > 0 ? restaurants[0].id : null);
  const { reviews, pagination, loading, error, fetchReviews, stats } = useReviews(
    currentRestaurantId || undefined,
    {
      page: currentPage,
      limit: itemsPerPage,
      rating: ratingFilter,
    }
  );
  const currentRestaurant = restaurants?.find(r => r.id === currentRestaurantId);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };
  const handleRestaurantChange = (restaurantId: number) => {
    setSelectedRestaurantId(restaurantId);
    setCurrentPage(1);
    setRatingFilter(undefined);
  };
  const handleRatingFilterChange = (rating: string) => {
    if (rating === 'all') {
      setRatingFilter(undefined);
    } else {
      setRatingFilter(parseInt(rating));
    }
    setCurrentPage(1);
  };
  const StarRating = ({ rating, onRatingChange, readonly = false }: { 
    rating: number; 
    onRatingChange?: (rating: number) => void;
    readonly?: boolean;
  }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onRatingChange?.(star)}
            className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
          >
            <Star
              size={20}
              className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
            />
          </button>
        ))}
      </div>
    );
  };
  const RatingDistribution = () => {
    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution];
          const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
          return (
            <div key={rating} className="flex items-center gap-3">
              <span className="text-sm font-medium w-3">{rating}</span>
              <Star size={16} className="fill-yellow-400 text-yellow-400" />
              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-yellow-400 h-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-8">{count}</span>
            </div>
          );
        })}
      </div>
    );
  };
  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin" />
        <span className="ml-2">Chargement...</span>
      </div>
    );
  }
  if (!restaurants || restaurants.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Aucun restaurant trouvé</h1>
            <p className="text-gray-600">Vous devez d&apos;abord créer un restaurant pour gérer les avis.</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Avis et Évaluations</h1>
          <p className="text-gray-600">Gérez les avis clients de vos restaurants</p>
        </div>
        {restaurants.length > 1 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Sélectionner un restaurant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {restaurants.map((restaurant) => (
                  <Button
                    key={restaurant.id}
                    variant={currentRestaurantId === restaurant.id ? "default" : "outline"}
                    onClick={() => handleRestaurantChange(restaurant.id)}
                    className="flex items-center gap-2"
                  >
                    {restaurant.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        {currentRestaurant && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Note moyenne</p>
                      <div className="flex items-center gap-2">
                        <p className="text-3xl font-bold">{stats.averageRating.toFixed(1)}</p>
                        <StarRating rating={Math.round(stats.averageRating)} readonly />
                      </div>
                    </div>
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total avis</p>
                      <p className="text-3xl font-bold">{stats.totalReviews}</p>
                    </div>
                    <MessageSquare className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Restaurant</p>
                      <p className="text-xl font-bold">{currentRestaurant.name}</p>
                    </div>
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Répartition des notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <RatingDistribution />
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <CardTitle>Tous les avis ({pagination?.totalItems || stats.totalReviews})</CardTitle>
                  <div className="flex items-center gap-4">
                    {/* Rating Filter */}
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      <Select
                        value={ratingFilter?.toString() || 'all'}
                        onValueChange={handleRatingFilterChange}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Filtre" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes notes</SelectItem>
                          <SelectItem value="5">5 étoiles</SelectItem>
                          <SelectItem value="4">4 étoiles</SelectItem>
                          <SelectItem value="3">3 étoiles</SelectItem>
                          <SelectItem value="2">2 étoiles</SelectItem>
                          <SelectItem value="1">1 étoile</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={fetchReviews}
                      variant="outline"
                      size="sm"
                      disabled={loading}
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                      Actualiser
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                    Chargement des avis...
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-red-600">
                    <p>{error}</p>
                    <Button onClick={fetchReviews} variant="outline" className="mt-4">
                      Réessayer
                    </Button>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p>Aucun avis pour le moment</p>
                    <p className="text-sm">Les avis apparaîtront ici une fois publiés</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {review.client ? 
                                    `${review.client.first_name} ${review.client.last_name}` : 
                                    `Client #${review.clientId}`
                                  }
                                </span>
                                <Badge variant="outline">ID: {review.clientId}</Badge>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <StarRating rating={review.rating} readonly />
                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(review.created_at).toLocaleDateString('fr-FR')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed ml-13">
                          {review.review}
                        </p>
                      </div>
                    ))}
                    {pagination && pagination.totalPages > 1 && (
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <Pagination
                          currentPage={pagination.currentPage}
                          totalPages={pagination.totalPages}
                          itemsPerPage={pagination.itemsPerPage}
                          totalItems={pagination.totalItems}
                          onPageChange={handlePageChange}
                          onItemsPerPageChange={handleItemsPerPageChange}
                        />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
