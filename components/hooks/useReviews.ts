import { useState, useEffect, useCallback } from 'react';
import { ClientReview } from '@/types/review';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

interface UseReviewsOptions {
  page?: number;
  limit?: number;
  rating?: number;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export function useReviews(restaurantId?: number, options: UseReviewsOptions = {}) {
  const { page = 1, limit = 10, rating } = options;
  const [reviews, setReviews] = useState<ClientReview[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    if (!restaurantId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (rating !== undefined) {
        queryParams.set('rating', rating.toString());
      }
      
      const response = await fetchWithAuth(`/api/proxy/client-review-restaurant/${restaurantId}?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      
      const data = await response.json();
      
      // Handle nested API structure with reviews.reviews array
      if (data.reviews && data.reviews.reviews && Array.isArray(data.reviews.reviews)) {
        setReviews(data.reviews.reviews);
      } else if (data.reviews && Array.isArray(data.reviews)) {
        // Handle direct reviews array structure
        setReviews(data.reviews);
      } else if (Array.isArray(data)) {
        // Fallback for old structure
        setReviews(data);
      } else {
        setReviews([]);
      }
      
      // Handle pagination metadata
      if (data.pagination) {
        setPagination({
          currentPage: data.pagination.current_page,
          totalPages: data.pagination.last_page,
          totalItems: data.pagination.total,
          itemsPerPage: data.pagination.per_page,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [restaurantId, page, limit, rating]);

  const calculateStats = () => {
    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      };
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    const ratingDistribution = reviews.reduce((dist, review) => {
      const rating = review.rating as keyof typeof dist;
      dist[rating] = (dist[rating] || 0) + 1;
      return dist;
    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

    return {
      averageRating,
      totalReviews: reviews.length,
      ratingDistribution
    };
  };

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return {
    reviews,
    pagination,
    loading,
    error,
    fetchReviews,
    stats: calculateStats(),
  };
}
