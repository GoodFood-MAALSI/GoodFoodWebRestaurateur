import * as z from "zod";

export const restaurantSchema = z.object({
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
  siret: z.string().min(1, "Le SIRET est obligatoire"),

  is_open: z.boolean().default(false),
});

export type RestaurantFormValues = z.infer<typeof restaurantSchema>;
