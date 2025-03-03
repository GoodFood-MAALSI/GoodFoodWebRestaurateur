"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const restaurantSchema = z.object({
  name: z
    .string()
    .min(3, "Le nom du restaurant doit comporter au moins 3 caractères"),
  description: z
    .string()
    .min(10, "La description doit comporter au moins 10 caractères"),
  street_number: z.string().min(1, "Le numéro de rue est requis"),
  street: z
    .string()
    .min(3, "Le nom de la rue doit comporter au moins 3 caractères"),
  city: z
    .string()
    .min(2, "Le nom de la ville doit comporter au moins 2 caractères"),
  postal_code: z.string().min(4, "Le code postal est requis"),
  country: z.string().min(2, "Le pays est requis"),
  email: z.string().email("Adresse email invalide"),
  phone_number: z.string().regex(/^\d{9,15}$/, "Numéro de téléphone invalide"),
});

export default function CreateRestaurantPage() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      name: "Nom du restaurant",
      description: "Un restaurant fantastique avec des plats succulents.",
      street_number: "123",
      street: "Grand Rue",
      city: "Paris",
      postal_code: "93000",
      country: "France",
      email: "restaurant@exemple.com",
      phone_number: "0700000000",
    },
  });

  const onSubmit = (data: any) => {
    console.log("Données du restaurant:", data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-2xl space-y-6 bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-center text-2xl font-bold">
          Créer votre restaurant
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du restaurant</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Nom du restaurant"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Description du restaurant"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="street_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de rue</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Numéro de rue"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rue</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Nom de la rue"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="postal_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code Postal</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Code Postal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pays</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Pays" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem className="text-center">
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Numéro de téléphone"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="text-center space-y-2">
              <Button
                type="submit"
                className="w-full text-white hover:opacity-90"
                style={{ backgroundColor: "#76C893" }}
              >
                Créer le restaurant
              </Button>
            </div>
          </form>
        </Form>
        <p>Déjà un compte ?</p>
        <Button
          type="button"
          onClick={() => router.push("/auth")}
          className="w-full text-white hover:opacity-90"
          style={{ backgroundColor: "#34A0A4" }}
        >
          Se connecter
        </Button>
      </div>
    </div>
  );
}
