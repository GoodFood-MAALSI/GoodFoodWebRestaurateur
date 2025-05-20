export const URL_API = 'http://localhost:8080/restaurateur/api/';

import { RestaurantFormValues } from "./schema";

export const defaultRestaurantValues: RestaurantFormValues = {
  name: "Nom du restaurant",
  description: "Un restaurant fantastique avec des plats succulents.",
  street_number: "123",
  street: "Grand Rue",
  city: "Paris",
  postal_code: "93000",
  country: "France",
  email: "restaurant@exemple.com",
  phone_number: "0700000000",
};

export const restaurantFormFields = [
  { name: "name", label: "Nom du restaurant", type: "text" },
  { name: "description", label: "Description", type: "text" },
  { name: "street_number", label: "Numéro de rue", type: "text" },
  { name: "street", label: "Rue", type: "text" },
  { name: "city", label: "Ville", type: "text" },
  { name: "postal_code", label: "Code Postal", type: "text" },
  { name: "country", label: "Pays", type: "text" },
  { name: "email", label: "Email", type: "text" },
  { name: "phone_number", label: "Téléphone", type: "number" },
];
