"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validators/auth"
import { NEXT_PUBLIC_API_URL } from "@/app/constants/env";
import { loginTexts } from "@/app/auth/constants";
import type { LoginForm } from "@/types/auth";

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

export default function AuthPage() {
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
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
  let errMessage = loginTexts.error.default;

  try {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();
      errMessage = errorData.message || errMessage;
    } else {
      const raw = await response.text();
      console.warn("Réponse non-JSON :", raw);
    }
  } catch (parseErr) {
    console.error("Erreur JSON parsing :", parseErr);
  }

  throw new Error(errMessage);
}


      router.push("/dashboard");
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      alert(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-center text-2xl font-bold">{loginTexts.title}</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{loginTexts.fields.email.label}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={loginTexts.fields.email.placeholder}
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
                  <FormLabel>{loginTexts.fields.password.label}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={loginTexts.fields.password.placeholder}
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
              style={{ backgroundColor: loginTexts.colors.submit }}
            >
              {loginTexts.submitButton}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <p>{loginTexts.footer.prompt}</p>
          <Button
            onClick={() => router.push("/create-company")}
            className="mt-2 w-full text-white hover:opacity-90"
            style={{ backgroundColor: loginTexts.colors.secondary }}
          >
            {loginTexts.footer.createButton}
          </Button>
        </div>
      </div>
    </div>
  );
}
