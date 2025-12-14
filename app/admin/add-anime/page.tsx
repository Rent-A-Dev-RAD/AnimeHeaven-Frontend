"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AddAnimePage() {
  const [malUrl, setMalUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [animeData, setAnimeData] = useState({
    title: "",
    englishTitle: "",
    japaneseTitle: "",
    synopsis: "",
    episodes: "",
    status: "",
    aired: "",
    season: "",
    studio: "",
    genres: "",
    rating: "",
    imageUrl: "",
    trailerUrl: "",
  })

  const handleFetchFromMAL = async () => {
    if (!malUrl) return

    setLoading(true)

    try {
      const response = await fetch("/api/fetch-mal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: malUrl }),
      })

      if (!response.ok) {
        throw new Error("Nem sikerült lekérni az adatokat")
      }

      const data = await response.json()

      if (data.error) {
        alert(data.error)
        setLoading(false)
        return
      }

      setAnimeData({
        title: data.title || "",
        englishTitle: data.englishTitle || "",
        japaneseTitle: data.japaneseTitle || "",
        synopsis: data.synopsis || "",
        episodes: data.episodes || "",
        status: data.status || "",
        aired: data.aired || "",
        season: data.season || "",
        studio: data.studio || "",
        genres: data.genres || "",
        rating: data.rating || "",
        imageUrl: data.imageUrl || "",
        trailerUrl: data.trailerUrl || "",
      })
    } catch (error) {
      console.error("Hiba történt:", error)
      alert("Hiba történt az adatok lekérése közben. Próbáld újra!")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setAnimeData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Anime hozzáadva:", animeData)
    alert("Anime sikeresen hozzáadva! (Demo mód)")
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
              <h1 className="text-2xl font-bold text-primary">Anime hozzáadása</h1>
              <p className="text-sm text-muted-foreground">MyAnimeList importálás</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* MyAnimeList Import */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <h2 className="text-lg font-bold mb-4">MyAnimeList importálás</h2>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="https://myanimelist.net/anime/..."
                value={malUrl}
                onChange={(e) => setMalUrl(e.target.value)}
                className="bg-background"
              />
            </div>
            <Button
              onClick={handleFetchFromMAL}
              disabled={loading || !malUrl}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Betöltés...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Adatok lekérése
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Illeszd be a MyAnimeList anime linkjét és az adatok automatikusan kitöltődnek
          </p>
        </Card>

        {/* Anime Form */}
        <form onSubmit={handleSubmit}>
          <Card className="p-6 bg-card border-border">
            <h2 className="text-lg font-bold mb-6">Anime adatok</h2>

            <div className="space-y-6">
              {/* Címek */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Magyar cím</Label>
                  <Input
                    value={animeData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="Chainsaw Man"
                  />
                </div>
                <div>
                  <Label>Angol cím</Label>
                  <Input
                    value={animeData.englishTitle}
                    onChange={(e) => handleChange("englishTitle", e.target.value)}
                    placeholder="Chainsaw Man"
                  />
                </div>
              </div>

              <div>
                <Label>Japán cím</Label>
                <Input
                  value={animeData.japaneseTitle}
                  onChange={(e) => handleChange("japaneseTitle", e.target.value)}
                  placeholder="チェンソーマン"
                />
              </div>

              {/* Leírás */}
              <div>
                <Label>Leírás</Label>
                <textarea
                  value={animeData.synopsis}
                  onChange={(e) => handleChange("synopsis", e.target.value)}
                  placeholder="Anime leírása..."
                  className="w-full min-h-[120px] px-3 py-2 rounded-md border border-input bg-background"
                />
              </div>

              {/* Részletek */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Epizódok száma</Label>
                  <Input
                    type="number"
                    value={animeData.episodes}
                    onChange={(e) => handleChange("episodes", e.target.value)}
                    placeholder="12"
                  />
                </div>
                <div>
                  <Label>Évad</Label>
                  <Input
                    value={animeData.season}
                    onChange={(e) => handleChange("season", e.target.value)}
                    placeholder="Fall 2022"
                  />
                </div>
                <div>
                  <Label>Értékelés</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={animeData.rating}
                    onChange={(e) => handleChange("rating", e.target.value)}
                    placeholder="8.7"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Stúdió</Label>
                  <Input
                    value={animeData.studio}
                    onChange={(e) => handleChange("studio", e.target.value)}
                    placeholder="MAPPA"
                  />
                </div>
                <div>
                  <Label>Státusz</Label>
                  <Input
                    value={animeData.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                    placeholder="Finished Airing"
                  />
                </div>
              </div>

              <div>
                <Label>Műfajok (vesszővel elválasztva)</Label>
                <Input
                  value={animeData.genres}
                  onChange={(e) => handleChange("genres", e.target.value)}
                  placeholder="Action, Dark Fantasy, Supernatural"
                />
              </div>

              <div>
                <Label>Adás időszaka</Label>
                <Input
                  value={animeData.aired}
                  onChange={(e) => handleChange("aired", e.target.value)}
                  placeholder="Oct 12, 2022 to Dec 28, 2022"
                />
              </div>

              {/* Média */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Borítókép URL</Label>
                  <Input
                    value={animeData.imageUrl}
                    onChange={(e) => handleChange("imageUrl", e.target.value)}
                    placeholder="/chainsaw-man-artwork.jpg"
                  />
                </div>
                <div>
                  <Label>Trailer URL</Label>
                  <Input
                    value={animeData.trailerUrl}
                    onChange={(e) => handleChange("trailerUrl", e.target.value)}
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 mt-8">
              <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                Anime mentése
              </Button>
              <Link href="/admin" className="flex-1">
                <Button type="button" variant="outline" className="w-full bg-transparent">
                  Mégse
                </Button>
              </Link>
            </div>
          </Card>
        </form>
      </div>
    </div>
  )
}
