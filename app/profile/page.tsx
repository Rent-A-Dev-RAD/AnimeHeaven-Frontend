"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import ProtectedRoute from "@/components/protected-route";
import { Card } from "@/components/ui/card";
import { Play, Plus } from "lucide-react";
import Link from "next/link";
import { getAllAnimes } from "@/lib/api/anime.service";
import type { Anime } from "@/lib/types/anime";
import { CATEGORIES, Category } from "@/lib/anime-list";
import { useAuth } from "@/lib/contexts/AuthContext";
import { authService } from "@/lib/api/auth.service";
import { getListTypes, getMyListEntries } from "@/lib/api/list.service";

type ProfileAnimeEntry = {
  animeId: string;
  title: string;
  coverUrl?: string;
  category: Category;
  updatedAt: number;
};

const MAX_AVATAR_SIZE_BYTES = 50 * 1024 * 1024;

export default function ProfilePage() {
  const router = useRouter();
  const { user, refreshUser, showToast } = useAuth();
  const [active, setActive] = useState<Category>("Megnézendő");
  const [entries, setEntries] = useState<ProfileAnimeEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarDraft, setAvatarDraft] = useState<string | null>(null);
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);
  const [allAnimes, setAllAnimes] = useState<Anime[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setAvatar(user?.profileImage ?? null);
    setAvatarDraft(null);
  }, [user?.profileImage]);

  // Osszes anime + felhasznalo listajanak betoltese
  useEffect(() => {
    let isMounted = true;

    async function loadProfileData() {
      try {
        setLoadingEntries(true);

        const [animesResult, listTypes, myEntries] = await Promise.all([
          getAllAnimes(),
          getListTypes(),
          getMyListEntries(),
        ]);

        if (!isMounted) return;

        const allAnimeData = animesResult.data || [];
        setAllAnimes(allAnimeData);

        const typeIdToCategory = new Map<number, Category>(
          listTypes.map((item) => [item.id, item.name])
        );

        const animeById = new Map<number, Anime>(allAnimeData.map((anime) => [anime.id, anime]));

        const normalizedEntries = myEntries
          .map((entry) => {
            const anime = animeById.get(entry.animeId);
            const category = typeIdToCategory.get(entry.typeId);
            if (!anime || !category) return null;

            return {
              animeId: String(entry.animeId),
              title:
                anime.angol_cim || anime.title_english || anime.japan_cim || anime.title_japanese || "Anime",
              coverUrl: anime.borito,
              category,
              updatedAt: entry.addedAt ? Date.parse(entry.addedAt) : Date.now(),
            } as ProfileAnimeEntry;
          })
          .filter((item): item is ProfileAnimeEntry => !!item);

        setEntries(normalizedEntries);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Nem sikerult betolteni a profil listat.";
        showToast(message, "error");
      } finally {
        if (isMounted) {
          setLoadingEntries(false);
        }
      }
    }

    loadProfileData();
    window.addEventListener("focus", loadProfileData);

    return () => {
      isMounted = false;
      window.removeEventListener("focus", loadProfileData);
    };
  }, [showToast]);

  function pickAvatar() {
    fileRef.current?.click();
  }

  async function updateAvatarOnServer(profileImage: string | null): Promise<void> {
    const primaryResponse = await authService.authenticatedFetch("/api/profile/avatar", {
      method: "PUT",
      body: JSON.stringify({ profileImage }),
    });

    if (primaryResponse.status !== 404) {
      const primaryJson = await primaryResponse.json();
      if (!primaryResponse.ok) {
        throw new Error(primaryJson.message || primaryJson.error || "Nem sikerult menteni a profilkepet.");
      }
      return;
    }

    if (!user?.id) {
      throw new Error("A profilkep route nem erheto el (404), es nincs felhasznalo azonosito a fallbackhez.");
    }

    const fallbackResponse = await authService.authenticatedFetch(`/api/users/${user.id}`, {
      method: "PUT",
      body: JSON.stringify({ profilkep: profileImage }),
    });
    const fallbackJson = await fallbackResponse.json();

    if (!fallbackResponse.ok) {
      throw new Error(
        fallbackJson.message ||
          fallbackJson.error ||
          "Nem sikerult menteni a profilkepet (fallback endpoint)."
      );
    }
  }

  function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Csak kep fajl toltheto fel.", "error");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      showToast("A profilkep maximum 50MB lehet.", "error");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setAvatarDraft(String(reader.result));
    reader.readAsDataURL(file);

    e.target.value = "";
  }

  async function saveAvatar() {
    if (avatarDraft === null || avatarDraft === avatar) {
      showToast("Nincs mentendo valtozas.", "info");
      return;
    }

    try {
      setIsSavingAvatar(true);
      await updateAvatarOnServer(avatarDraft);

      setAvatar(avatarDraft);
      setAvatarDraft(null);
      await refreshUser();
      showToast("Profilkep sikeresen mentve.", "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Nem sikerult menteni a profilkepet.";
      showToast(message, "error");
    } finally {
      setIsSavingAvatar(false);
    }
  }

  async function removeAvatar() {
    try {
      setIsSavingAvatar(true);
      await updateAvatarOnServer(null);

      setAvatar(null);
      setAvatarDraft(null);
      await refreshUser();
      showToast("Profilkep torolve.", "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Nem sikerult torolni a profilkepet.";
      showToast(message, "error");
    } finally {
      setIsSavingAvatar(false);
    }
  }

  const counts = useMemo(() => {
    const map = new Map<Category, number>();
    CATEGORIES.forEach((c) => map.set(c, 0));
    for (const e of entries) {
      map.set(e.category, (map.get(e.category) || 0) + 1);
    }
    return map;
  }, [entries]);

  const filteredList = useMemo(() => {
    return entries.filter((x) => x.category === active);
  }, [entries, active]);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentList = filteredList.slice(startIndex, endIndex);
  const effectiveAvatar = avatarDraft ?? avatar;
  const hasAvatarChanges = avatarDraft !== null && avatarDraft !== avatar;

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground">
        <nav>
          <Header animes={allAnimes} />
        </nav>

        <main className="mx-auto max-w-6xl px-4 py-8">
          <h1 className="text-2xl font-bold">Profil</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Üdvözöllek, {user?.username || 'felhasználó'}! Itt kezelheted a listádat.
          </p>

        <div className="relative mt-6 flex items-center gap-4">
          <div className="h-20 w-20 overflow-hidden rounded-full border border-border bg-muted">
            {effectiveAvatar ? (
              <img
                src={effectiveAvatar}
                alt="Profilkép"
                className="h-full w-full object-cover"
                onError={() => {
                  setAvatar(null);
                  setAvatarDraft(null);
                }}
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

            <button
              type="button"
              onClick={saveAvatar}
              disabled={!hasAvatarChanges || isSavingAvatar}
              className="rounded-lg border border-border bg-background px-4 py-2 text-sm hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSavingAvatar ? "Mentés..." : "Mentés"}
            </button>

            {(effectiveAvatar || avatarDraft) && (
              <button
                type="button"
                onClick={removeAvatar}
                disabled={isSavingAvatar}
                className="rounded-lg border border-border bg-background px-4 py-2 text-sm hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Profilkép törlése
              </button>
            )}
          </div>

          {filteredList.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-center absolute left-1/2 -translate-x-1/2">
              <p className="text-lg md:text-xl font-semibold text-foreground whitespace-nowrap">
                {currentPage}. oldal a {totalPages}-ból
              </p>
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
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

        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {loadingEntries && (
            <p className="text-sm text-muted-foreground col-span-full">
              Lista betoltese folyamatban...
            </p>
          )}

          {currentList.map((item) => (
            <Link key={item.animeId} href={`/anime/${item.animeId}`} className="h-full">
              <Card className="bg-card border-border hover:border-accent transition-all group cursor-pointer h-full">
                <div className="relative overflow-hidden rounded-lg h-full flex flex-col">
                  <div className="relative w-full aspect-[2/3] overflow-hidden flex-shrink-0">
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    
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

          {!loadingEntries && currentList.length === 0 && (
            <p className="text-sm text-muted-foreground col-span-full">
              Ebben a kategóriában még nincs anime.
            </p>
          )}
        </div>

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
            </button>          </div>
        )}
      </main>
    </div>
    </ProtectedRoute>
  );
}
