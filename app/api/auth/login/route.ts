import { NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: Request) {
  if (!BACKEND) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_API_URL nincs beállítva a .env.local fájlban" },
      { status: 500 }
    );
  }
  try {
    const body = await req.json();
    
    console.log('🔵 Login request body (frontend):', body);
    
    // Frontend formátumból backend formátumba konvertálás
    const backendBody = {
      email: body.email,
      jelszo: body.password
    };
    
    console.log('🔵 Converted body (backend format):', backendBody);

    const res = await fetch(`${BACKEND}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(backendBody),
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
    console.error("Bejelentkezés hiba:", error);
    return NextResponse.json(
      { error: "Hiba történt a bejelentkezés során" },
      { status: 500 }
    );
  }
}
