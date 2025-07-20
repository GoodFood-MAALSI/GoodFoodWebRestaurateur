import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

const BACKEND = process.env.BACKEND_URL || "http://localhost:8080";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const token = (await cookies()).get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { orderId } = await params;
    const backendRes = await fetch(
      `${BACKEND}/order/api/orders/${orderId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!backendRes.ok) {
      const errorData = await backendRes.text();
      console.error(`Failed to fetch order ${orderId}:`, errorData);
      return NextResponse.json(
        { error: `Failed to fetch order details: ${backendRes.status}` }, 
        { status: backendRes.status }
      );
    }

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error("Error fetching order details:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
