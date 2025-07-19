"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { loginSchema } from "@/lib/validators/auth";
import { loginTexts } from "@/app/auth/constants";
import type { LoginForm } from "@/types/auth";
import type { LoginResponse } from "@/types/api";

export function useAuthForm() {
  const router = useRouter();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          toast.error("Identifiants incorrects. Veuillez vérifier votre email et mot de passe.");
          return;
        }
        throw new Error(errorData.message || loginTexts.error.default);
      }

      const { user } = (await response.json()) as LoginResponse;

      const restaurantsRes = await fetch(`/api/proxy/restaurant/me`, {
        method: "GET",
        credentials: "include",
      });
      if (!restaurantsRes.ok) {
        throw new Error("Impossible de récupérer les restaurants.");
      }

      const restaurantsJson = await restaurantsRes.json();
      const restaurantsList = restaurantsJson.data?.restaurants;
      if (!Array.isArray(restaurantsList)) {
        console.warn("Réponse inattendue : restaurants n'est pas un tableau.", restaurantsJson);
        throw new Error("Réponse inattendue du serveur.");
      }

      if (restaurantsList.length > 0) {
        router.push("/profile");
      } else {
        toast.success("Bienvenue sur la plateforme ! Veuillez créer votre entreprise.");
        router.push("/create-company");
      }
    } catch (error: unknown) {
      console.error("Erreur de connexion:", error);
      if (error && typeof error === "object" && "message" in error) {
        toast.error((error as { message: string }).message || loginTexts.error.default);
      } else {
        toast.error(loginTexts.error.default);
      }
    }
  };

  return {
    form,
    onSubmit,
    handleSubmit: form.handleSubmit,
    router,
  };
}
