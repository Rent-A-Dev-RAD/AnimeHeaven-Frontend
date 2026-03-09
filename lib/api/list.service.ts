import { authService } from "@/lib/api/auth.service";
import { CATEGORIES, Category, normalizeCategoryName } from "@/lib/anime-list";
import type {
  GroupedProfileListsResponse,
  ListType,
  RawListEntry,
  UserListEntry,
} from "@/lib/types/list";

const KNOWN_CATEGORY_SET = new Set(CATEGORIES);

function extractArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    const maybeData = (value as { data?: unknown }).data;
    if (Array.isArray(maybeData)) return maybeData;
  }
  return [];
}

function normalizeListType(item: unknown): ListType | null {
  if (!item || typeof item !== "object") return null;
  const obj = item as Record<string, unknown>;

  const id = Number(obj.id ?? obj.tipus_id);
  const rawName =
    String(obj.name ?? obj.nev ?? obj.tipus_nev ?? obj.tipus ?? "").trim();

  if (!Number.isFinite(id) || !rawName) return null;

  const normalizedCategory = normalizeCategoryName(rawName);
  if (!KNOWN_CATEGORY_SET.has(normalizedCategory)) return null;

  return {
    id,
    name: normalizedCategory,
  };
}

function normalizeListEntry(item: unknown): UserListEntry | null {
  if (!item || typeof item !== "object") return null;
  const obj = item as RawListEntry;

  const id = Number(obj.id ?? obj.lista_id);
  const animeId = Number(obj.anime_id ?? obj.animeId);
  const typeId = Number(obj.tipus_id ?? obj.typeId);
  const addedAt = obj.hozzadva ?? obj.created_at;

  if (!Number.isFinite(id) || !Number.isFinite(animeId) || !Number.isFinite(typeId)) {
    return null;
  }

  return {
    id,
    animeId,
    typeId,
    addedAt,
  };
}

async function parseResponseOrThrow(response: Response): Promise<unknown> {
  let json: unknown;
  try {
    json = await response.json();
  } catch {
    throw new Error("A szerver nem JSON valasszal ter vissza.");
  }

  if (!response.ok) {
    const message =
      (json as { message?: string; error?: string })?.message ||
      (json as { message?: string; error?: string })?.error ||
      "Sikertelen API muvelet";
    throw new Error(message);
  }

  return json;
}

export async function getListTypes(): Promise<ListType[]> {
  const response = await authService.authenticatedFetch("/api/list/types", {
    method: "GET",
  });
  const json = await parseResponseOrThrow(response);
  return extractArray(json).map(normalizeListType).filter((x): x is ListType => !!x);
}

export async function getMyListEntries(): Promise<UserListEntry[]> {
  const response = await authService.authenticatedFetch("/api/list/my", {
    method: "GET",
  });
  const json = await parseResponseOrThrow(response);
  return extractArray(json)
    .map(normalizeListEntry)
    .filter((x): x is UserListEntry => !!x);
}

export async function getMyListsGrouped(): Promise<Record<Category, number[]>> {
  const response = await authService.authenticatedFetch("/api/profile/lists", {
    method: "GET",
  });
  const json = (await parseResponseOrThrow(response)) as GroupedProfileListsResponse;

  const grouped = Object.fromEntries(CATEGORIES.map((c) => [c, [] as number[]])) as Record<
    Category,
    number[]
  >;

  for (const [key, value] of Object.entries(json ?? {})) {
    const category = normalizeCategoryName(key);
    if (!KNOWN_CATEGORY_SET.has(category)) continue;

    if (!Array.isArray(value)) continue;

    const animeIds = value
      .map((entry) => {
        if (typeof entry === "number") return entry;
        if (entry && typeof entry === "object") {
          const obj = entry as { anime_id?: number; animeId?: number };
          return Number(obj.anime_id ?? obj.animeId);
        }
        return NaN;
      })
      .filter((id) => Number.isFinite(id));

    grouped[category] = animeIds;
  }

  return grouped;
}

export async function upsertAnimeCategory(
  animeId: number,
  category: Category | null
): Promise<void> {
  const [types, entries] = await Promise.all([getListTypes(), getMyListEntries()]);
  const existing = entries.find((entry) => entry.animeId === animeId);

  if (category === null) {
    if (!existing) return;

    const response = await authService.authenticatedFetch(`/api/list/${existing.id}`, {
      method: "DELETE",
    });
    await parseResponseOrThrow(response);
    return;
  }

  const targetType = types.find((item) => item.name === category);
  if (!targetType) {
    throw new Error(`Nem talalhato lista tipus: ${category}`);
  }

  if (!existing) {
    const response = await authService.authenticatedFetch("/api/list", {
      method: "POST",
      body: JSON.stringify({ animeId, typeId: targetType.id }),
    });
    await parseResponseOrThrow(response);
    return;
  }

  if (existing.typeId === targetType.id) return;

  const response = await authService.authenticatedFetch(`/api/list/${existing.id}`, {
    method: "PUT",
    body: JSON.stringify({ typeId: targetType.id }),
  });
  await parseResponseOrThrow(response);
}

export async function getAnimeCategory(animeId: number): Promise<Category | null> {
  const [types, entries] = await Promise.all([getListTypes(), getMyListEntries()]);
  const entry = entries.find((item) => item.animeId === animeId);
  if (!entry) return null;

  const type = types.find((item) => item.id === entry.typeId);
  return type?.name ?? null;
}
