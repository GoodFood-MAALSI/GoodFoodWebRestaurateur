import { NextResponse } from "next/server";
import { cookies } from "next/headers";
export async function POST(): Promise<NextResponse> {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return NextResponse.json(
      { message: "Aucun token trouvé" },
      { status: 400 }
    );
  }
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/restaurateur/api/auth/logout`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
        "Backend logout failed, but proceeding with client-side cleanup"
      );
    }
    return NextResponse.json(
      { message: "Déconnecté avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Déconnecté avec succès" },
      { status: 200 }
    );
  }
}
