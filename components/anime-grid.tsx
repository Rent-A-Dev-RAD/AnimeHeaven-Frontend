'use client'

import { Card } from '@/components/ui/card'
import { Play, Plus } from 'lucide-react'
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Anime } from '@/lib/types/anime'

// Props interface - később komponens prop-ból kaphatja az animéket
interface AnimeGridProps {
  animes?: Anime[]
}

export default function AnimeGrid({ animes = [] }: AnimeGridProps) {
  const router = useRouter()
  
  // Jikan API cache removed - using backend data directly

  return (
    <section className="py-12 px-4 md:px-6 max-w-7xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold mb-8">Népszerű Animék</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {animes.map((anime) => (
          <Link key={anime.id} href={`/anime/${anime.id}`} className="h-full">
            <Card className="bg-card border-border hover:border-accent transition-all group cursor-pointer h-full">
            <div className="relative overflow-hidden rounded-lg h-full flex flex-col">
              {/* Kép */}
              <div className="relative w-full aspect-[2/3] overflow-hidden flex-shrink-0">
                <img
                  src={anime.borito || "/placeholder.svg"}
                  alt={anime.angol_cim || anime.japan_cim}
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
              <div className="p-3 flex flex-col flex-1">
                <h3 className="font-semibold text-sm line-clamp-2 mb-1">{anime.angol_cim || anime.japan_cim}</h3>
                <div className="h-5 mb-2">
                  {anime.japan_cim && anime.japan_cim !== anime.angol_cim && (
                    <p className="text-accent text-xs line-clamp-1">{anime.japan_cim}</p>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 mt-auto">
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-yellow-500 text-xs">★</span>
                    <span className="text-xs text-foreground/70">
                      {anime.ertekeles ? Number(anime.ertekeles).toFixed(1) : 'N/A'}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground truncate">{anime.cimkek?.split(', ')[0] || ''}</span>
                </div>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  </section>
  )
}
