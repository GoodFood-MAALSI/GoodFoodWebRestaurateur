import { getAuthToken } from "@/lib/getTokenFromCookie";
const BACKEND = process.env.BACKEND_URL || "http://localhost:8080";

export async function loadMenuItems(restaurantId: string) {
  const token = getAuthToken();
  if (!token) return { items: [], error: "Token manquant" };

  try {
    const res = await fetch(
      `${BACKEND}/restaurateur/api/restaurant/${restaurantId}/menu-items`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) throw new Error("Erreur API");

    const json = await res.json();
    const items = json.data || json;
    return { items };
  } catch {
    return { items: [], error: "Échec chargement des articles" };
  }
}
