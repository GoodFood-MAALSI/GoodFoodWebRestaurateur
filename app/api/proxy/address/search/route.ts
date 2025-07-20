import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");
    const limit = searchParams.get("limit");
    if (!query) {
      return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
    }
    const apiUrl = new URL("https://api-adresse.data.gouv.fr/search/");
    apiUrl.searchParams.set("q", query);
    if (limit) {
      apiUrl.searchParams.set("limit", limit);
    }
    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "User-Agent": "GoodFood-Restaurant-App/1.0",
      },
    });
    if (!response.ok) {
      throw new Error(`Address API returned ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch address suggestions" },
      { status: 500 }
    );
  }
}
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
