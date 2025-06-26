export interface GeocodingResult {
  lat: number;
  long: number;
  formattedAddress: string;
  street_number?: string;
  street?: string;
  city?: string;
  postal_code?: string;
  country?: string;
}
