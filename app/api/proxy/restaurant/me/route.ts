import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendRes = await fetch(`http://localhost:8080/restaurateur/api/restaurant/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}
