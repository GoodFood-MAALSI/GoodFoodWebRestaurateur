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
      const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      setSuggestions(data.features.map((feature: any) => feature.properties.label));
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const fetchGeocode = async (query: string): Promise<GeocodingResult | null> => {
    try {
      const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=1`);
      const data = await res.json();
      const feature = data.features[0];
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
    } catch {
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
