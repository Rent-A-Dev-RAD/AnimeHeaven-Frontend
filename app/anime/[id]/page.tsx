import Header from '@/components/header'

// Anime adatok (ugyanaz mint az anime-grid-ben)
const animes = [
  {
    id: 1,
    title_japanese: 'Chainsaw Man',
    title_english: 'Chainsaw Man',
    borito: 'https://cdn.myanimelist.net/images/anime/1806/126216l.webp',
    hatter: '',
    rating: 9.0,
    genre: 'Action, Fantasy',
    malId: 44511,
    leiras: 'Denji a szülei halála után hatalmas tartozást örököl. Hogy kifizesse, démonokra vadászik Pochita nevű démon-láncfűrész-kutyája segítségével. Nem vágynak másra, csak egy normális életre. Viszont a jakuza elárulja őket, így feldarabolva végzik egy szemetesben. Itt egyezséget kötnek, amelynek hála egy erősebb testen osztoznak majd. Ezután egy professzionális démonvadász csapat befogadja őket. Így a harc a normális életért tovább folyik.',
    studio: 'MAPPA',
    statusz: 'Befejezett',
    tipus: 'TV',
    osszes_epizod: 12,
    jelenlegi_epizod: 12,
    megjelenes: '2022 ŐSZ',
    fordito: 'Anime Heaven Fansub',
    besorolas: 'R-17+',
    feltoltesDatuma: '2022-10-12',
    trailer: 'https://www.youtube-nocookie.com/embed/jk7QSGwupPA?enablejsapi=1&wmode=opaque&autoplay=0'
    },
  {
    id: 2,
    title_japanese: 'Yofukashi no Uta',
    title_english: 'Call Of The Night',
    image: '',
    rating: 8.9,
    genre: 'Supernatural',
    malId: 50346

  },
  {
    id: 3,
    title_japanese: 'Jujutsu Kaisen',
    title_english: 'Jujutsu Kaisen',
    image: '',
    rating: 8.8,
    genre: 'Action',
    malId: 40748
  },
  {
    id: 4,
    title_japanese: 'Sono Bisque Doll wa Koi wo Suru',
    title_english: 'My Dress-Up Darling',
    image: '',
    rating: 8.7,
    genre: 'Romance',
    malId: 48736
  },
  {
    id: 5,
    title_japanese: 'Death Note',
    title_english: 'Death Note',
    image: '',
    rating: 8.6,
    genre: 'Thriller',
    malId: 1535
  },
  {
    id: 6,
    title_japanese: 'Otonari no Tenshi-sama ni Itsunomanika Dame Ningen ni Sareteita Ken',
    title_english: 'The Angel Next Door Spoils Me Rotten',
    image: '',
    rating: 9.0,
    genre: 'Romance',
    malId: 50739
  },
]

export default async function AnimePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const anime = animes.find(a => a.id === parseInt(id))

    if (!anime) {
        return (
            <>
                <nav>
                    <Header />
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
                <Header />
            </nav>
            <main className="relative bg-background text-foreground min-h-screen">
                {/* Háttérkép blur effekttel */}
                {(anime as any).hatter && (
                    <div className="fixed inset-0 -z-10 overflow-hidden">
                        <img 
                            src={(anime as any).hatter}
                            alt="Background"
                            className="absolute inset-0 w-full h-full object-cover object-center"
                            style={{
                                filter: 'blur(5px)',
                                transform: 'scale(1.1)',
                            }}
                        />
                        <div 
                            className="absolute inset-0" 
                            style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                backdropFilter: 'blur(5px)',
                            }}
                        />
                    </div>
                )}
                
                <div className="relative max-w-7xl mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Borító kép */}
                        <div className="w-full md:w-1/4">
                            <div className="relative w-full aspect-[2/3] overflow-hidden rounded-lg shadow-lg">
                                <img
                                    src={anime.borito || "/placeholder.svg"}
                                    alt={(anime as any).title_english || (anime as any).title_japanese || (anime as any).title}
                                    className="w-full h-full object-cover rounded-lg scale-100 transition-transform duration-300"
                                />
                            </div>
                        </div>

                        {/* Részletek */}
                        <div className="w-full md:w-2/3">
                            {/* Címek */}
                            <div className="mb-4">
                                {(anime as any).title_japanese && (anime as any).title_english && (anime as any).title_japanese !== (anime as any).title_english ? (
                                    <>
                                        <h1 className="text-3xl md:text-4xl font-bold mb-2">{(anime as any).title_japanese}</h1>
                                        <h2 className="text-xl md:text-2xl text-muted-foreground font-semibold">{(anime as any).title_english}</h2>
                                    </>
                                ) : (
                                    <h1 className="text-3xl md:text-4xl font-bold">{(anime as any).title_english || (anime as any).title_japanese || (anime as any).title}</h1>
                                )}
                            </div>
                            
                            {/* Műfajok */}
                            <div className="mb-6">
                                <div className="flex flex-wrap gap-2">
                                    {anime.genre.split(', ').map((g, index) => (
                                        <span key={index} className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm">
                                            {g}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Leírás */}
                            <div className="mb-6">
                                <p className="text-muted-foreground text-base leading-relaxed">{anime.leiras}</p>
                            </div>

                            {/* Információk */}
                            {(anime as any).studio && (
                                <div className="mb-6">
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 bg-muted/50 p-4 rounded-lg">
                                        {(anime as any).fordito && (
                                            <>
                                                <div className="text-sm font-medium text-muted-foreground uppercase">FORDÍTÓ:</div>
                                                <div className="text-sm text-foreground">{(anime as any).fordito}</div>
                                            </>
                                        )}
                                        {(anime as any).besorolas && (
                                            <>
                                                <div className="text-sm font-medium text-muted-foreground uppercase">BESOROLÁS:</div>
                                                <div className="text-sm text-foreground">{(anime as any).besorolas}</div>
                                            </>
                                        )}
                                        {(anime as any).statusz && (
                                            <>
                                                <div className="text-sm font-medium text-muted-foreground uppercase">STÁTUSZ:</div>
                                                <div className="text-sm text-foreground">{(anime as any).statusz}</div>
                                            </>
                                        )}
                                        {(anime as any).osszes_epizod && (
                                            <>
                                                <div className="text-sm font-medium text-muted-foreground uppercase">RÉSZEK:</div>
                                                <div className="text-sm text-foreground">{(anime as any).jelenlegi_epizod}/{(anime as any).osszes_epizod}</div>
                                            </>
                                        )}
                                        {(anime as any).megjelenes && (
                                            <>
                                                <div className="text-sm font-medium text-muted-foreground uppercase">MEGJELENÉS:</div>
                                                <div className="text-sm text-foreground">{(anime as any).megjelenes}</div>
                                            </>
                                        )}
                                        {(anime as any).tipus && (
                                            <>
                                                <div className="text-sm font-medium text-muted-foreground uppercase">TÍPUS:</div>
                                                <div className="text-sm text-foreground">{(anime as any).tipus}</div>
                                            </>
                                        )}
                                        {(anime as any).studio && (
                                            <>
                                                <div className="text-sm font-medium text-muted-foreground uppercase">STÚDIÓ:</div>
                                                <div className="text-sm text-foreground">{(anime as any).studio}</div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Trailer */}
                    {(anime as any).trailer && (
                        <div className="mt-8">
                            <div className="aspect-video">
                                <iframe
                                    src={(anime as any).trailer}
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