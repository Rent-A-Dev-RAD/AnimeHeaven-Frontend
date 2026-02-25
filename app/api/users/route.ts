import { NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL;

export async function GET() {
  if (!BACKEND) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_API_URL nincs beállítva a .env.local fájlban" },
      { status: 500 }
    );
  }

  const res = await fetch(`${BACKEND}/users`, { cache: "no-store" });

  // ha nem JSON jön vissza, ne omoljon össze
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
}

export async function POST(req: Request) {
  if (!BACKEND) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_API_URL nincs beállítva a .env.local fájlban" },
      { status: 500 }
    );
  }

  const body = await req.json();

  const res = await fetch(`${BACKEND}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
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
}