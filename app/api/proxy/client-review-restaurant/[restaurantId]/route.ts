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
    
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const rating = searchParams.get('rating');

    const queryParams = new URLSearchParams({
      page,
      limit,
    });
    
    if (rating) {
      queryParams.append('rating', rating);
    }

    const response = await fetch(`${BACKEND}/restaurateur/api/client-review-restaurant/restaurant/${restaurantId}?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json(
        { error: errorData || 'Failed to fetch reviews' },
        { status: response.status }
      );
    }

    const responseData = await response.json();
    const reviews = responseData.reviews || responseData.data || [];
    const meta = responseData.meta || null;
    const links = responseData.links || null;
    
    return NextResponse.json({
      reviews,
      meta,
      links
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
