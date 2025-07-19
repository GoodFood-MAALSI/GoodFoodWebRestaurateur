import { useState, useEffect } from 'react';
import { ClientReview } from '@/types/review';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

export function useReviews(restaurantId?: number) {
  const [reviews, setReviews] = useState<ClientReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    if (!restaurantId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchWithAuth(`/api/proxy/client-review-restaurant/${restaurantId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      
      const data = await response.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

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
  }, [restaurantId]);

  return {
    reviews,
    loading,
    error,
    fetchReviews,
    stats: calculateStats(),
  };
}
