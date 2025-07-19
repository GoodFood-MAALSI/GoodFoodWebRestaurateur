import { NextRequest, NextResponse } from 'next/server';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const response = await fetchWithAuth(`/users/${id}`, {
      method: 'GET',
    });

    if (!response.ok) {
      console.error(`[Users Proxy] Failed to fetch user data:`, response.status, response.statusText);
      const errorText = await response.text();
      console.error(`[Users Proxy] Error response:`, errorText);
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch user data',
          details: response.statusText,
          status: response.status
        },
        { status: response.status }
      );
    }

    const userData = await response.json();

    return NextResponse.json(userData);
  } catch (error) {
    console.error('[Users Proxy] Error fetching user data:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error while fetching user data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
