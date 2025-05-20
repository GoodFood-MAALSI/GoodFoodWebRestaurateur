"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCookie } from "cookies-next";

import {
  defaultRestaurantValues,
  restaurantFormFields,
} from "@/app/create-company/constants";
import { API_ROUTES } from "@/app/constants";
import {
  RestaurantFormValues,
  restaurantSchema,
} from "@/app/create-company/schema";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/shadcn/form";
import { Input } from "@/components/ui/shadcn/input";
import { Button } from "@/components/ui/shadcn/button";

export function RestaurantForm() {
  const { id } = useParams();
  const router = useRouter();

  const form = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: defaultRestaurantValues,
  });

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      const token = getCookie("token");
      if (!token || typeof token !== "string") {
        console.warn("Token manquant ou invalide");
        router.push("/auth");
        return;
      }

      try {
        const res = await fetch(`${API_ROUTES.restaurants}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Erreur de récupération des données");
        const restaurant = await res.json();

        if (!restaurant || typeof restaurant !== "object") {
          throw new Error("Données invalides");
        }

        form.reset({
          ...restaurant,
          phone_number: restaurant.phone_number?.toString() || "",
        });
      } catch (err) {
        console.error(err);
        alert("Impossible de charger les données du restaurant.");
      }
    };

    fetchData();
  }, [id, form, router]);

  const onSubmit = async (data: RestaurantFormValues) => {
    const token = getCookie("token");

    if (!token || typeof token !== "string") {
      console.warn("Token manquant pour soumettre le formulaire.");
      router.push("/auth");
      return;
    }

    try {
      const body = {
        ...data,
        is_open: false,
      };

      const response = await fetch(
        id ? `${API_ROUTES.restaurants}/${id}` : API_ROUTES.restaurants,
        {
          method: id ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        console.log("Erreur API :", errData);
        throw new Error(errData.message || "Erreur serveur");
      }

      alert(id ? "Restaurant mis à jour" : "Restaurant créé avec succès");
      router.push("/profile");
    } catch (err: any) {
      console.error("Erreur :", err);
      alert("Une erreur est survenue.");
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
            {restaurantFormFields.map(({ name, label, type }) => (
              <FormField
                key={name}
                control={form.control}
                name={name as keyof RestaurantFormValues}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <Input type={type} placeholder={label} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <Button
              type="submit"
              className="w-full text-white"
              style={{ backgroundColor: "#76C893" }}
            >
              {id ? "Mettre à jour le restaurant" : "Créer le restaurant"}
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
