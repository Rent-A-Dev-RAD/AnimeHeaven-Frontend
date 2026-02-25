import { NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL;

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!BACKEND) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_API_URL nincs beállítva a .env.local fájlban" },
      { status: 500 }
    );
  }

  const { id } = await params;
  const body = await req.json();

  const res = await fetch(`${BACKEND}/users/${id}`, {
    method: "PUT",
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

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!BACKEND) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_API_URL nincs beállítva a .env.local fájlban" },
      { status: 500 }
    );
  }

  const { id } = await params;

  const res = await fetch(`${BACKEND}/users/${id}`, {
    method: "DELETE",
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