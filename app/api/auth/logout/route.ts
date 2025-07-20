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
      // Backend logout failed, but proceeding with client-side cleanup
    }

    // Clear all auth-related cookies
    const res = NextResponse.json(
      { message: "Déconnecté avec succès" },
      { status: 200 }
    );

    // Clear cookies by setting them with past expiration
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      expires: new Date(0), // Past date to clear cookie
    };

    res.cookies.set("token", "", cookieOptions);
    res.cookies.set("refreshToken", "", cookieOptions);
    res.cookies.set("tokenExpires", "", cookieOptions);
    res.cookies.set("userStatus", "", cookieOptions);
    res.cookies.set("lastRefreshCheck", "", cookieOptions);

    return res;
  } catch (error) {
    // Even if backend fails, clear cookies
    const res = NextResponse.json(
      { message: "Déconnecté avec succès" },
      { status: 200 }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      expires: new Date(0),
    };

    res.cookies.set("token", "", cookieOptions);
    res.cookies.set("refreshToken", "", cookieOptions);
    res.cookies.set("tokenExpires", "", cookieOptions);
    res.cookies.set("userStatus", "", cookieOptions);
    res.cookies.set("lastRefreshCheck", "", cookieOptions);

    return res;
  }
}
