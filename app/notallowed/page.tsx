"use client";

import { useRouter } from "next/navigation";
import { COLORS } from "@/app/constants";
import { Ban, LogOut } from "lucide-react";

export default function NotAllowedPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      localStorage.clear();
      sessionStorage.clear();
      
      router.push('/auth');
    } catch (error) {
      router.push('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
        {/* Icon */}
        <div 
          className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${COLORS.error}20` }}
        >
          <Ban 
            className="w-10 h-10" 
            style={{ color: COLORS.error }}
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Compte Suspendu
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          Votre compte a été temporairement suspendu. Veuillez contacter l'administration 
          pour plus d'informations sur la réactivation de votre compte.
        </p>

        {/* Contact Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">
            <strong>Support:</strong> support@goodfood-maalsi.com
          </p>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors"
          style={{
            backgroundColor: COLORS.primary,
            color: 'white'
          }}
        >
          <LogOut className="w-4 h-4" />
          <span>Se Déconnecter</span>
        </button>

        {/* Additional Info */}
        <p className="text-xs text-gray-500 mt-4">
          Code d'erreur: ACCOUNT_SUSPENDED
        </p>
      </div>
    </div>
  );
}
