import Header from '@/components/header'
import AnimeCategorySelect from "@/components/anime-category-select";
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import { getAnimeById, getAllAnimes } from '@/lib/api/anime.service'

export default async function AnimePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    
    // API szolgáltatás használata
    const result = await getAnimeById(parseInt(id))
    const anime = result.data
    
    const allAnimesResult = await getAllAnimes()
    const allAnimes = allAnimesResult.data || []

    if (!anime) {
        return (
            <>
                <nav>
                    <Header animes={allAnimes} />
                </nav>
                <main className="bg-background text-foreground">
                    <h1 className="text-3xl font-bold p-6 text-center">Anime nem található</h1>
                </main>
            </>
        )
    }

    return (
        <>
            <nav>
                <Header animes={allAnimes} />
            </nav>
            <main className="relative bg-background text-foreground min-h-screen overflow-hidden">
            {/* Elmosott háttér réteg - csak a borító magasságáig */}
            <div 
                className="absolute top-0 left-0 right-0 h-[65vh] z-0 bg-cover bg-top opacity-50 filter blur-sm"
                style={{ backgroundImage: `url(${anime.hatter || "/placeholder.svg"})` }}
            />
            
            {/* Sötétítő réteg gradient-tel */}
            <div className="absolute top-0 left-0 right-0 h-[65vh] z-0 bg-gradient-to-b from-black/60 via-black/50 to-transparent" />

            {/* Tartalom (Z-10-el a háttér fölé emelve) */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Borító kép */}
                        <div className="w-full md:w-1/4">
                            <div className="relative w-full aspect-[2/3] overflow-hidden rounded-lg shadow-lg">
                                <img
                                    src={anime.borito || "/placeholder.svg"}
                                    alt={anime.angol_cim || anime.japan_cim || 'Anime cover'}
                                    className="w-full h-full object-cover rounded-lg scale-100 transition-transform duration-300"
                                />
                            </div>
                        </div>

                        {/* Részletek */}
                        <div className="w-full md:w-2/3">
                            {/* Címek */}
                            <div className="mb-4">
                                {(anime.japan_cim || anime.title_japanese) && (anime.angol_cim || anime.title_english) && 
                                 (anime.japan_cim !== anime.angol_cim || anime.title_japanese !== anime.title_english) ? (
                                    <>
                                        <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                            {anime.japan_cim || anime.title_japanese}
                                        </h1>
                                        <h2 className="text-xl md:text-2xl text-muted-foreground font-semibold">
                                            {anime.angol_cim || anime.title_english}
                                        </h2>
                                    </>
                                ) : (
                                    <h1 className="text-3xl md:text-4xl font-bold">
                                        {anime.angol_cim || anime.title_english || anime.japan_cim || anime.title_japanese}
                                    </h1>
                                )}
                            </div>
                            
                        {/* Kategória kezelő és Megtekintés gomb */}
                            <div className="mb-6 flex flex-col sm:flex-row gap-6 items-center">
                                <Link href={`/anime/${anime.id}/watch-anime`}>
                                    <Button variant="default" size="lg" className=" bg-accent text-accent-foreground hover:bg-accent/90">
                                        Megtekintés
                                    </Button>
                                </Link>
                                <div className="flex-1 flex justify-end">
                                    <div className="w-full max-w-md">
                                        <AnimeCategorySelect
                                            animeId={String(anime.id)}
                                            title={anime.angol_cim || anime.title_english || anime.japan_cim || anime.title_japanese || "Anime"}
                                            coverUrl={anime.borito}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Műfajok */}
                            <div className="mb-6">
                                <div className="flex flex-wrap gap-2">
                                    {anime.cimkek?.split(', ').map((g, index) => (
                                        <Link key={index} href={`/categories/${encodeURIComponent(g.trim())}`}>
                                            <span className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm hover:bg-accent/80 transition-colors cursor-pointer">
                                                {g}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Leírás */}
                            <div className="mb-6">
                                <p className="text-muted-foreground text-base leading-relaxed">{anime.leiras}</p>
                            </div>

                            {/* Információk */}
                            {anime.studiok && (
                                <div className="mb-6">
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 bg-muted/50 p-4 rounded-lg">
                                        {anime.keszito && (
                                            <>
                                                <div className="text-sm font-medium text-muted-foreground uppercase">FORDÍTÓ:</div>
                                                <div className="text-sm text-foreground">{anime.keszito}</div>
                                            </>
                                        )}
                                        {anime.besorolas && (
                                            <>
                                                <div className="text-sm font-medium text-muted-foreground uppercase">BESOROLÁS:</div>
                                                <div className="text-sm text-foreground">{anime.besorolas}</div>
                                            </>
                                        )}
                                        {anime.statusz && (
                                            <>
                                                <div className="text-sm font-medium text-muted-foreground uppercase">STÁTUSZ:</div>
                                                <div className="text-sm text-foreground">{anime.statusz}</div>
                                            </>
                                        )}
                                        {anime.osszes_epizod && (
                                            <>
                                                <div className="text-sm font-medium text-muted-foreground uppercase">RÉSZEK:</div>
                                                <div className="text-sm text-foreground">{anime.jelenlegi_epizod}/{anime.osszes_epizod}</div>
                                            </>
                                        )}
                                        {anime.megjelenes && (
                                            <>
                                                <div className="text-sm font-medium text-muted-foreground uppercase">MEGJELENÉS:</div>
                                                <div className="text-sm text-foreground">{anime.megjelenes}</div>
                                            </>
                                        )}
                                        {anime.tipus && (
                                            <>
                                                <div className="text-sm font-medium text-muted-foreground uppercase">TÍPUS:</div>
                                                <div className="text-sm text-foreground">{anime.tipus}</div>
                                            </>
                                        )}
                                        {anime.studiok && (
                                            <>
                                                <div className="text-sm font-medium text-muted-foreground uppercase">STÚDIÓ:</div>
                                                <div className="text-sm text-foreground">{anime.studiok}</div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Trailer */}
                    {anime.trailer && (
                        <div className="mt-8">
                            <div className="aspect-video">
                                <iframe
                                    src={anime.trailer}
                                    title={`${anime.title_english} Trailer`}
                                    frameBorder="0"
                                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full rounded-lg shadow-lg"
                                ></iframe>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    )
}