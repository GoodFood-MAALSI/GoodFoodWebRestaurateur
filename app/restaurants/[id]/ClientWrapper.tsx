"use client";

import { useRouter } from "next/navigation";

export default function ClientWrapper({ id }: { id: number }) {
  const router = useRouter();

  return (
    <div>
      <div className="mt-6 flex justify-center gap-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => router.push(`/restaurants/${id}/items`)}
        >
          Gérer le menu
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => router.push(`/restaurants/${id}/orders`)}
        >
          Voir les commandes
        </button>
      </div>
    </div>
  );
}
