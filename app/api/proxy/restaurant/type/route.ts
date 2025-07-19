import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

export async function GET() {
  try {
  const token = (await cookies()).get("token")?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const response = await fetch(`${API_BASE_URL}/restaurateur/api/restaurant-type`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching restaurant types:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des types de restaurants' },
      { status: 500 }
    );
  }
}
