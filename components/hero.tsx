'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Play, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const featuredAnimes = [
  {
    id: 1,
    title: 'Chainsaw Man',
    subtitle: 'Chainsaw Man Arc',
    description: 'Denji egy elszegényedett tinédzser, aki elhunyt apja hatalmas adósságát próbálja törleszteni a jakuzának. Egyetlen társa Pochita, egy láncfűrész-ördög, akivel együtt ördögökre vadásznak, hogy pénzt keressenek.',
    image: 'https://image.tmdb.org/t/p/original/cCAAmkt18qkINhY7TR5WziRLQxE.jpg',
    rating: '9.0',
    malId: 44511
  },
  {
    id: 2,
    title: 'Call Of The Night',
    subtitle: 'Yofukashi no Uta',
    description: 'A történet főszereplője Ko Yamori, egy álmatlanságban szenvedő, 14 éves fiú, aki elégedetlen a nappali életével, ezért éjszakánként a városban bolyong. Egy ilyen séta során találkozik Nazuna Nanakusával, egy vámpírral, aki megmutatja neki az éjszakai élet szabadságát.',
    image: 'https://image.tmdb.org/t/p/original/veh7M4ho0vgqkW0n0hx1Up42elV.jpg',
    rating: '8.9',
    malId: 50346
  },
  {
    id: 3,
    title: 'My Dress Up Darling',
    subtitle: 'Sono Bisque Doll wa Koi wo Suru',
    description: 'Egy fiatal fiú és egy lány különös barátságot köt, amikor a fiú segít a lánynak elkészíteni a cosplay jelmezeit, miközben mindketten felfedezik saját szenvedélyeiket és álmaikat.',
    image: 'https://image.tmdb.org/t/p/original/c22TSmxhIuKEHhY7YKKBdaHnR61.jpg',
    rating: '8.8',
    malId: 48736
  },
  {
    id: 4,
    title: 'Death Note',
    subtitle: 'Shinigami Realm',
    description: 'A történet középpontjában egy fiatal diák áll, aki egy különleges noteszre bukkan, amely lehetővé teszi számára, hogy megölje azokat, akiket beleír.',
    image: 'https://image.tmdb.org/t/p/original/mOlEbXcb6ufRJKogI35KqsSlCfB.jpg',
    rating: '8.7',
    malId: 1535
  }
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoplay, setIsAutoplay] = useState(true)

  useEffect(() => {
    if (!isAutoplay) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredAnimes.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [isAutoplay])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoplay(false)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredAnimes.length)
    setIsAutoplay(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredAnimes.length) % featuredAnimes.length)
    setIsAutoplay(false)
  }

  const anime = featuredAnimes[currentSlide]

  // Cache fetched details (score + image) by MAL id
  const [details, setDetails] = useState<Record<number, { score: number | null; image: string | null }>>({})

  useEffect(() => {
    // Fetch score and large image from Jikan for the current anime if it has a malId and wasn't fetched yet
    if (!anime?.malId) return
    const malId = anime.malId
    if (details[malId] !== undefined) return

    const controller = new AbortController()

    fetch(`https://api.jikan.moe/v4/anime/${malId}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok')
        return res.json()
      })
      .then((data) => {
        const score = data?.data?.score ?? null
        // prefer webp large image then jpg large image
        const image = data?.data?.images?.webp?.large_image_url ?? data?.data?.images?.jpg?.large_image_url ?? null
        setDetails((prev) => ({ ...prev, [malId]: { score, image } }))
      })
      .catch(() => {
        setDetails((prev) => ({ ...prev, [malId]: { score: null, image: null } }))
      })

    return () => controller.abort()
  }, [anime, details])

  const ratingDisplay = (() => {
    if (anime?.malId) {
      const s = details[anime.malId]?.score
      if (s !== undefined && s !== null) return Number(s).toFixed(1)
      // if score is undefined (not yet fetched) or null (error), fall back to the static value
      return anime.rating
    }
    return anime.rating
  })()

  return (
    <div className="relative bg-gradient-to-b from-card/50 to-background overflow-hidden">
      {/* Háttér */}
      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-lg mx-auto max-w-7xl">
        {/* Slideok */}
        <div className="relative w-full h-full">
          {featuredAnimes.map((item, index) => (
            <div
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/30 to-transparent" />
            </div>
          ))}
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 text-balance">{anime.title}</h1>
            <p className="text-accent text-sm md:text-base font-semibold mb-2">{anime.subtitle}</p>
            <p className="text-gray-300 mb-6 max-w-lg text-sm md:text-base leading-relaxed">
              {anime.description}
            </p>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-500 font-semibold">{ratingDisplay}</span>
              <span className="text-gray-400 text-sm">MAL</span>
            </div>
            <div className="flex gap-3">
              <Button className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                <Play className="w-4 h-4 fill-current" />
                Lejátszás
              </Button>
              <Link href={`/anime/${anime.id}`}>
                <Button variant="outline" className="gap-2 border-foreground/30 hover:bg-foreground/10 bg-transparent">
                  <Info className="w-4 h-4" />
                  Részletek
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Nav gombok */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
          aria-label="Előző"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
          aria-label="Következő"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Indikatorok */}
      <div className="flex justify-center gap-2 py-6 max-w-7xl mx-auto px-4">
        {featuredAnimes.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-accent w-8'
                : 'bg-muted w-2 hover:bg-muted/70'
            }`}
            aria-label={`Dia ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
