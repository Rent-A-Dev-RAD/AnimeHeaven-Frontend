"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Edit2, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/contexts/AuthContext";
import { canManageUsers } from "@/lib/utils/roles";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/protected-route";

interface Profile {
  id: number;
  email: string;
  felhasznalonev: string;
  jelszo?: string; // backend adhatja vagy nem
  salt?: string;
  profilkep: string | null;
  jogosultsag: number;
}

const getRoleLabel = (jogosultsag: number) => {
  switch (jogosultsag) {
    case 0:
      return { label: "Inaktív", color: "text-gray-500 bg-gray-500/20" };
    case 1:
      return { label: "Felhasználó", color: "text-blue-500 bg-blue-500/20" };
    case 2:
      return { label: "Szerkesztő", color: "text-purple-500 bg-purple-500/20" };
    case 3:
      return { label: "Főszerkesztő", color: "text-orange-500 bg-orange-500/20" };
    case 4:
      return { label: "Admin", color: "text-red-500 bg-red-500/20" };
    case 5:
      return { label: "Tulajdonos", color: "text-yellow-500 bg-yellow-500/20" };
    default:
      return { label: "Ismeretlen", color: "text-gray-500 bg-gray-500/20" };
  }
};

export default function ManageProfilesPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);

  // Ellenőrizzük, hogy van-e jogosultsága
  useEffect(() => {
    if (isAuthenticated && !canManageUsers(user?.role)) {
      router.push('/admin');
    }
  }, [isAuthenticated, user, router]);

  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile) => {
      const term = searchTerm.toLowerCase().trim();
      if (!term) return true;
      return (
        profile.id.toString().includes(term) ||
        profile.felhasznalonev.toLowerCase().includes(term) ||
        profile.email.toLowerCase().includes(term)
      );
    });
  }, [profiles, searchTerm]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users", { cache: "no-store" });

      if (!res.ok) {
        const txt = await res.text();
        alert(`Lekérés hiba (${res.status}): ${txt}`);
        return;
      }

      const json = await res.json();

      // backend lehet: { data: [...] } vagy simán [...]
      const list: Profile[] = Array.isArray(json) ? json : (json.data ?? []);

      setProfiles(list);
    } catch (e: any) {
      alert("Lekérés hiba: " + (e?.message ?? "ismeretlen hiba"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const startEdit = (profile: Profile) => {
    setEditingId(profile.id);
    setEditForm({
      id: profile.id,
      email: profile.email,
      felhasznalonev: profile.felhasznalonev,
      profilkep: profile.profilkep,
      jogosultsag: profile.jogosultsag,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (editingId == null) return;

    try {
      const payload = {
        email: editForm.email,
        felhasznalonev: editForm.felhasznalonev,
        jogosultsag: editForm.jogosultsag,
        profilkep: editForm.profilkep ?? null,
      };

      const res = await fetch(`/api/users/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        alert(`Mentés hiba (${res.status}): ${txt}`);
        return;
      }

      const json = await res.json();

      // backend visszaadhatja a frissített usert, de ha nem, mi frissítjük lokálisan
      setProfiles((prev) =>
        prev.map((p) => (p.id === editingId ? ({ ...p, ...payload } as Profile) : p))
      );

      setEditingId(null);
      setEditForm({});
    } catch (e: any) {
      alert("Mentés hiba: " + (e?.message ?? "ismeretlen hiba"));
    }
  };

  const deleteProfile = async (id: number, jogosultsag: number) => {
    if (jogosultsag === 5) return;

    if (!confirm("Biztosan törölni szeretnéd ezt a profilt?")) return;

    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const txt = await res.text();
        alert(`Törlés hiba (${res.status}): ${txt}`);
        return;
      }

      setProfiles((prev) => prev.filter((p) => p.id !== id));
    } catch (e: any) {
      alert("Törlés hiba: " + (e?.message ?? "ismeretlen hiba"));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-primary">Felhasználók kezelése</h1>
              <p className="text-sm text-muted-foreground">Profilok szerkesztése és jogosultságok</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statisztikák */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          {[0, 1, 2, 3, 4, 5].map((level) => {
            const count = profiles.filter((p) => p.jogosultsag === level).length;
            const role = getRoleLabel(level);
            return (
              <Card key={level} className="p-4 bg-card border-border">
                <p className="text-sm text-muted-foreground mb-1">{role.label}</p>
                <p className="text-2xl font-bold">{count}</p>
              </Card>
            );
          })}
        </div>

        {/* Keresés */}
        <Card className="p-4 mb-6 bg-card border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Keresés felhasználónév, email vagy ID alapján..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Táblázat */}
        <Card className="bg-card border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Felhasználónév</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Jogosultság</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Műveletek</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-muted-foreground" colSpan={5}>
                      Betöltés...
                    </td>
                  </tr>
                ) : (
                  filteredProfiles.map((profile) => {
                    const isEditing = editingId === profile.id;
                    const role = getRoleLabel(profile.jogosultsag);

                    return (
                      <tr key={profile.id} className="hover:bg-accent/5 transition">
                        <td className="px-4 py-3 text-sm font-mono">{profile.id}</td>

                        <td className="px-4 py-3">
                          {isEditing ? (
                            <Input
                              value={editForm.felhasznalonev || ""}
                              onChange={(e) =>
                                setEditForm({ ...editForm, felhasznalonev: e.target.value })
                              }
                              className="h-8"
                            />
                          ) : (
                            <span className="font-medium">{profile.felhasznalonev}</span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {isEditing ? (
                            <Input
                              type="email"
                              value={editForm.email || ""}
                              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                              className="h-8"
                            />
                          ) : (
                            <span className="text-sm text-muted-foreground">{profile.email}</span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {isEditing ? (
                            <select
                              value={editForm.jogosultsag ?? profile.jogosultsag}
                              onChange={(e) =>
                                setEditForm({ ...editForm, jogosultsag: Number(e.target.value) })
                              }
                              className="h-8 px-2 rounded-md border border-border bg-background"
                            >
                              <option value={0}>Inaktív</option>
                              <option value={1}>Felhasználó</option>
                              <option value={2}>Szerkesztő</option>
                              <option value={3}>Főszerkesztő</option>
                              <option value={4}>Admin</option>
                              <option value={5}>Tulajdonos</option>
                            </select>
                          ) : (
                            <span className={`text-xs px-2 py-1 rounded ${role.color}`}>
                              {role.label}
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            {isEditing ? (
                              <>
                                <Button size="sm" variant="ghost" onClick={saveEdit}>
                                  <Check className="w-4 h-4 text-green-500" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={cancelEdit}>
                                  <X className="w-4 h-4 text-red-500" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button size="sm" variant="ghost" onClick={() => startEdit(profile)}>
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteProfile(profile.id, profile.jogosultsag)}
                                  disabled={profile.jogosultsag === 5}
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {!loading && filteredProfiles.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              Nincs találat a keresési feltételeknek megfelelően
            </div>
          )}
        </Card>

        <div className="mt-4 text-sm text-muted-foreground">
          Összesen {profiles.length} felhasználó, {filteredProfiles.length} megjelenítve
        </div>
      </div>
    </div>
  );
}