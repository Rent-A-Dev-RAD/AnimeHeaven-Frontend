import { NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL;
const MAX_AVATAR_SIZE_BYTES = 50 * 1024 * 1024;

type AvatarBody = {
  profileImage?: string | null;
  profilkep?: string | null;
};

function estimateDataUrlSizeBytes(dataUrl: string): number {
  const base64 = dataUrl.split(",")[1] ?? "";
  return Math.floor((base64.length * 3) / 4);
}

function isAllowedImageValue(value: string): boolean {
  return /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(value);
}

export async function PUT(req: Request) {
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
    const body = (await req.json()) as AvatarBody;
    const profileImage = body.profileImage ?? body.profilkep ?? null;

    if (profileImage !== null) {
      if (!isAllowedImageValue(profileImage)) {
        return NextResponse.json(
          { error: "Csak kep formatumu (base64 data URL) profilkep engedelyezett" },
          { status: 400 }
        );
      }

      const sizeInBytes = estimateDataUrlSizeBytes(profileImage);
      if (sizeInBytes > MAX_AVATAR_SIZE_BYTES) {
        return NextResponse.json(
          { error: "A profilkep merete nem lehet nagyobb 50MB-nal" },
          { status: 413 }
        );
      }
    }

    const res = await fetch(`${BACKEND}/profile/avatar`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({ profilkep: profileImage }),
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
      { error: "Hiba tortent a profilkep mentese soran" },
      { status: 500 }
    );
  }
}
