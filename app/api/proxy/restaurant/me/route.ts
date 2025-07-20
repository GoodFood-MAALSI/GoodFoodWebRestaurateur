import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
const BACKEND = process.env.BACKEND_URL || "http://localhost:8080";
export async function GET(request: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const backendUrl = `${BACKEND}/restaurateur/api/restaurant/me?page=${page}&limit=${limit}`;
    const backendRes = await fetch(backendUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      return NextResponse.json(
        { 
          error: 'Failed to fetch restaurant owner data',
          details: backendRes.statusText,
          status: backendRes.status,
          responseBody: errorText
        },
        { status: backendRes.status }
      );
    }
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Internal server error while fetching restaurant owner data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
