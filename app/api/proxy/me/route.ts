import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
const BACKEND = process.env.BACKEND_URL || "http://localhost:8080";
export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const restaurantResponse = await fetch(`${BACKEND}/restaurateur/api/restaurant/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!restaurantResponse.ok) {
      const errorText = await restaurantResponse.text();
      return NextResponse.json(
        { 
          error: 'Failed to fetch restaurant data',
          details: restaurantResponse.statusText,
          status: restaurantResponse.status
        },
        { status: restaurantResponse.status }
      );
    }
    const restaurantData = await restaurantResponse.json();
    let userId = null;
    if (restaurantData?.data?.restaurants && Array.isArray(restaurantData.data.restaurants) && restaurantData.data.restaurants.length > 0) {
      userId = restaurantData.data.restaurants[0]?.userId;
    }
    if (!userId) {
      return NextResponse.json(
        { error: 'Could not extract user ID from restaurant data' },
        { status: 400 }
      );
    }
    const userResponse = await fetch(`${BACKEND}/restaurateur/api/users/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      return NextResponse.json(
        { 
          error: 'Failed to fetch user data',
          details: userResponse.statusText,
          status: userResponse.status
        },
        { status: userResponse.status }
      );
    }
    const userData = await userResponse.json();
    return NextResponse.json(userData);
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Internal server error while fetching current user data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
