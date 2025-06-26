"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";

import { restaurantSchema, RestaurantFormValues } from "@/app/create-company/schema";
import { defaultRestaurantValues } from "@/app/create-company/constants";

export const useRestaurantForm = () => {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : undefined;
  const router = useRouter();

  const form = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: defaultRestaurantValues,
  });

  useEffect(() => {
    if (!id) return;

    const fetchRestaurant = async () => {
      try {
        const res = await fetch(`/api/proxy/restaurant/${id}`);

        if (res.status === 401) {
          router.push("/auth");
          return;
        }

        if (!res.ok) {
          throw new Error("Erreur API");
        }

        const restaurant = await res.json();

        form.reset({
          ...restaurant,
          phone_number: restaurant.phone_number?.toString() || "",
        });
      } catch (err) {
        console.error("Erreur lors du chargement du restaurant :", err);
        alert("Erreur lors du chargement du restaurant.");
      }
    };

    fetchRestaurant();
  }, [id, form, router]);

  return {
    form,
    id,
    router,
  };
};
