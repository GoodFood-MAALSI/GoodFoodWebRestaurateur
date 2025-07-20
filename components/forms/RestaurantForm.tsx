"use client";
import { useState, useRef } from "react";
import { useRestaurantForm } from "@/components/hooks/useRestaurantForm";
import { useRestaurantTypes } from "@/components/hooks/useRestaurantTypes";
import { COLORS } from "@/app/constants";
import { GeocodingResult } from "@/types/geocoding";
import { RestaurantFormValues } from "@/app/create-company/schema";
import { RestaurantType } from "@/types/restaurantType";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/shadcn/form";
import { Input } from "@/components/ui/shadcn/input";
import { Button } from "@/components/ui/shadcn/button";
import { Textarea } from "@/components/ui/shadcn/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { useAddressAutocomplete } from "../hooks/useAddressAutoComplete";
import { Building2, Mail, FileText, MapPin, Hash, Coffee, Save, Edit } from "lucide-react";
export function RestaurantForm() {
  const { form, id, router } = useRestaurantForm();
  const { restaurantTypes, loading: typesLoading, error: typesError } = useRestaurantTypes();
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [addressSelected, setAddressSelected] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const {
    suggestions,
    fetchSuggestions,
    fetchGeocode,
    loading: geocodeLoading,
    error: geocodeError,
  } = useAddressAutocomplete();
  const onSubmit = async (data: RestaurantFormValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const coordinates: GeocodingResult | null = await fetchGeocode(
        selectedAddress
      );
      if (!coordinates) {
        alert("Adresse introuvable.");
        return;
      }
      if (!coordinates?.street_number) {
        alert("Numéro de rue introuvable.");
        return;
      }
      const streetName =
        coordinates.street?.replace(
          new RegExp(`^${coordinates.street_number}\\s*`),
          ""
        ) || "";
      const payload = {
        ...data,
        lat: coordinates.lat,
        long: coordinates.long,
        street_number: coordinates.street_number,
        street: streetName,
        city: coordinates.city,
        postal_code: coordinates.postal_code,
        country: coordinates.country,
        restaurantTypeId: data.restaurantTypeId ? parseInt(data.restaurantTypeId, 10) : undefined,
      };
      const endpoint = id
        ? `/api/proxy/restaurant/${id}`
        : `/api/proxy/restaurant`;
      const method = id ? "PUT" : "POST";
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Erreur inconnue" }));
        throw new Error(errorData.message || `Erreur ${res.status}`);
      }
      const result = await res.json();
      const restaurantId = result.id || result.data?.id || id;
      if (!id && restaurantId) {
        router.push(`/restaurants/${restaurantId}`);
      } else if (id) {
        router.push(`/restaurants/${id}`);
      } else if (!id) {
        router.push("/profile");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la soumission.";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div 
            className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`
            }}
          >
            {id ? (
              <Edit className="w-10 h-10 text-white" />
            ) : (
              <Building2 className="w-10 h-10 text-white" />
            )}
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            {id ? "Modifier votre restaurant" : "Créer votre restaurant"}
          </h1>
          <p className="text-gray-600 text-lg">
            {id ? "Mettez à jour les informations de votre établissement" : "Ajoutez un nouveau restaurant à votre collection"}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: COLORS.primary }} />
                  Adresse complète
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Ex: 10 Rue de la Paix, 75001 Paris"
                      value={selectedAddress}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedAddress(value);
                        setAddressSelected(false);
                        if (timerRef.current) clearTimeout(timerRef.current);
                        timerRef.current = setTimeout(() => {
                          if (value.length >= 5) fetchSuggestions(value);
                          else fetchSuggestions("");
                        }, 1500);
                      }}
                      autoComplete="off"
                      className="h-12 border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:border-transparent"
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = COLORS.primary;
                        e.currentTarget.style.boxShadow = `0 0 0 2px ${COLORS.primary}20`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                    {suggestions.length > 0 && !addressSelected && (
                      <div className="absolute z-10 w-full mt-1">
                        <ul className="border border-gray-200 rounded-lg bg-white shadow-lg max-h-48 overflow-y-auto">
                          {suggestions.map((suggestion, index) => (
                            <li
                              key={index}
                              onClick={() => {
                                setSelectedAddress(suggestion);
                                setAddressSelected(true);
                              }}
                              className="cursor-pointer hover:bg-gray-50 px-4 py-3 border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                            >
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-700">{suggestion}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage className="text-red-500 text-sm mt-1" />
              </FormItem>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Coffee className="w-4 h-4" style={{ color: COLORS.primary }} />
                        Nom du restaurant
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Le Petit Bistrot" 
                          className="h-12 border-gray-200 rounded-lg text-gray-800 placeholder-gray-400"
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = COLORS.primary;
                            e.currentTarget.style.boxShadow = `0 0 0 2px ${COLORS.primary}20`;
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = '#e5e7eb';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm mt-1" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4" style={{ color: COLORS.primary }} />
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="contact@restaurant.com"
                          className="h-12 border-gray-200 rounded-lg text-gray-800 placeholder-gray-400"
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = COLORS.primary;
                            e.currentTarget.style.boxShadow = `0 0 0 2px ${COLORS.primary}20`;
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = '#e5e7eb';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm mt-1" />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" style={{ color: COLORS.primary }} />
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Décrivez votre restaurant, son ambiance, sa spécialité..."
                        rows={4}
                        className="border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 resize-none"
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = COLORS.primary;
                          e.currentTarget.style.boxShadow = `0 0 0 2px ${COLORS.primary}20`;
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#e5e7eb';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="siret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Hash className="w-4 h-4" style={{ color: COLORS.primary }} />
                        SIRET
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="12345678901234" 
                          className="h-12 border-gray-200 rounded-lg text-gray-800 placeholder-gray-400"
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = COLORS.primary;
                            e.currentTarget.style.boxShadow = `0 0 0 2px ${COLORS.primary}20`;
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = '#e5e7eb';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm mt-1" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="restaurantTypeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Building2 className="w-4 h-4" style={{ color: COLORS.primary }} />
                        Type de restaurant
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 border-gray-200 rounded-lg text-gray-800">
                            <SelectValue placeholder="Sélectionnez un type de restaurant" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {typesLoading ? (
                            <SelectItem value="loading" disabled>
                              Chargement...
                            </SelectItem>
                          ) : typesError ? (
                            <SelectItem value="error" disabled>
                              Erreur lors du chargement
                            </SelectItem>
                          ) : (
                            Array.isArray(restaurantTypes) && restaurantTypes.map((type: RestaurantType) => (
                              <SelectItem key={type.id} value={type.id.toString()}>
                                {type.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-500 text-sm mt-1" />
                    </FormItem>
                  )}
                />
              </div>
              {geocodeError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Erreur : {geocodeError}
                  </p>
                </div>
              )}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={
                    !addressSelected ||
                    form.formState.isSubmitting ||
                    geocodeLoading ||
                    isSubmitting
                  }
                  className="w-full h-14 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`
                  }}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.background = `linear-gradient(135deg, ${COLORS.status.medium} 0%, ${COLORS.status.darker} 100%)`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.background = `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`;
                    }
                  }}
                >
                  <Save className="w-5 h-5 mr-2" />
                  {isSubmitting 
                    ? "En cours..." 
                    : id 
                      ? "Mettre à jour le restaurant" 
                      : "Créer le restaurant"
                  }
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
