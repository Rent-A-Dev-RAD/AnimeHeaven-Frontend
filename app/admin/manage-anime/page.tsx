"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Pencil, Trash2, ArrowLeft, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<Anime | null>(null)
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

  const handleEdit = (anime: Anime) => {
    setEditingId(anime.id)
    setEditForm({ ...anime })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm(null)
  }

  const handleSaveEdit = async () => {
    if (!editForm) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/update-anime', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      })

      if (!response.ok) {
        throw new Error('Sikertelen frissítés')
      }

      await fetchAnimes()
      setEditingId(null)
      setEditForm(null)
      alert('Az animé sikeresen frissítve!')
    } catch (error) {
      console.error('Hiba a frissítés során:', error)
      alert('Hiba történt a frissítés során!')
    } finally {
      setLoading(false)
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

  const handleInputChange = (field: keyof Anime, value: string | number) => {
    if (editForm) {
      setEditForm({
        ...editForm,
        [field]: value,
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">Animék kezelése</h1>
            <p className="text-sm text-muted-foreground">Animék szerkesztése és törlése</p>
          </div>
          <Link href="/admin">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Vissza az adminhoz
            </Button>
          </Link>
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
              {editingId === anime.id ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="flex items-start gap-6">
                    <div className="relative w-32 h-48 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={editForm?.borito || anime.borito}
                        alt={editForm?.title_english || anime.title_english}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Angol cím</Label>
                        <Input
                          value={editForm?.title_english || ''}
                          onChange={(e) => handleInputChange('title_english', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Japán cím</Label>
                        <Input
                          value={editForm?.title_japanese || ''}
                          onChange={(e) => handleInputChange('title_japanese', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Stúdió</Label>
                        <Input
                          value={editForm?.studio || ''}
                          onChange={(e) => handleInputChange('studio', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Műfajok</Label>
                        <Input
                          value={editForm?.genre || ''}
                          onChange={(e) => handleInputChange('genre', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Értékelés (0-10)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={editForm?.rating || 0}
                          onChange={(e) => handleInputChange('rating', parseFloat(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>Státusz</Label>
                        <Input
                          value={editForm?.statusz || ''}
                          onChange={(e) => handleInputChange('statusz', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Összes epizód</Label>
                        <Input
                          type="number"
                          value={editForm?.osszes_epizod || 0}
                          onChange={(e) => handleInputChange('osszes_epizod', parseInt(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>Jelenlegi epizód</Label>
                        <Input
                          type="number"
                          value={editForm?.jelenlegi_epizod || 0}
                          onChange={(e) => handleInputChange('jelenlegi_epizod', parseInt(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>Megjelenés</Label>
                        <Input
                          value={editForm?.megjelenes || ''}
                          onChange={(e) => handleInputChange('megjelenes', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Besorolás</Label>
                        <Input
                          value={editForm?.besorolas || ''}
                          onChange={(e) => handleInputChange('besorolas', e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Leírás</Label>
                        <textarea
                          className="w-full min-h-[100px] px-3 py-2 text-sm bg-background border border-input rounded-md"
                          value={editForm?.leiras || ''}
                          onChange={(e) => handleInputChange('leiras', e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Borító URL</Label>
                        <Input
                          value={editForm?.borito || ''}
                          onChange={(e) => handleInputChange('borito', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={loading}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Mégse
                    </Button>
                    <Button
                      onClick={handleSaveEdit}
                      disabled={loading}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? 'Mentés...' : 'Mentés'}
                    </Button>
                  </div>
                </div>
              ) : (
                // View Mode
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(anime)}
                        disabled={loading}
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        Szerkesztés
                      </Button>
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
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
