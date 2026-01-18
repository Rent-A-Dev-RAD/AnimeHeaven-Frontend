'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { getAllAnimes } from '@/lib/api/anime.service'
import { Play, Plus } from 'lucide-react'
import type { Anime } from '@/lib/types/anime'

interface CategoryPageProps {
  params: Promise<{ genre: string }>
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const router = useRouter()
  const { genre } = use(params)
  const decodedGenre = decodeURIComponent(genre)
  
  const [allAnimes, setAllAnimes] = useState<Anime[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<'rating' | 'title-jp' | 'title-en'>('rating')
  const itemsPerPage = 1 // Teszteléshez 2, később állítsd vissza 20-ra

  useEffect(() => {
    getAllAnimes().then(result => {
      setAllAnimes(result.data || [])
      setLoading(false)
    })
  }, [])

  // Szűrés műfaj alapján
  const filteredAnimes = allAnimes.filter(anime => {
    if (!anime.genre) return false
    const genres = anime.genre.split(',').map(g => g.trim().toLowerCase())
    return genres.includes(decodedGenre.toLowerCase())
  })

  // Rendezés
  const sortedAnimes = [...filteredAnimes].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.rating || 0) - (a.rating || 0)
      case 'title-jp':
        return (a.title_japanese || '').localeCompare(b.title_japanese || '', 'ja')
      case 'title-en':
        return (a.title_english || '').localeCompare(b.title_english || '', 'en')
      default:
        return 0
    }
  })

  // Pagination számítások
  const totalPages = Math.ceil(sortedAnimes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentAnimes = sortedAnimes.slice(startIndex, endIndex)

  // Oldal váltás
  const goToPage = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <nav>
        <Header animes={allAnimes} />
      </nav>
      <main className="bg-background text-foreground min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Link 
              href="/categories" 
              className="text-accent hover:underline mb-2 inline-block"
            >
              ← Vissza a kategóriákhoz
            </Link>
            
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Bal oldal: Cím és számláló */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{decodedGenre}</h1>
                <p className="text-muted-foreground">
                  {loading ? 'Betöltés...' : `${filteredAnimes.length} anime ebben a kategóriában`}
                </p>
              </div>

              {/* Középen: Oldalszám */}
              {!loading && filteredAnimes.length > 0 && totalPages > 1 && (
                <div className="flex items-center justify-center md:absolute md:left-1/2 md:-translate-x-1/2">
                  <p className="text-lg md:text-xl font-semibold text-foreground whitespace-nowrap">
                    {currentPage}. oldal a {totalPages}-ból
                  </p>
                </div>
              )}

              {/* Jobb oldal: Rendezés */}
              {!loading && filteredAnimes.length > 0 && (
                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="text-sm text-muted-foreground whitespace-nowrap">
                    Rendezés:
                  </label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value as 'rating' | 'title-jp' | 'title-en')
                      setCurrentPage(1)
                    }}
                    className="bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
                  >
                    <option value="rating">MAL Rating (csökkenő)</option>
                    <option value="title-jp">Japán cím (ABC)</option>
                    <option value="title-en">Angol cím (ABC)</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Betöltés...</p>
            </div>
          ) : filteredAnimes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Nem található anime ebben a kategóriában
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {currentAnimes.map((anime) => (
                <Link key={anime.id} href={`/anime/${anime.id}`} className="h-full">
                  <Card className="bg-card border-border hover:border-accent transition-all group cursor-pointer h-full">
                    <div className="relative overflow-hidden rounded-lg h-full flex flex-col">
                      {/* Kép */}
                      <div className="relative w-full aspect-[2/3] overflow-hidden flex-shrink-0">
                        <img
                          src={anime.borito || "/placeholder.svg"}
                          alt={anime.title_english || anime.title_japanese}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3 gap-2">
                          <button 
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              router.push(`/anime/${anime.id}/watch-anime`)
                            }}
                            className="bg-accent text-accent-foreground rounded-full p-2 hover:bg-accent/90 transition cursor-pointer"
                          >
                            <Play className="w-4 h-4 fill-current" />
                          </button>
                          <button className="cursor-pointer bg-foreground/20 text-foreground rounded-full p-2 hover:bg-foreground/30 transition border border-foreground/30">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-3 flex-1 flex flex-col">
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-accent transition">
                          {anime.title_english || anime.title_japanese}
                        </h3>
                        <div className="flex items-center gap-2 mt-auto">
                          <span className="text-xs text-muted-foreground line-clamp-1">
                            {anime.genre}
                          </span>
                          {anime.rating > 0 && (
                            <>
                              <span className="text-xs">•</span>
                              <span className="text-xs font-semibold text-accent">
                                ⭐ {anime.rating}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination navigáció */}
          {!loading && filteredAnimes.length > 0 && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
              >
                ← Előző
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Csak a közelben lévő oldalakat jelenítjük meg
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 py-2 rounded-lg transition cursor-pointer ${
                          currentPage === page
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="px-2 py-2 text-muted-foreground">
                        ...
                      </span>
                    )
                  }
                  return null
                })}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
              >
                Következő →
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
