import { NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL;

type ListUpdateBody = {
  typeId?: number;
  tipus_id?: number;
};

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
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
    const { id } = await params;
    const body = (await req.json()) as ListUpdateBody;
    const typeId = Number(body.typeId ?? body.tipus_id);

    if (!Number.isFinite(typeId)) {
      return NextResponse.json({ error: "Hibas typeId ertek" }, { status: 400 });
    }

    const res = await fetch(`${BACKEND}/list/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({ tipus_id: typeId }),
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
      { error: "Hiba tortent a lista elem modositasa soran" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
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
    const { id } = await params;

    const res = await fetch(`${BACKEND}/list/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
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
  } catch {
    return NextResponse.json(
      { error: "Hiba tortent a lista elem torlese soran" },
      { status: 500 }
    );
  }
}
