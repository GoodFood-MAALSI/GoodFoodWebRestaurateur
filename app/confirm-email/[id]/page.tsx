"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/shadcn/button";
import { confirmEmailTexts } from "./constants";
import { COLORS } from "@/app/constants";

type ConfirmationState = "loading" | "success" | "error";

export default function ConfirmEmailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<ConfirmationState>("loading");

  useEffect(() => {
    if (!id || typeof id !== "string") {
      setStatus("error");
      return;
    }

    const confirmEmail = async () => {
      try {
        const res = await fetch(`/api/auth/confirm-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ hash: id }),
        });

        if (!res.ok) throw new Error("Failed to confirm email");

        setStatus("success");
      } catch (err) {
        setStatus("error");
      }
    };

    confirmEmail();
  }, [id]);

  const renderContent = () => {
    switch (status) {
      case "loading":
        return <p className="text-gray-600">{confirmEmailTexts.loading}</p>;

      case "success":
        return (
          <>
            <h1 className="text-2xl font-bold text-green-600">{confirmEmailTexts.successTitle}</h1>
            <p className="text-gray-700">{confirmEmailTexts.successMessage}</p>
            <Button
              className="mt-6 w-full text-white hover:opacity-90"
              style={{ backgroundColor: COLORS.success }}
              onClick={() => router.push(confirmEmailTexts.redirectUrl)}
            >
              {confirmEmailTexts.buttonLabel}
            </Button>
          </>
        );

      case "error":
        return (
          <>
            <h1 className="text-2xl font-bold text-red-600">{confirmEmailTexts.errorTitle}</h1>
            <p className="text-gray-700">{confirmEmailTexts.errorMessage}</p>
            <Button
              className="mt-6 w-full text-white hover:opacity-90"
              style={{ backgroundColor: COLORS.error }}
              onClick={() => router.push("/")}
            >
              Retour à l&apos;accueil
            </Button>
          </>
        );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6 bg-white p-8 shadow-lg rounded-lg text-center">
        {renderContent()}
      </div>
    </div>
  );
}
