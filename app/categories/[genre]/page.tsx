import Header from '@/components/header'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { getAllAnimes } from '@/lib/api/anime.service'
import { Play, Plus } from 'lucide-react'

interface CategoryPageProps {
  params: Promise<{ genre: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { genre } = await params
  const decodedGenre = decodeURIComponent(genre)
  
  const result = await getAllAnimes()
  const allAnimes = result.data || []

  // Szűrés műfaj alapján
  const filteredAnimes = allAnimes.filter(anime => {
    if (!anime.genre) return false
    const genres = anime.genre.split(',').map(g => g.trim().toLowerCase())
    return genres.includes(decodedGenre.toLowerCase())
  })

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
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{decodedGenre}</h1>
            <p className="text-muted-foreground">
              {filteredAnimes.length} anime ebben a kategóriában
            </p>
          </div>

          {filteredAnimes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Nem található anime ebben a kategóriában
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredAnimes.map((anime) => (
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
                          <button className="bg-accent text-accent-foreground rounded-full p-2 hover:bg-accent/90 transition">
                            <Play className="w-4 h-4 fill-current" />
                          </button>
                          <button className="bg-foreground/20 text-foreground rounded-full p-2 hover:bg-foreground/30 transition border border-foreground/30">
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
        </div>
      </main>
    </>
  )
}
