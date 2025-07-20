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
  status: string;
  created_at: string;
  updated_at: string;
  client?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  restaurant?: {
    id: number;
    name: string;
    description: string;
    street_number: string;
    street: string;
    city: string;
    postal_code: string;
    country: string;
    email: string;
    phone_number: string;
    siret: string;
    is_open: boolean;
    status: string;
    long: string;
    lat: string;
    restaurantTypeId: number;
    userId: number;
    created_at: string;
    updated_at: string;
  };
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