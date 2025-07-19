import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const token = (await cookies()).get("token")?.value;
  const { id } = await params;

  if (!token) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/restaurateur/api/restaurant/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ message: "Erreur côté serveur" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const token = (await cookies()).get("token")?.value;
  const { id } = await params;

  if (!token) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const response = await fetch(`${process.env.BACKEND_URL}/restaurateur/api/restaurant/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ message: "Erreur côté serveur" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const token = (await cookies()).get("token")?.value;
  const { id } = await params;

  if (!token) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/restaurateur/api/restaurant/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json({ message: "Supprimé avec succès" }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Erreur côté serveur" }, { status: 500 });
  }
}
