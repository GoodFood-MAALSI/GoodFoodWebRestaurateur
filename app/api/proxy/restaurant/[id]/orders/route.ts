import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

const BACKEND = process.env.BACKEND_URL || "http://localhost:8080";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = (await cookies()).get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const statusId = searchParams.get('status_id');
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';

    const queryParams = new URLSearchParams();
    if (statusId) queryParams.append('status_id', statusId);
    queryParams.append('page', page);
    queryParams.append('limit', limit);

    const backendRes = await fetch(
      `${BACKEND}/order/api/orders/restaurant/${params.id}?${queryParams.toString()}`,
      { 
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        } 
      }
    );
    
    if (!backendRes.ok) {
      throw new Error("Failed to fetch restaurant orders");
    }
    
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error(`Restaurant ${params.id} - Error fetching orders:`, error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
