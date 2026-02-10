import Link from "next/link"
import { Plus, Tv, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ServerStatusCard } from "@/components/server-status-card"

export default async function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b border-border bg-card">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">AnimeHeaven Adminisztráció</p>
          </div>
          <Link href="/">
            <Button variant="outline">Vissza a főoldalra</Button>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Tv className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Összes Anime</p>
                <p className="text-2xl font-bold">156</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Felhasználók</p>
                <p className="text-2xl font-bold">2,341</p>
              </div>
            </div>
          </Card>

          <ServerStatusCard />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Gyors műveletek</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/add-anime">
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 hover:border-primary/40 transition cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary rounded-lg group-hover:scale-110 transition">
                    <Plus className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Anime hozzáadása</p>
                    <p className="text-sm text-muted-foreground">MyAnimeList importálás</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/admin/manage-anime">
              <Card className="p-6 bg-card border-border hover:border-accent/40 transition cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent/20 rounded-lg">
                    <Tv className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Animék kezelése</p>
                    <p className="text-sm text-muted-foreground">Szerkesztés és törlés</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href={"/admin/manage-profiles"}>
              <Card className="p-6 bg-card border-border hover:border-accent/40 transition cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <Users className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Felhasználók</p>
                    <p className="text-sm text-muted-foreground">Kezelés és jogok</p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
