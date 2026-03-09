import type { Category } from "@/lib/anime-list";

export interface ListType {
  id: number;
  name: Category;
}

export interface RawListEntry {
  id?: number;
  lista_id?: number;
  anime_id?: number;
  animeId?: number;
  tipus_id?: number;
  typeId?: number;
  hozzadva?: string;
  created_at?: string;
}

export interface UserListEntry {
  id: number;
  animeId: number;
  typeId: number;
  addedAt?: string;
}

export interface GroupedProfileListsResponse {
  [category: string]: number[] | Array<{ anime_id?: number; animeId?: number }>;
}
