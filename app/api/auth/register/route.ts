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
    
    console.log('🔵 Register request body (frontend):', body);
    
    // Frontend formátumból backend formátumba konvertálás
    const backendBody = {
      email: body.email,
      felhasznalonev: body.username,
      jelszo: body.password,
      profilkep: body.profileImage || "https://cdn-icons-png.flaticon.com/512/3177/3177440.png" // default avatar
    };
    
    console.log('🔵 Converted body (backend format):', backendBody);
    console.log('🔵 Sending to:', `${BACKEND}/auth/register`);

    const res = await fetch(`${BACKEND}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(backendBody),
    });

    const text = await res.text();
    console.log('🔵 Backend response status:', res.status);
    console.log('🔵 Backend response:', text);
    
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
    console.error("Regisztráció hiba:", error);
    return NextResponse.json(
      { error: "Hiba történt a regisztráció során" },
      { status: 500 }
    );
  }
}
