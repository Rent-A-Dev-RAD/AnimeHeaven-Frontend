"use client";

import Header from "@/components/header";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Ha már be van jelentkezve, irányítsa át
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.trim().length >= 6 && !loading;
  }, [email, password, loading]);
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.includes("@")) return setError("Adj meg egy érvényes email címet.");
    if (password.length < 6) return setError("A jelszónak legalább 6 karakternek kell lennie.");

    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        setSuccess("Sikeres bejelentkezés! Átirányítás...");
        // A context automatikusan frissíti a user state-et
        // Kis késleltetés hogy lássa a felhasználó a sikeres üzenetet
        setTimeout(() => {
          router.push("/");
          window.location.reload(); // Hard refresh hogy biztosan frissüljön a header
        }, 800);
      } else {
        setError(result.message || "Bejelentkezés sikertelen.");
      }
    } catch (err) {
      setError("Váratlan hiba történt.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav>
        <Header />
      </nav>

      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-border bg-card p-8">
            <h1 className="mb-1 text-2xl font-bold">Bejelentkezés</h1>
            <p className="mb-6 text-sm text-foreground/70">
              Lépj be a fiókodba.
            </p>            {error && (
              <div className="mb-4 rounded border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 rounded border border-green-500/40 bg-green-500/10 px-3 py-2 text-sm text-green-600">
                {success}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded border border-border bg-background px-4 py-3"
              />

              <input
                type="password"
                placeholder="Jelszó"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border border-border bg-background px-4 py-3"
              />

              <button
                type="submit"
                disabled={!canSubmit}
                className="cursor-pointer w-full rounded bg-primary py-3 font-semibold text-primary-foreground disabled:opacity-50"
              >
                {loading ? "Bejelentkezés..." : "Bejelentkezés"}
              </button>
            </form>

            <p className="mt-4 text-center text-sm">
              Nincs még fiókod?{" "}
              <Link href="/register" className="cursor-pointer font-semibold underline">
                Regisztráció
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
