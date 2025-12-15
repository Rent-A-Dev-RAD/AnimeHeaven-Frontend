export type Category =
  | "Kedvenc"
  | "Megnézendő"
  | "Tetszett"
  | "Nem tetszett"
  | "Droppolt";

export const CATEGORIES: Category[] = ["Kedvenc", "Megnézendő", "Tetszett", "Nem tetszett", "Droppolt"];

export type ListEntry = {
  animeId: string;
  title: string;
  coverUrl?: string;
  category: Category;
  updatedAt: number;
};

const LS_KEY = "ah_anime_list_entries_v1";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function getAllEntries(): ListEntry[] {
  if (typeof window === "undefined") return [];
  const data = safeParse<ListEntry[]>(localStorage.getItem(LS_KEY));
  return Array.isArray(data) ? data : [];
}

export function getEntry(animeId: string): ListEntry | null {
  return getAllEntries().find((x) => x.animeId === animeId) ?? null;
}

/** category = null => törlés (nincs besorolva) */
export function setEntry(params: {
  animeId: string;
  title: string;
  coverUrl?: string;
  category: Category | null;
}) {
  if (typeof window === "undefined") return;

  const list = getAllEntries();
  const idx = list.findIndex((x) => x.animeId === params.animeId);

  if (params.category === null) {
    if (idx !== -1) list.splice(idx, 1);
    localStorage.setItem(LS_KEY, JSON.stringify(list));
    return;
  }

  const next: ListEntry = {
    animeId: params.animeId,
    title: params.title,
    coverUrl: params.coverUrl,
    category: params.category,
    updatedAt: Date.now(),
  };

  if (idx === -1) list.push(next);
  else list[idx] = next;

  localStorage.setItem(LS_KEY, JSON.stringify(list));
}
