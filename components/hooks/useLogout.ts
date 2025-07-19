"use client";

import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export function useLogout() {
  const router = useRouter();

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      deleteCookie("token");
      router.replace("/auth");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
      deleteCookie("token");
      router.replace("/auth");
    }
  };

  return logout;
}
