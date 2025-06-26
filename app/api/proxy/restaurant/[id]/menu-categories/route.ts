import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

const BACKEND = process.env.BACKEND_URL || "http://localhost:8080";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = (await cookies()).get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const backendRes = await fetch(
    `${BACKEND}/restaurateur/api/restaurant/${params.id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = (await cookies()).get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const backendRes = await fetch(
    `${BACKEND}/restaurateur/api/menu-categories`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }
  );
  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}
