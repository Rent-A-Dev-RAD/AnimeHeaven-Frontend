"use client";

import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, Category } from "@/lib/anime-list";
import { getAnimeCategory, upsertAnimeCategory } from "@/lib/api/list.service";
import { useAuth } from "@/lib/contexts/AuthContext";

type Props = {
  animeId: string;
};

type SelectValue = Category | "NONE";

export default function AnimeCategorySelect({ animeId }: Props) {
  const { showToast, isAuthenticated } = useAuth();
  const [value, setValue] = useState<SelectValue>("NONE");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialValue() {
      if (!isAuthenticated) {
        if (isMounted) {
          setValue("NONE");
          setIsLoading(false);
        }
        return;
      }

      try {
        setIsLoading(true);
        const existing = await getAnimeCategory(Number(animeId));
        if (!isMounted) return;
        setValue(existing ?? "NONE");
      } catch (error) {
        if (!isMounted) return;
        const message = error instanceof Error ? error.message : "Nem sikerult lekerdezni a kategoriat.";
        showToast(message, "error");
        setValue("NONE");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadInitialValue();

    return () => {
      isMounted = false;
    };
  }, [animeId, isAuthenticated, showToast]);

  const label = useMemo(() => {
    if (value === "NONE") return "Kategória: nincs";
    return `Kategória: ${value}`;
  }, [value]);

  async function onChange(v: SelectValue) {
    if (!isAuthenticated) {
      showToast("A besorolashoz jelentkezz be.", "error");
      return;
    }

    const previousValue = value;
    setValue(v);

    try {
      setIsSaving(true);
      await upsertAnimeCategory(Number(animeId), v === "NONE" ? null : v);
      showToast("A lista besorolas mentve.", "success");
    } catch (error) {
      setValue(previousValue);
      const message = error instanceof Error ? error.message : "Nem sikerult menteni a besorolast.";
      showToast(message, "error");
    } finally {
      setIsSaving(false);
    }
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

      {(isLoading || isSaving) && (
        <div className="mt-2 text-xs text-foreground/70">
          {isLoading ? "Kategoria lekerese..." : "Mentes folyamatban..."}
        </div>
      )}
    </div>
  );
}
