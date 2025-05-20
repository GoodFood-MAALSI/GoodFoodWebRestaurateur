"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setCookie } from "cookies-next";
import { toast } from "sonner";

import { loginSchema } from "@/lib/validators/auth";
import { loginTexts } from "@/app/auth/constants";
import type { LoginForm } from "@/types/auth";
import { NEXT_PUBLIC_API_URL } from "@/app/constants";

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
      const response = await fetch(`${NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || loginTexts.error.default);
      }

      const { token, user } = await response.json();

      setCookie("token", token, {
        maxAge: 60 * 60 * 24, //1 jour
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
      });

      const restaurantsRes = await fetch(
        `${NEXT_PUBLIC_API_URL}/users/${user.id}/restaurants`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!restaurantsRes.ok) {
        throw new Error(
          "Impossible de récupérer les restaurants de l'utilisateur."
        );
      }

      const restaurants = await restaurantsRes.json();

      if (Array.isArray(restaurants) && restaurants.length > 0) {
        router.push("/profile");
      } else {
        toast.success(
          "Bienvenue sur la plateforme ! Veuillez créer votre entreprise."
        );

        setTimeout(() => {
          window.location.href = "/create-company";
        }, 300);
      }
    } catch (error: unknown) {
      console.error("Erreur de connexion:", error);
      if (error && typeof error === "object" && "message" in error) {
        alert((error as { message: string }).message || loginTexts.error.default);
      } else {
        alert(loginTexts.error.default);
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
