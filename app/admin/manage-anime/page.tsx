"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Pencil, Trash2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"

interface Anime {
  id: number
  title_japanese: string
  title_english: string
  borito: string
  hatter: string
  rating: number
  genre: string
  malId: number
  leiras: string
  studio: string
  statusz: string
  tipus: string
  osszes_epizod: number
  jelenlegi_epizod: number
  megjelenes: string
  fordito: string
  besorolas: string
  feltoltesDatuma: string
  trailer: string
}

export default function ManageAnimePage() {
  const [animes, setAnimes] = useState<Anime[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAnimes()
  }, [])

  const fetchAnimes = async () => {
    try {
      const response = await fetch('/api/animes')
      const data = await response.json()
      setAnimes(data)
    } catch (error) {
      console.error('Hiba az animék betöltésekor:', error)
      alert('Hiba történt az animék betöltésekor!')
    }
  }

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Biztosan törölni szeretnéd: ${title}?`)) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/delete-anime?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Sikertelen törlés')
      }

      await fetchAnimes()
      alert('Az animé sikeresen törölve!')
    } catch (error) {
      console.error('Hiba a törlés során:', error)
      alert('Hiba történt a törlés során!')
    } finally {
      setLoading(false)
    }
  }

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
              <h1 className="text-2xl font-bold text-primary">Animék kezelése</h1>
              <p className="text-sm text-muted-foreground">Animék szerkesztése és törlése</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <p className="text-muted-foreground">Összesen {animes.length} animé</p>
        </div>

        {/* Anime List */}
        <div className="space-y-4">
          {animes.map((anime) => (
            <Card key={anime.id} className="p-6 bg-card border-border">
              <div className="flex items-start gap-6">
                  <div className="relative w-32 h-48 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={anime.borito}
                      alt={anime.title_english}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="mb-2">
                      <h3 className="text-xl font-bold">{anime.title_english}</h3>
                      <p className="text-muted-foreground">{anime.title_japanese}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Stúdió</p>
                        <p className="font-medium">{anime.studio}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Értékelés</p>
                        <p className="font-medium">{anime.rating}/10</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Epizódok</p>
                        <p className="font-medium">{anime.jelenlegi_epizod}/{anime.osszes_epizod}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Státusz</p>
                        <p className="font-medium">{anime.statusz}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-1">Műfajok</p>
                      <p className="text-sm">{anime.genre}</p>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/admin/manage-anime/edit-anime?id=${anime.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={loading}
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Szerkesztés
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(anime.id, anime.title_english)}
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Törlés
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
      </div>
    </div>
  )
}
