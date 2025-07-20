import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND = process.env.BACKEND_URL || "http://localhost:8080";

export async function GET(request: NextRequest, { params }: { params: Promise<{ restaurantId: string }> }) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { restaurantId } = await params;
    const { searchParams } = new URL(request.url);
    
    const period = searchParams.get('period') || 'monthly';
    const offset = searchParams.get('offset') || '0';
    
    const response = await fetch(`${BACKEND}/restaurateur/api/orders/restaurant/${restaurantId}/stats?period=${period}&offset=${offset}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json(
        { error: errorData || 'Failed to fetch restaurant stats' },
        { status: response.status }
      );
    }

    const responseData = await response.json();
    return NextResponse.json(responseData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
