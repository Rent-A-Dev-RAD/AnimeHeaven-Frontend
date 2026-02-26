import { NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL;

export async function GET(req: Request) {
  if (!BACKEND) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_API_URL nincs beállítva a .env.local fájlban" },
      { status: 500 }
    );
  }

  try {
    // Token kivétele a headerből
    const authHeader = req.headers.get("Authorization");
    
    if (!authHeader) {
      return NextResponse.json(
        { error: "Nincs authorization header" },
        { status: 401 }
      );
    }    const res = await fetch(`${BACKEND}/auth/me`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": authHeader
      },
    });

    const text = await res.text();
    
    try {
      const data = JSON.parse(text);
      return NextResponse.json(data, { status: res.status });
    } catch {
      return NextResponse.json(
        { error: "A backend nem JSON-t adott vissza", raw: text },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("GetMe hiba:", error);
    return NextResponse.json(
      { error: "Hiba történt a felhasználó adatok lekérése során" },
      { status: 500 }
    );
  }
}
