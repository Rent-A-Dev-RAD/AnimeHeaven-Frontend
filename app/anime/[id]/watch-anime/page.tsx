'use client'

import { useState, use } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Header from '@/components/header'
import Link from 'next/link'

interface Anime {
    id: number
    title_japanese: string
    title_english: string
    genre: string
    fordito?: string
}

// Anime adatok (ugyanaz mint az anime-grid-ben)
const animes: Anime[] = [
    {
        id: 1,
        title_japanese: 'Chainsaw Man',
        title_english: 'Chainsaw Man',
        genre: 'Action, Fantasy',
        fordito: 'Anime Heaven Fansub',
    },
    {
        id: 2,
        title_japanese: 'Yofukashi no Uta',
        title_english: 'Call Of The Night',
        genre: 'Supernatural, Romance',
        fordito: 'Anime Heaven Fansub',
    },
    {
        id: 3,
        title_japanese: 'Jujutsu Kaisen',
        title_english: 'Jujutsu Kaisen',
        genre: 'Action, Fantasy, Shounen',
        fordito: 'Anime Heaven Fansub',
    },
    {
        id: 4,
        title_japanese: 'Sono Bisque Doll wa Koi wo Suru',
        title_english: 'My Dress-Up Darling',
        genre: 'Romance, Slice of Life',
        fordito: 'Anime Heaven Fansub',
    },
    {
        id: 5,
        title_japanese: 'Death Note',
        title_english: 'Death Note',
        genre: 'Thriller, Supernatural',
        fordito: 'Anime Heaven Fansub',
    },
    {
        id: 6,
        title_japanese: 'Otonari no Tenshi-sama ni Itsunomanika Dame Ningen ni Sareteita Ken',
        title_english: 'The Angel Next Door Spoils Me Rotten',
        genre: 'Romance, Slice of Life',
        fordito: 'Anime Heaven Fansub',
    },
]

export default function WatchAnimePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const anime = animes.find(a => a.id === parseInt(id))

    // Epizódok Indavideo URL-ekkel
    const episodes = [
        { number: 1, title: '1. rész', url: 'https://embed.indavideo.hu/player/video/86dd4bef6d' },
        { number: 2, title: '2. rész', url: 'https://embed.indavideo.hu/player/video/14ec055ca2' },
        { number: 3, title: '3. rész', url: 'https://embed.indavideo.hu/player/video/f9ee121743' },
        { number: 4, title: '4. rész', url: 'https://embed.indavideo.hu/player/video/85537f7dda' },
        { number: 5, title: '5. rész', url: 'https://embed.indavideo.hu/player/video/58c17a1a16' },
        { number: 6, title: '6. rész', url: 'https://embed.indavideo.hu/player/video/74406e2eb8' },
        { number: 7, title: '7. rész', url: 'https://embed.indavideo.hu/player/video/be7f1a793c' },
        { number: 8, title: '8. rész', url: 'https://embed.indavideo.hu/player/video/9a35c1f226' },
        { number: 9, title: '9. rész', url: 'https://embed.indavideo.hu/player/video/9c44d85d15' },
        { number: 10, title: '10. rész', url: 'https://embed.indavideo.hu/player/video/8f9bda6fb2' },
        { number: 11, title: '11. rész', url: 'https://embed.indavideo.hu/player/video/9a9df5b775' },
        { number: 12, title: '12. rész', url: 'https://embed.indavideo.hu/player/video/745e52f031' },
    ]

    const [currentEpisode, setCurrentEpisode] = useState(1)
    const totalEpisodes = episodes.length
    const currentVideoUrl = episodes[currentEpisode - 1]?.url

    const handlePrevious = () => {
        if (currentEpisode > 1) setCurrentEpisode(currentEpisode - 1)
    }

    const handleNext = () => {
        if (currentEpisode < totalEpisodes) setCurrentEpisode(currentEpisode + 1)
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-background text-foreground">
                {/* Anime információs fejléc */}
                <div className="bg-card/50 border-b border-border">
                    <div className="max-w-7xl mx-auto px-4 py-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            {/* Bal oldal - Címek */}
                            <div className="flex-1">
                                {anime?.title_japanese && anime?.title_english && anime.title_japanese !== anime.title_english ? (
                                    <>
                                        <Link href={`/anime/${anime.id}`}>
                                            <h1 className="text-2xl md:text-2xl font-bold mb-2 hover:text-primary transition-colors cursor-pointer">{anime.title_japanese}</h1>
                                        </Link>
                                        <Link href={`/anime/${anime.id}`}>
                                            <h2 className="text-lg md:text-l text-muted-foreground font-semibold hover:text-primary transition-colors cursor-pointer">{anime.title_english}</h2>
                                        </Link>
                                    </>
                                ) : (
                                    <Link href={`/anime/${anime?.id}`}>
                                        <h1 className="text-2xl md:text-2xl font-bold mb-2 hover:text-primary transition-colors cursor-pointer">{anime?.title_english || anime?.title_japanese}</h1>
                                    </Link>
                                )}
                            </div>
                            
                            {/* Jobb oldal - Műfajok és Fordító */}
                            <div className="flex flex-col gap-3 md:items-end">
                                <div className="flex flex-wrap gap-2">
                                    {anime?.genre.split(', ').map((genre) => (
                                        <span key={genre} className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm">
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                                {anime?.fordito && (
                                    <div className="text-sm text-muted-foreground">
                                        <span className="font-medium">Fordító:</span> {anime.fordito}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fő tartalom */}
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
                        {/* Videó lejátszó szekció */}
                        <div className="space-y-4">
                            {/* Epizód navigáció */}
                            <div className="flex items-center justify-between gap-4">
                                <button
                                    onClick={handlePrevious}
                                    disabled={currentEpisode === 1}
                                    className="flex items-center gap-2 px-4 py-2 bg-card hover:bg-accent/20 border border-border rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    <span className="hidden sm:inline">Előző</span>
                                </button>

                                <div className="text-center">
                                    <span className="text-lg font-semibold">{currentEpisode}. RÉSZ</span>
                                </div>

                                <button
                                    onClick={handleNext}
                                    disabled={currentEpisode === totalEpisodes}
                                    className="flex items-center gap-2 px-4 py-2 bg-card hover:bg-accent/20 border border-border rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="hidden sm:inline">Következő</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Videó lejátszó */}
                            <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-border">
                                <iframe
                                    key={currentEpisode}
                                    src={currentVideoUrl}
                                    className="w-full h-full"
                                    allowFullScreen
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    title={`${currentEpisode}. rész`}
                                />
                            </div>

                            {/* Szerver információ */}
                            <div className="bg-card border border-border rounded-lg p-4">
                                <p className="text-sm text-muted-foreground text-center">
                                    SZERVER #1 • <span className="text-accent">INDAVIDEO</span>
                                </p>
                            </div>
                        </div>

                        {/* Epizód lista oldalsáv */}
                        <div className="lg:sticky lg:top-20 h-fit">
                            <div className="bg-card border border-border rounded-lg overflow-hidden">
                                <div className="bg-accent/10 border-b border-border px-4 py-3">
                                    <h3 className="font-semibold text-accent">EPIZÓDOK</h3>
                                </div>
                                <div className="max-h-[600px] overflow-y-auto">
                                    {episodes.map((episode) => (
                                        <button
                                            key={episode.number}
                                            onClick={() => setCurrentEpisode(episode.number)}
                                            className={`cursor-pointer w-full text-left px-4 py-3 border-b border-border/50 transition hover:bg-accent/10 ${
                                                currentEpisode === episode.number
                                                    ? 'bg-accent/20 border-l-4 border-l-accent'
                                                    : ''
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">{episode.number}. Rész</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}