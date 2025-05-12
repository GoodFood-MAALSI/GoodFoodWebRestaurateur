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
