export interface CreateClientReviewRestaurantDto {
  review: string;
  rating: number;
  restaurantId: number;
  clientId: number;
}

export interface ClientReview {
  id: number;
  review: string;
  rating: number;
  restaurantId: number;
  clientId: number;
  client?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}
