import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
export async function GET(req: NextRequest) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = req.nextUrl.searchParams.get("userId");
  const backendRes = await fetch(`http://localhost:8080/restaurateur/api/restaurant/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}
