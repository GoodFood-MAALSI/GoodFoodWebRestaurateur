import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json();

  const payload = {
    ...body,
    is_open: false,
  };

  const response = await fetch(`${process.env.BACKEND_URL}/restaurateur/api/restaurant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}
