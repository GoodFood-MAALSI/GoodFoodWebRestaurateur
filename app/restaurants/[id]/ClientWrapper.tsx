"use client";

import { useRouter } from "next/navigation";
import { COLORS } from "@/app/constants";

export default function ClientWrapper({ id }: { id: number }) {
  const router = useRouter();

  return (
    <div>
      <div className="mt-6 flex justify-center gap-4">
        <button
          className="px-4 py-2 text-white rounded"
          style={{ backgroundColor: COLORS.secondary }}
          onClick={() => router.push(`/restaurants/${id}/items`)}
        >
          Gérer le menu
        </button>
        <button
          className="px-4 py-2 text-white rounded"
          style={{ backgroundColor: COLORS.primary }}
          onClick={() => router.push(`/restaurants/${id}/orders`)}
        >
          Voir les commandes
        </button>
      </div>
    </div>
  );
}
