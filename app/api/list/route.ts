import { NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL;

type ListCreateBody = {
  animeId?: number;
  typeId?: number;
  anime_id?: number;
  tipus_id?: number;
};

export async function POST(req: Request) {
  if (!BACKEND) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_API_URL nincs beallitva a .env.local fajlban" },
      { status: 500 }
    );
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Nincs authorization header" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as ListCreateBody;

    const animeId = Number(body.animeId ?? body.anime_id);
    const typeId = Number(body.typeId ?? body.tipus_id);

    if (!Number.isFinite(animeId) || !Number.isFinite(typeId)) {
      return NextResponse.json(
        { error: "Hibas animeId vagy typeId ertek" },
        { status: 400 }
      );
    }

    const backendBody = {
      anime_id: animeId,
      tipus_id: typeId,
    };

    const res = await fetch(`${BACKEND}/list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
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
  } catch {
    return NextResponse.json(
      { error: "Hiba tortent a lista elem letrehozas soran" },
      { status: 500 }
    );
  }
}
