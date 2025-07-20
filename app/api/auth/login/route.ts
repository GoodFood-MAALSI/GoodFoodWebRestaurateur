import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const body = await req.json();
  const res = await fetch("http://localhost:8080/restaurateur/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const { data } = await res.json();
  const { token, refreshToken, tokenExpires, user } = data;

  // Check user status using the backend auth/status endpoint
  const statusCheck = await fetch("http://localhost:8080/restaurateur/api/auth/status", {
    method: "GET",
    headers: { 
      Authorization: `Bearer ${token}`,
      Accept: "*/*"
    },
  });

  if (statusCheck.status === 401) {
    const statusData = await statusCheck.json();
    if (statusData.message && statusData.message.includes("suspendu")) {
      return NextResponse.json({ 
        error: "Account suspended",
        message: statusData.message,
        suspended: true
      }, { status: 403 });
    }
  }

  const response = NextResponse.json({ user });
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  response.cookies.set("tokenExpires", tokenExpires.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  response.cookies.set("userStatus", "active", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  return response;
}
