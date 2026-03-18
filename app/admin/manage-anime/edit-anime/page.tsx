"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Plus, Trash2, Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { getAnimeById, updateAnime, getEpisodesByAnimeId } from "@/lib/api/anime.service"

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

interface EditableEpisode {
  id: number
  sorrend: number
  resz: string
  inda?: string
  videa?: string
  lathatosag: number
}

function normalizeStatusForBackend(status: string): string {
  const normalized = (status || '').trim().toLowerCase()

  if (normalized === 'befejezett') return 'befejezett'
  if (normalized === 'folyamatban') return 'folyamatban'
  if (normalized === 'tervezett') return 'tervezett'

  return normalized
}

function mapApiAnimeToEditForm(data: Record<string, unknown>): Anime {
  return {
    id: Number(data.id || 0),
    title_japanese: String(data.title_japanese || data.japan_cim || ''),
    title_english: String(data.title_english || data.angol_cim || ''),
    borito: String(data.borito || ''),
    hatter: String(data.hatter || ''),
    rating: Number(data.rating ?? data.ertekeles ?? 0),
    genre: String(data.genre || data.cimkek || ''),
    malId: Number(data.malId ?? data.mal_id ?? 0),
    leiras: String(data.leiras || ''),
    studio: String(data.studio || data.studiok || ''),
    statusz: normalizeStatusForBackend(String(data.statusz || 'befejezett')),
    tipus: String(data.tipus || ''),
    osszes_epizod: Number(data.osszes_epizod ?? 0),
    jelenlegi_epizod: Number(data.jelenlegi_epizod ?? 0),
    megjelenes: String(data.megjelenes || ''),
    fordito: String(data.fordito || data.keszito || ''),
    besorolas: String(data.besorolas || ''),
    feltoltesDatuma: String(data.feltoltesDatuma || data.feltoltes_ido || ''),
    trailer: String(data.trailer || ''),
  }
}

function mapEditFormToBackendPayload(form: Anime) {
  return {
    japan_cim: form.title_japanese,
    angol_cim: form.title_english,
    borito: form.borito,
    hatter: form.hatter,
    ertekeles: form.rating,
    cimkek: form.genre,
    leiras: form.leiras,
    studiok: form.studio,
    statusz: normalizeStatusForBackend(form.statusz),
    tipus: form.tipus,
    osszes_epizod: form.osszes_epizod,
    jelenlegi_epizod: form.jelenlegi_epizod,
    megjelenes: form.megjelenes,
    keszito: form.fordito,
    besorolas: form.besorolas,
    feltoltes_ido: form.feltoltesDatuma,
    trailer: form.trailer,
    mal_id: form.malId,
  }
}

export default function EditAnimePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const animeId = searchParams.get('id')
  
  const [anime, setAnime] = useState<Anime | null>(null)
  const [episodes, setEpisodes] = useState<EditableEpisode[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editForm, setEditForm] = useState<Anime | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const episodesPerPage = 12

  useEffect(() => {
    if (animeId) {
      fetchAnimeData()
    }
  }, [animeId])

  const fetchAnimeData = async () => {
    try {
      setLoading(true)
      
      // Fetch anime data using service
      const result = await getAnimeById(parseInt(animeId!))
      
      if (result.success && result.data) {
        const mappedAnime = mapApiAnimeToEditForm(result.data as unknown as Record<string, unknown>)
        setAnime(mappedAnime)
        setEditForm(mappedAnime)
      } else {
        console.error('Anime nem található:', result.error)
        alert('Hiba történt az anime betöltésekor!')
      }
      
      // Fetch episodes
      const episodesResult = await getEpisodesByAnimeId(parseInt(animeId!))
      
      let loadedEpisodes: EditableEpisode[] = []
      
      if (episodesResult.success && episodesResult.data) {
        loadedEpisodes = episodesResult.data.map((ep: any) => {
          const editableEp: EditableEpisode = {
            id: ep.id,
            sorrend: ep.sorrend || 1,
            resz: ep.resz || `${ep.sorrend || 1}. rész`,
            lathatosag: ep.lathatosag ? 1 : 0
          }
          
          if (ep.forras_elems) {
            ep.forras_elems.forEach((source: any) => {
              if (!source?.forra?.nev) return
              const sourceName = source.forra.nev.toLowerCase()
              if (sourceName === 'indavideo') {
                editableEp.inda = source.link
              } else if (sourceName === 'videa') {
                editableEp.videa = source.link
              }
            })
          }
          
          return editableEp
        })
      }
      
      setEpisodes(loadedEpisodes)
      
    } catch (error) {
      console.error('Hiba az adatok betöltésekor:', error)
      alert('Hiba történt az adatok betöltésekor!')
    } finally {
      setLoading(false)
    }
  }

  const handleAnimeInputChange = (field: keyof Anime, value: string | number) => {
    if (editForm) {
      setEditForm({
        ...editForm,
        [field]: value,
      })
    }
  }
  const handleSaveAnime = async () => {
    if (!editForm) return
    
    setSaving(true)
    try {
      const backendPayload = mapEditFormToBackendPayload(editForm)
      const result = await updateAnime(editForm.id, backendPayload)

      if (!result.success) {
        throw new Error(result.error || 'Sikertelen frissítés')
      }

      alert(result.message || 'Az animé sikeresen frissítve!')
      router.push('/admin/manage-anime')
    } catch (error) {
      console.error('Hiba a frissítés során:', error)
      alert('Hiba történt a frissítés során!')
    } finally {
      setSaving(false)
    }
  }

  const handleEpisodeChange = (episodeId: number, field: keyof EditableEpisode, value: string | number) => {
    setEpisodes(episodes.map(ep => 
      ep.id === episodeId ? { ...ep, [field]: value } : ep
    ))
  }

  const handleAddEpisode = () => {
    const newEpisode: EditableEpisode = {
      id: Date.now(), // Temporary ID 
      sorrend: episodes.length + 1,
      resz: `${episodes.length + 1}. rész`,
      inda: "",
      videa: "",
    }
    setEpisodes([...episodes, newEpisode])
  }

  const handleDeleteEpisode = (episodeId: number) => {
    if (confirm('Biztosan törölni szeretnéd ezt az epizódot?')) {
      setEpisodes(episodes.filter(ep => ep.id !== episodeId))
    }
  }

  const toggleEpisodeVisibility = (episodeId: number) => {
    setEpisodes(episodes.map(ep => 
      ep.id === episodeId ? { ...ep, lathatosag: ep.lathatosag === 1 ? 0 : 1 } : ep
    ))
  }

  const handleSaveEpisodes = async () => {
    setSaving(true)
    try {
      // TODO: Implement save episodes API call
      console.log('Saving episodes:', episodes)
      alert('Epizódok sikeresen mentve!')
    } catch (error) {
      console.error('Hiba az epizódok mentése során:', error)
      alert('Hiba történt az epizódok mentése során!')
    } finally {
      setSaving(false)
    }
  }

  // Pagination
  const indexOfLastEpisode = currentPage * episodesPerPage
  const indexOfFirstEpisode = indexOfLastEpisode - episodesPerPage
  const currentEpisodes = episodes.slice(indexOfFirstEpisode, indexOfLastEpisode)
  const totalPages = Math.ceil(episodes.length / episodesPerPage)

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Betöltés...</p>
      </div>
    )
  }

  if (!anime || !editForm) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Anime nem található</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/manage-anime">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-primary">Anime szerkesztése</h1>
              <p className="text-sm text-muted-foreground">{anime.title_english || anime.title_japanese || `Anime #${anime.id}`}</p>
            </div>
          </div>
          <Button onClick={handleSaveAnime} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Mentés...' : 'Anime mentése'}
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Anime Details Section */}
        <Card className="p-6 mb-6 bg-card border-border">
          <h2 className="text-xl font-bold mb-4">Anime adatok</h2>
          <div className="flex items-start gap-6">
            <div className="relative w-40 h-56 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src={editForm.borito}
                alt={editForm.title_english || editForm.title_japanese || 'Anime borító'}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Angol cím</Label>
                <Input
                  value={editForm.title_english}
                  onChange={(e) => handleAnimeInputChange('title_english', e.target.value)}
                />
              </div>
              <div>
                <Label>Japán cím</Label>
                <Input
                  value={editForm.title_japanese}
                  onChange={(e) => handleAnimeInputChange('title_japanese', e.target.value)}
                />
              </div>
              <div>
                <Label>Stúdió</Label>
                <Input
                  value={editForm.studio}
                  onChange={(e) => handleAnimeInputChange('studio', e.target.value)}
                />
              </div>
              <div>
                <Label>Műfajok (vesszővel elválasztva)</Label>
                <Input
                  value={editForm.genre}
                  onChange={(e) => handleAnimeInputChange('genre', e.target.value)}
                />
              </div>
              <div>
                <Label>Értékelés (0-10)</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={editForm.rating}
                  onChange={(e) => handleAnimeInputChange('rating', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label>Státusz</Label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={editForm.statusz}
                  onChange={(e) => handleAnimeInputChange('statusz', e.target.value)}
                >
                  <option value="befejezett">Befejezett</option>
                  <option value="folyamatban">Folyamatban</option>
                  <option value="tervezett">Tervezett</option>
                </select>
              </div>
              <div>
                <Label>Fordító</Label>
                <Input
                  value={editForm.fordito}
                  onChange={(e) => handleAnimeInputChange('fordito', e.target.value)}
                />
              </div>
              <div>
                <Label>Típus</Label>
                <Input
                  value={editForm.tipus}
                  onChange={(e) => handleAnimeInputChange('tipus', e.target.value)}
                  placeholder="TV / Film / OVA"
                />
              </div>
              <div>
                <Label>Összes epizód</Label>
                <Input
                  type="number"
                  value={editForm.osszes_epizod}
                  onChange={(e) => handleAnimeInputChange('osszes_epizod', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label>Jelenlegi epizód</Label>
                <Input
                  type="number"
                  value={editForm.jelenlegi_epizod}
                  onChange={(e) => handleAnimeInputChange('jelenlegi_epizod', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label>Megjelenés</Label>
                <Input
                  value={editForm.megjelenes}
                  onChange={(e) => handleAnimeInputChange('megjelenes', e.target.value)}
                  placeholder="2023 Tél"
                />
              </div>
              <div>
                <Label>Besorolás</Label>
                <Input
                  value={editForm.besorolas}
                  onChange={(e) => handleAnimeInputChange('besorolas', e.target.value)}
                  placeholder="PG-13 / R-17+"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Leírás</Label>
                <textarea
                  className="w-full min-h-[120px] px-3 py-2 text-sm bg-background border border-input rounded-md"
                  value={editForm.leiras}
                  onChange={(e) => handleAnimeInputChange('leiras', e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Label>Borító URL</Label>
                <Input
                  value={editForm.borito}
                  onChange={(e) => handleAnimeInputChange('borito', e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Label>Háttér URL</Label>
                <Input
                  value={editForm.hatter}
                  onChange={(e) => handleAnimeInputChange('hatter', e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Label>Trailer URL</Label>
                <Input
                  value={editForm.trailer}
                  onChange={(e) => handleAnimeInputChange('trailer', e.target.value)}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Episodes Section */}
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">Epizódok kezelése</h2>
              <p className="text-sm text-muted-foreground">Összesen {episodes.length} epizód</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddEpisode} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Új epizód
              </Button>
              <Button onClick={handleSaveEpisodes} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Mentés...' : 'Epizódok mentése'}
              </Button>
            </div>
          </div>

          {/* Episodes List */}
          <div className="space-y-4">
            {currentEpisodes.map((episode) => (
              <Card key={episode.id} className="p-4 bg-background border-border">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-lg font-bold text-muted-foreground w-16">
                      {episode.sorrend}
                    </span>
                    <div className="flex-1">
                      <Label className="text-xs">RÉSZEK</Label>
                      <Input
                        value={episode.resz}
                        onChange={(e) => handleEpisodeChange(episode.id, 'resz', e.target.value)}
                        placeholder="Epizód címe"
                      />
                    </div>
                    <div className="flex-1">
                      <Label className="text-xs">SORREND</Label>
                      <Input
                        type="number"
                        value={episode.sorrend}
                        onChange={(e) => handleEpisodeChange(episode.id, 'sorrend', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleEpisodeVisibility(episode.id)}
                      className={episode.lathatosag === 1 ? 'text-green-500' : 'text-muted-foreground'}
                    >
                      {episode.lathatosag === 1 ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteEpisode(episode.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Video Sources */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs">INDA:</Label>
                    <Input
                      value={episode.inda || ''}
                      onChange={(e) => handleEpisodeChange(episode.id, 'inda', e.target.value)}
                      placeholder="Indavideo URL"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">VIDEA:</Label>
                    <Input
                      value={episode.videa || ''}
                      onChange={(e) => handleEpisodeChange(episode.id, 'videa', e.target.value)}
                      placeholder="Videa URL"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
