import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const token = (await cookies()).get("token")?.value;
  
  if (!token) {
    return NextResponse.json({ error: "No token found" }, { status: 401 });
  }

  try {
    // Use the backend's auth/status endpoint
    const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:8080'}/restaurateur/api/auth/status`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
      },
    });

    if (response.status === 401) {
      const errorData = await response.json();
      // Check if it's a suspension message
      if (errorData.message && errorData.message.includes("suspendu")) {
        // Update cookie to suspended status
        const res = NextResponse.json({ 
          error: errorData.message,
          suspended: true 
        }, { status: 401 });
        
        res.cookies.set("userStatus", "suspended", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });
        
        return res;
      }
      // Other 401 errors (token expired, etc.)
      return NextResponse.json({ error: errorData.message || "Unauthorized" }, { status: 401 });
    }

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch user status" }, { status: response.status });
    }

    const userData = await response.json();
    
    // If we get here, user is active
    const res = NextResponse.json({ status: "active", user: userData });
    res.cookies.set("userStatus", "active", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res;
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
