import { NextRequest, NextResponse } from 'next/server';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
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
      const errorText = await response.text();
      
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
    return NextResponse.json(
      { 
        error: 'Internal server error while fetching user data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
