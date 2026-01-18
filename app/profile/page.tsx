"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import { Card } from "@/components/ui/card";
import { Play, Plus } from "lucide-react";
import Link from "next/link";
import { getAllAnimes } from "@/lib/api/anime.service";
import type { Anime } from "@/lib/types/anime";
import {
  CATEGORIES,
  Category,
  getAllEntries,
  ListEntry,
} from "@/lib/anime-list";

export default function ProfilePage() {
  const router = useRouter();
  const [active, setActive] = useState<Category>("Megnézendő");
  const [entries, setEntries] = useState<ListEntry[]>([]);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [allAnimes, setAllAnimes] = useState<Anime[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'time-desc' | 'time-asc'>('time-desc');
  const itemsPerPage = 20;
  const fileRef = useRef<HTMLInputElement | null>(null);

  // 🔹 Összes anime betöltése a Header számára
  useEffect(() => {
    getAllAnimes().then(result => {
      setAllAnimes(result.data || [])
    })
  }, []);

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
  const filteredList = useMemo(() => {
    return entries.filter((x) => x.category === active);
  }, [entries, active]);

  // 🔹 Rendezés
  const sortedList = useMemo(() => {
    return [...filteredList].sort((a, b) => {
      if (sortBy === 'time-desc') {
        return b.updatedAt - a.updatedAt;
      } else {
        return a.updatedAt - b.updatedAt;
      }
    });
  }, [filteredList, sortBy]);

  // 🔹 Pagination számítások
  const totalPages = Math.ceil(sortedList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentList = sortedList.slice(startIndex, endIndex);

  // 🔹 Oldal váltás
  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav>
        <Header animes={allAnimes} />
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold">Profil</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Itt tudsz szűrni az animék között kategóriák szerint.
        </p>

        {/* 🔹 Profilkép */}
        <div className="relative mt-6 flex items-center gap-4">
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
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 cursor-pointer"
            >
              Profilkép feltöltése
            </button>

            {avatar && (
              <button
                type="button"
                onClick={removeAvatar}
                className="rounded-lg border border-border bg-background px-4 py-2 text-sm hover:bg-muted cursor-pointer"
              >
                Profilkép törlése
              </button>
            )}
          </div>

          {/* Középen: Oldalszám */}
          {filteredList.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-center absolute left-1/2 -translate-x-1/2">
              <p className="text-lg md:text-xl font-semibold text-foreground whitespace-nowrap">
                {currentPage}. oldal a {totalPages}-ból
              </p>
            </div>
          )}
        </div>

        {/* 🔹 Kategóriák és Rendezés */}
        <div className="relative mt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Bal oldal: Kategória gombok */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setActive(c);
                  setCurrentPage(1);
                }}
                className={`rounded-full px-4 py-1 text-sm font-medium transition cursor-pointer ${
                  active === c
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {c} ({counts.get(c) || 0})
              </button>
            ))}
          </div>

          {/* Jobb oldal: Rendezés */}
          {filteredList.length > 0 && (
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-muted-foreground whitespace-nowrap">
                Rendezés:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as 'time-desc' | 'time-asc');
                  setCurrentPage(1);
                }}
                className="bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
              >
                <option value="time-desc">Legújabb elöl</option>
                <option value="time-asc">Legrégebbi elöl</option>
              </select>
            </div>
          )}
        </div>

        {/* 🔹 Lista */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {currentList.map((item) => (
            <Link key={item.animeId} href={`/anime/${item.animeId}`} className="h-full">
              <Card className="bg-card border-border hover:border-accent transition-all group cursor-pointer h-full">
                <div className="relative overflow-hidden rounded-lg h-full flex flex-col">
                  {/* Kép */}
                  <div className="relative w-full aspect-[2/3] overflow-hidden flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3 gap-2">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.push(`/anime/${item.animeId}/watch-anime`);
                        }}
                        className="cursor-pointer bg-accent text-accent-foreground rounded-full p-2 hover:bg-accent/90 transition"
                      >
                        <Play className="w-4 h-4 fill-current" />
                      </button>
                      <button className="cursor-pointer bg-foreground/20 text-foreground rounded-full p-2 hover:bg-foreground/30 transition border border-foreground/30">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3 flex flex-col flex-1">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-1">{item.title}</h3>
                    <div className="flex items-center justify-between gap-2 mt-auto">
                      <span className="text-xs text-muted-foreground truncate">{item.category}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}

          {currentList.length === 0 && (
            <p className="text-sm text-muted-foreground col-span-full">
              Ebben a kategóriában még nincs anime.
            </p>
          )}
        </div>

        {/* 🔹 Pagination navigáció */}
        {filteredList.length > 0 && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
            >
              ← Előző
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Csak a közelben lévő oldalakat jelenítjük meg
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-2 rounded-lg transition cursor-pointer ${
                        currentPage === page
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      {page}
                    </button>
                  )
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <span key={page} className="px-2 py-2 text-muted-foreground">
                      ...
                    </span>
                  )
                }
                return null
              })}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
            >
              Következő →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
