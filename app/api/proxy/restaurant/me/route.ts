import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL || "http://localhost:8080";

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      console.error('[Restaurant Me Proxy] No auth token found');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const backendUrl = `${BACKEND}/restaurateur/api/restaurant/me`;

    const backendRes = await fetch(backendUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!backendRes.ok) {
      console.error(`[Restaurant Me Proxy] Backend request failed:`, backendRes.status, backendRes.statusText);
      const errorText = await backendRes.text();
      console.error(`[Restaurant Me Proxy] Error response:`, errorText);
      
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
    console.error('[Restaurant Me Proxy] Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error while fetching restaurant owner data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
