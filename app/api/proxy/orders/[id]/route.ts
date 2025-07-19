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
    const backendRes = await fetch(
      `${BACKEND}/order/api/orders/restaurant/${params.id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error(params.id, "Error fetching orders:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = (await cookies()).get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
      const requestBody = {
      status_id: body.status_id || body.status || body
    };

    const backendRes = await fetch(
      `${BACKEND}/order/api/orders/${params.id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      }
    );
    
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
