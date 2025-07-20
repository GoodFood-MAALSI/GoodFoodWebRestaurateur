import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const { id } = await params;
    
    const backendFormData = new FormData();
    
    const imageFile = formData.get("image") as File;
    if (!imageFile) {
      return NextResponse.json({ message: "Aucune image fournie" }, { status: 400 });
    }
    
    backendFormData.append("image", imageFile);

    const response = await fetch(`${process.env.BACKEND_URL}/restaurateur/api/menu-items/${id}/upload-image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: backendFormData,
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur lors du téléchargement de l'image" },
      { status: 500 }
    );
  }
}
