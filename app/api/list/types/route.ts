import { NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL;

export async function GET() {
  if (!BACKEND) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_API_URL nincs beallitva a .env.local fajlban" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(`${BACKEND}/list/types`, {
      method: "GET",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
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
  } catch {
    return NextResponse.json(
      { error: "Hiba tortent a lista tipusok lekerese soran" },
      { status: 500 }
    );
  }
}
