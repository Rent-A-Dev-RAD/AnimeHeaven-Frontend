export type Category =
  | "Kedvenc"
  | "Megnézendő"
  | "Tetszett"
  | "Nem tetszett"
  | "Droppolt";

export const CATEGORIES: Category[] = ["Kedvenc", "Megnézendő", "Tetszett", "Nem tetszett", "Droppolt"];

const CATEGORY_ALIASES: Record<string, Category> = {
  kedvenc: "Kedvenc",
  megnezendo: "Megnézendő",
  megnézendő: "Megnézendő",
  tetszett: "Tetszett",
  nemtetszett: "Nem tetszett",
  "nem tetszett": "Nem tetszett",
  droppolt: "Droppolt",
};

function normalizeKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

export function normalizeCategoryName(value: string): Category {
  const normalized = CATEGORY_ALIASES[normalizeKey(value)];
  return normalized ?? "Megnézendő";
}
