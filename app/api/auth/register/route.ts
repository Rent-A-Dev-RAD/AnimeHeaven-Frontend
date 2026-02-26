import { NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL;

// Backend jogosultság számból frontend role string-re konvertálás
function getRoleFromNumber(jogosultsag: number): string {
  switch (jogosultsag) {
    case 5: return 'Tulajdonos';
    case 4: return 'Admin';
    case 3: return 'Főszerkesztő';
    case 2: return 'Szerkesztő';
    case 1: return 'Felhasználó';
    case 0: return 'Inaktív';
    default: return 'Felhasználó';
  }
}

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
    });    const text = await res.text();
    console.log('🔵 Backend response status:', res.status);
    console.log('🔵 Backend response:', text);
    
    try {
      const data = JSON.parse(text);
      
      // Konvertáljuk a backend választ frontend formátumra
      const frontendResponse = {
        ...data,
        user: data.user ? {
          id: data.user.id,
          username: data.user.felhasznalonev || data.user.username,
          email: data.user.email,
          role: data.user.jogosultsag !== undefined 
            ? getRoleFromNumber(data.user.jogosultsag) 
            : data.user.role
        } : undefined
      };
      
      return NextResponse.json(frontendResponse, { status: res.status });
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
