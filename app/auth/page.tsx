"use client";

import { useRouter } from "next/navigation";
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
} from "@/components/ui/shadcn/form";

import { Input } from "@/components/ui/shadcn/input";
import { Button } from "@/components/ui/shadcn/button";

const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

interface LoginForm {
  email: string;
  password: string;
}

export default function AuthPage() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginForm) => {
    console.log("Données de connexion:", data);
    // Ajouter ici la logique d'authentification
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-center text-2xl font-bold">Connexion</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Entrer votre email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Entrer votre mot de passe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full text-white hover:opacity-90"
              style={{ backgroundColor: "#76C893" }}
            >
              Connexion
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <p>Pas encore de compte ?</p>
          <Button
            onClick={() => router.push("/create-company")}
            className="mt-2 w-full text-white hover:opacity-90"
            style={{ backgroundColor: "#34A0A4" }}
          >
            Créer un restaurant
          </Button>
        </div>
      </div>
    </div>
  );
}
