"use client";

import { useState, useRef } from "react";
import { useRestaurantForm } from "@/components/hooks/useRestaurantForm";

import { GeocodingResult } from "@/types/geocoding";
import { RestaurantFormValues } from "@/app/create-company/schema";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/shadcn/form";
import { Input } from "@/components/ui/shadcn/input";
import { Button } from "@/components/ui/shadcn/button";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { useAddressAutocomplete } from "../hooks/useAddressAutoComplete";

export function RestaurantForm() {
  const { form, id, router } = useRestaurantForm();
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [addressSelected, setAddressSelected] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const {
    suggestions,
    fetchSuggestions,
    fetchGeocode,
    loading: geocodeLoading,
    error: geocodeError,
  } = useAddressAutocomplete();

  const onSubmit = async (data: RestaurantFormValues) => {
    try {
      const coordinates: GeocodingResult | null = await fetchGeocode(selectedAddress);
      if (!coordinates) {
        alert("Adresse introuvable.");
        return;
      }

      const streetName = coordinates.street?.replace(new RegExp(`^${coordinates.street_number}\\s*`), "") || "";
      const payload = {
        ...data,
        lat: coordinates.lat,
        long: coordinates.long,
        street_number: coordinates.street_number,
        street: streetName,
        city: coordinates.city,
        postal_code: coordinates.postal_code,
        country: coordinates.country,
      };

      const endpoint = id ? `/api/proxy/restaurant/${id}` : `/api/proxy/restaurant`;
      const method = id ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erreur API");

      const result = await res.json();
      if (!id && result.id) {
        router.push(`/restaurants/${result.id}`);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la soumission.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-2xl space-y-6 bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-center text-2xl font-bold">
          {id ? "Modifier votre restaurant" : "Créer votre restaurant"}
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormItem>
              <FormLabel>Adresse complète</FormLabel>
              <FormControl>
                <div>
                  <Input
                    placeholder="Ex: 10 Rue de la Paix, Paris"
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
                  />
                  {suggestions.length > 0 && !addressSelected && (
                    <ul className="border border-gray-200 rounded mt-2 bg-white">
                      {suggestions.map((suggestion) => (
                        <li
                          key={suggestion}
                          onClick={() => {
                            setSelectedAddress(suggestion);
                            setAddressSelected(true);
                          }}
                          className="cursor-pointer hover:bg-gray-100 px-3 py-1"
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* Nom du restaurant */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du restaurant</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nom" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Description du restaurant" rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="email@example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* SIRET */}
            <FormField
              control={form.control}
              name="siret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SIRET</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="12345678901234" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {geocodeError && <p className="text-sm text-red-500">Erreur : {geocodeError}</p>}

            <Button
              type="submit"
              disabled={!addressSelected || form.formState.isSubmitting || geocodeLoading}
              className="w-full text-white"
              style={{ backgroundColor: "#76C893" }}
            >
              {id ? "Mettre à jour" : "Créer"} le restaurant
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <p>Déjà un compte ?</p>
          <Button
            onClick={() => router.push("/auth")}
            className="w-full mt-2 text-white"
            style={{ backgroundColor: "#34A0A4" }}
          >
            Se connecter
          </Button>
        </div>
      </div>
    </div>
  );
}
