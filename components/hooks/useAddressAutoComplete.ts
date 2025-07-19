import { useState } from "react";
import { GeocodingResult } from "@/types/geocoding";

export function useAddressAutocomplete() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const fetchSuggestions = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/proxy/address/search?q=${encodeURIComponent(query)}`);
      
      if (!res.ok) {
        throw new Error(`API request failed: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setSuggestions(data.features?.map((feature: any) => feature.properties.label) || []);
    } catch (e) {
      console.error("Address suggestions error:", e);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchGeocode = async (query: string): Promise<GeocodingResult | null> => {
    try {
      const res = await fetch(`/api/proxy/address/search?q=${encodeURIComponent(query)}&limit=1`);
      
      if (!res.ok) {
        throw new Error(`API request failed: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      const feature = data.features?.[0];
      if (!feature) return null;
      
      const [lon, lat] = feature.geometry.coordinates;
      const props = feature.properties;

      if (lat == null || lon == null) return null;

      return {
        lat,
        long: lon,
        formattedAddress: props.label,
        street_number: props.housenumber || "",
        street: props.name || props.street || "",
        city: props.city || "",
        postal_code: props.postcode || "",
        country: "France",
      };
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  return {
    suggestions,
    fetchSuggestions,
    fetchGeocode,
    loading,
    error,
  };
}
