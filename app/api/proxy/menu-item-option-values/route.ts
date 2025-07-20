import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
export async function POST(req: NextRequest): Promise<NextResponse> {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }
  const body = await req.json();
  const response = await fetch(`${process.env.BACKEND_URL}/restaurateur/api/menu-item-option-values`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
