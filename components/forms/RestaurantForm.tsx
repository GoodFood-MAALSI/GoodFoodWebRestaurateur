"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultRestaurantValues } from "@/app/create-company/constants";
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
      try {
        const res = await fetch(`${API_ROUTES.restaurants}/${id}`);
        if (!res.ok) throw new Error("Erreur de récupération des données");
        const restaurant = await res.json();
        form.reset({
          ...restaurant,
          phone_number: restaurant.phone_number?.toString(),
        });
      } catch (err) {
        console.error(err);
        alert("Impossible de charger les données du restaurant.");
      }
    };
    fetchData();
  }, [id, form]);

  const onSubmit = async (data: RestaurantFormValues) => {
    try {
      const response = await fetch(
        id ? `${API_ROUTES.restaurants}/${id}` : API_ROUTES.restaurants,
        {
          method: id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            is_open: false,
            phone_number: Number(data.phone_number),
          }),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        console.log("Form data:", response);
        throw new Error(errData.message || "Erreur serveur");
      }

      alert(id ? "Restaurant mis à jour" : "Restaurant créé avec succès");
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
            {[
              { name: "name", label: "Nom du restaurant", type: "text" },
              { name: "description", label: "Description", type: "text" },
              { name: "street_number", label: "Numéro de rue", type: "text" },
              { name: "street", label: "Rue", type: "text" },
              { name: "city", label: "Ville", type: "text" },
              { name: "postal_code", label: "Code Postal", type: "text" },
              { name: "country", label: "Pays", type: "text" },
              { name: "email", label: "Email", type: "text" },
              { name: "phone_number", label: "Téléphone", type: "number" },
            ].map(({ name, label, type }) => (
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
