
import { useState } from "react";
import { GeocodingResult } from "@/types/geocoding";

export const useAddressGeocode = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGeocode = async (address: string): Promise<GeocodingResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(address)}&limit=1`);
      const data = await response.json();

      const feature = data.features?.[0];
      if (!feature) return null;

      const [long, lat] = feature.geometry.coordinates;
      return { lat, long, formattedAddress: feature.properties.label };
    } catch (err) {
      setError("Erreur lors du géocodage.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchGeocode, loading, error };
};
