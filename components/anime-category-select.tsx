"use client";

import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, Category, getEntry, setEntry } from "@/lib/anime-list";

type Props = {
  animeId: string;
  title: string;
  coverUrl?: string;
};

type SelectValue = Category | "NONE";

export default function AnimeCategorySelect({ animeId, title, coverUrl }: Props) {
  const [value, setValue] = useState<SelectValue>("NONE");

  useEffect(() => {
    const existing = getEntry(animeId);
    setValue(existing?.category ?? "NONE");
  }, [animeId]);

  const label = useMemo(() => {
    if (value === "NONE") return "Kategória: nincs";
    return `Kategória: ${value}`;
  }, [value]);

  function onChange(v: SelectValue) {
    setValue(v);
    setEntry({
      animeId,
      title,
      coverUrl,
      category: v === "NONE" ? null : v,
    });
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-2 text-sm font-semibold">{label}</div>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SelectValue)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="NONE">Nincs besorolva</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <div className="mt-2 text-xs text-foreground/70">
        
      </div>
    </div>
  );
}
