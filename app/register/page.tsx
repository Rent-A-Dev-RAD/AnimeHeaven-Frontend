"use client";

import Header from "@/components/header";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return (
      username.length >= 3 &&
      email.includes("@") &&
      password.length >= 6 &&
      password === password2 &&
      !loading
    );
  }, [username, email, password, password2, loading]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (username.length < 3) return setError("A felhasználónév túl rövid.");
    if (!email.includes("@")) return setError("Érvénytelen email.");
    if (password.length < 6) return setError("A jelszó túl rövid.");
    if (password !== password2) return setError("A jelszavak nem egyeznek.");

    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);

    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav>
        <Header />
      </nav>

      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-border bg-card p-8">
            <h1 className="mb-1 text-2xl font-bold">Regisztráció</h1>
            <p className="mb-6 text-sm text-foreground/70">
              Hozz létre egy új fiókot.
            </p>

            {error && (
              <div className="mb-4 rounded border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Felhasználónév"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded border border-border bg-background px-4 py-3"
              />

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

              <input
                type="password"
                placeholder="Jelszó újra"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                className="w-full rounded border border-border bg-background px-4 py-3"
              />

              <button
                type="submit"
                disabled={!canSubmit}
                className="cursor-pointer w-full rounded bg-primary py-3 font-semibold text-primary-foreground disabled:opacity-50"
              >
                {loading ? "Regisztráció..." : "Regisztráció"}
              </button>
            </form>

            <p className="mt-4 text-center text-sm">
              Van már fiókod?{" "}
              <Link href="/login" className="font-semibold underline cursor-pointer">
                Bejelentkezés
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
