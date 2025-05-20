"use client";

import { ChangePasswordForm } from "@/components/forms/ChangePasswordForm";

export default function ChangePasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-xl font-semibold text-center mb-4">
          Définir un nouveau mot de passe
        </h1>
        <ChangePasswordForm />
      </div>
    </main>
  );
}
