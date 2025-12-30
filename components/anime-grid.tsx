'use client'

import { useEffect, useState } from "react"
import { Card } from '@/components/ui/card'
import { Play, Plus } from 'lucide-react'
import Link from "next/link"
import animes from '@/app/data/animes.json'

export default function AnimeGrid() {
  // cache Jikan details by MAL id
  const [jikanDetails, setJikanDetails] = useState<Record<number, { score: number | null; image: string | null }>>({})

  useEffect(() => {
    const controllers: Record<number, AbortController> = {}

    animes.forEach((a) => {
      const malId = a.malId
      if (!malId) return

      const controller = new AbortController()
      controllers[malId] = controller

      fetch(`https://api.jikan.moe/v4/anime/${malId}`, { signal: controller.signal })
        .then((res) => {
          if (!res.ok) throw new Error('Network response was not ok')
          return res.json()
        })
        .then((data) => {
          const score = data?.data?.score ?? null
          // prefer webp large image (modern) then jpg large image
          const image = data?.data?.images?.webp?.large_image_url ?? data?.data?.images?.jpg?.large_image_url ?? null
          setJikanDetails((prev) => ({ ...prev, [malId]: { score, image } }))
        })
        .catch(() => {
          // mark as fetched-null to avoid retrying constantly
          setJikanDetails((prev) => ({ ...prev, [malId]: { score: null, image: null } }))
        })
    })

    return () => {
      Object.values(controllers).forEach((c) => c.abort())
    }
  }, [])

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
                  src={
                    ((anime.malId && jikanDetails[anime.malId]?.image) ?? anime.image) || "/placeholder.svg"
                  }
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
              <div className="p-3 flex flex-col flex-1">
                <h3 className="font-semibold text-sm line-clamp-2 mb-1">{anime.title_english || anime.title_japanese}</h3>
                <div className="h-5 mb-2">
                  {anime.title_japanese && anime.title_japanese !== anime.title_english && (
                    <p className="text-accent text-xs line-clamp-1">{anime.title_japanese}</p>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 mt-auto">
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-yellow-500 text-xs">★</span>
                    <span className="text-xs text-foreground/70">{
                      anime.malId && jikanDetails[anime.malId]?.score != null
                        ? Number(jikanDetails[anime.malId]!.score).toFixed(1)
                        : anime.rating
                    }</span>
                  </div>
                  <span className="text-xs text-muted-foreground truncate">{anime.genre}</span>
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
