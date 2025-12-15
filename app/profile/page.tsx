"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Header from "@/components/header";
import {
  CATEGORIES,
  Category,
  getAllEntries,
  ListEntry,
} from "@/lib/anime-list";

export default function ProfilePage() {
  const [active, setActive] = useState<Category>("Megnézendő");
  const [entries, setEntries] = useState<ListEntry[]>([]);
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // 🔹 Animék betöltése
  useEffect(() => {
    setEntries(getAllEntries());
    const onStorage = () => setEntries(getAllEntries());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // 🔹 Profilkép betöltése
  useEffect(() => {
    const saved = localStorage.getItem("ah_profile_avatar");
    if (saved) setAvatar(saved);
  }, []);

  // 🔹 Profilkép mentése
  useEffect(() => {
    if (avatar) localStorage.setItem("ah_profile_avatar", avatar);
    else localStorage.removeItem("ah_profile_avatar");
  }, [avatar]);

  // 🔹 Profilkép események
  function pickAvatar() {
    fileRef.current?.click();
  }

  function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(file);

    e.target.value = "";
  }

  function removeAvatar() {
    setAvatar(null);
  }

  // 🔹 Kategóriák számlálása
  const counts = useMemo(() => {
    const map = new Map<Category, number>();
    CATEGORIES.forEach((c) => map.set(c, 0));
    for (const e of entries) {
      map.set(e.category, (map.get(e.category) || 0) + 1);
    }
    return map;
  }, [entries]);

  // 🔹 Aktív lista
  const list = useMemo(() => {
    return entries
      .filter((x) => x.category === active)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [entries, active]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav>
        <Header />
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold">Profil</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Itt tudsz szűrni az animék között kategóriák szerint.
        </p>

        {/* 🔹 Profilkép */}
        <div className="mt-6 flex items-center gap-4">
          <div className="h-20 w-20 overflow-hidden rounded-full border border-border bg-muted">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatar}
                alt="Profilkép"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">
                Nincs
              </div>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onAvatarChange}
          />

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={pickAvatar}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Profilkép feltöltése
            </button>

            {avatar && (
              <button
                type="button"
                onClick={removeAvatar}
                className="rounded-lg border border-border bg-background px-4 py-2 text-sm hover:bg-muted"
              >
                Profilkép törlése
              </button>
            )}
          </div>
        </div>

        {/* 🔹 Kategóriák */}
        <div className="mt-10 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`rounded-full px-4 py-1 text-sm font-medium transition ${
                active === c
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {c} ({counts.get(c) || 0})
            </button>
          ))}
        </div>

        {/* 🔹 Lista */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {list.map((item) => (
            <div
              key={item.animeId}
              className="flex gap-4 rounded-lg border border-border bg-card p-3"
            >
              <div className="h-20 w-14 overflow-hidden rounded">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.coverUrl}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-center">
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {item.category}
                </p>
              </div>
            </div>
          ))}

          {list.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Ebben a kategóriában még nincs anime.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
