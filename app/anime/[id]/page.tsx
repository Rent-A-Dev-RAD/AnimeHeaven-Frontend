import Header from '@/components/header'

// Anime típus definíció
interface Anime {
    id: number
    title_japanese: string
    title_english: string
    borito?: string
    hatter?: string
    rating: number
    genre: string
    malId: number
    leiras?: string
    studio?: string
    statusz?: string
    tipus?: string
    osszes_epizod?: number
    jelenlegi_epizod?: number
    megjelenes?: string
    fordito?: string
    besorolas?: string
    feltoltesDatuma?: string
    trailer?: string
    title?: string
    }

// Anime adatok (ugyanaz mint az anime-grid-ben)
const animes: Anime[] = [
  {
    id: 1,
    title_japanese: 'Chainsaw Man',
    title_english: 'Chainsaw Man',
    borito: 'https://cdn.myanimelist.net/images/anime/1806/126216l.webp',
    hatter: 'https://image.tmdb.org/t/p/original/9x3TvkC3pZ1rH6j7A0Rzq1Z2VeB.jpg',
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
    borito: 'https://cdn.myanimelist.net/images/anime/1164/134092l.webp',
    hatter: 'https://image.tmdb.org/t/p/original/veh7M4ho0vgqkW0n0hx1Up42elV.jpg',
    rating: 8.9,
    genre: 'Supernatural, Romance',
    malId: 50346,
    leiras: 'Ko Yamori éjszakánként bolyong az utcákon, mert nem tud aludni. Egy éjszaka találkozik Nazuna Nanakusával, egy titokzatos lánnyal, aki felfedi, hogy vámpír. Nazuna megmutatja Ko-nak az éjszakai élet varázsát és szabadságát, miközben különös kapcsolat alakul ki közöttük.',
    studio: 'Lidenfilms',
    statusz: 'Befejezett',
    tipus: 'TV',
    osszes_epizod: 13,
    jelenlegi_epizod: 13,
    megjelenes: '2022 Nyár',
    fordito: 'Anime Heaven Fansub',
    besorolas: 'R-17+',
    feltoltesDatuma: '2022-07-08',
    trailer: 'https://www.youtube-nocookie.com/embed/a4bSbmqwhso?enablejsapi=1&wmode=opaque&autoplay=0'
  },
  {
    id: 3,
    title_japanese: 'Jujutsu Kaisen',
    title_english: 'Jujutsu Kaisen',
    borito: 'https://cdn.myanimelist.net/images/anime/1171/109222l.webp',
    hatter: 'https://image.tmdb.org/t/p/original/20r6g0KfiAKZ3qBaFvBMvZ0Qbzz.jpg',
    rating: 8.8,
    genre: 'Action, Fantasy, Shounen',
    malId: 40748,
    leiras: 'Yuuji Itadori egy rendkívüli fizikai képességekkel rendelkező középiskolás. Egyik napja azzal kezdődik, hogy találkozik egy jujutsu varázslóval, aki elátkozott tárgyakat kutat. Amikor barátai veszélybe kerülnek, Yuuji lenyeli egy erős átok ujját, hogy megmentse őket.',
    studio: 'MAPPA',
    statusz: 'Folyamatban',
    tipus: 'TV',
    osszes_epizod: 24,
    jelenlegi_epizod: 24,
    megjelenes: '2020 Ősz',
    fordito: 'Anime Heaven Fansub',
    besorolas: 'R-17+',
    feltoltesDatuma: '2020-10-03',
    trailer: 'https://www.youtube-nocookie.com/embed/4A_X-Dvl0ws?enablejsapi=1&wmode=opaque&autoplay=0'
  },
  {
    id: 4,
    title_japanese: 'Sono Bisque Doll wa Koi wo Suru',
    title_english: 'My Dress-Up Darling',
    borito: 'https://cdn.myanimelist.net/images/anime/1179/119897l.webp',
    hatter: 'https://image.tmdb.org/t/p/original/c22TSmxhIuKEHhY7YKKBdaHnR61.jpg',
    rating: 8.7,
    genre: 'Romance, Slice of Life',
    malId: 48736,
    leiras: 'Wakana Gojou egy középiskolás fiú, aki hina babák készítésével foglalkozik. Egy nap osztálytársa, Marin Kitagawa felfedezi Wakana tehetségét, és megkéri, hogy segítsen neki cosplay jelmezek készítésében. Így kezdődik kettejük különleges barátsága.',
    studio: 'CloverWorks',
    statusz: 'Befejezett',
    tipus: 'TV',
    osszes_epizod: 12,
    jelenlegi_epizod: 12,
    megjelenes: '2022 Tél',
    fordito: 'Anime Heaven Fansub',
    besorolas: 'PG-13',
    feltoltesDatuma: '2022-01-09',
    trailer: 'https://www.youtube-nocookie.com/embed/tFKDKd8z-NU?enablejsapi=1&wmode=opaque&autoplay=0'
  },
  {
    id: 5,
    title_japanese: 'Death Note',
    title_english: 'Death Note',
    borito: 'https://cdn.myanimelist.net/images/anime/9/9453l.webp',
    hatter: 'https://image.tmdb.org/t/p/original/mOlEbXcb6ufRJKogI35KqsSlCfB.jpg',
    rating: 8.6,
    genre: 'Thriller, Supernatural',
    malId: 1535,
    leiras: 'Light Yagami egy kiváló tanuló, aki egy különleges noteszre bukkan, a Death Note-ra. Bárki neve, akit a noteszba írnak, meghal. Light úgy dönt, hogy megtisztítja a világot a gonosztól, de hamarosan egy titokzatos nyomozó, L nyomába ered.',
    studio: 'Madhouse',
    statusz: 'Befejezett',
    tipus: 'TV',
    osszes_epizod: 37,
    jelenlegi_epizod: 37,
    megjelenes: '2006 Ősz',
    fordito: 'Anime Heaven Fansub',
    besorolas: 'R-17+',
    feltoltesDatuma: '2006-10-04',
    trailer: 'https://www.youtube-nocookie.com/embed/Vt_3c8BgxV4?enablejsapi=1&wmode=opaque&autoplay=0'
  },
  {
    id: 6,
    title_japanese: 'Otonari no Tenshi-sama ni Itsunomanika Dame Ningen ni Sareteita Ken',
    title_english: 'The Angel Next Door Spoils Me Rotten',
    borito: 'https://cdn.myanimelist.net/images/anime/1009/131524l.webp',
    hatter: 'https://image.tmdb.org/t/p/original/eusdD22WIeV27BVQPSJz6YONtqf.jpg',
    rating: 9.0,
    genre: 'Romance, Slice of Life',
    malId: 50739,
    leiras: 'Amane Fujimiya egy magányos középiskolás fiú, aki egy napon találkozik szomszédjával, Mahiru Shiinával, akit az iskolában angyalnak hívnak. Amikor Mahiru észreveszi Amane rendetlen életmódját, eldönti, hogy gondoskodik róla.',
    studio: 'Project No.9',
    statusz: 'Befejezett',
    tipus: 'TV',
    osszes_epizod: 12,
    jelenlegi_epizod: 12,
    megjelenes: '2023 Tél',
    fordito: 'Anime Heaven Fansub',
    besorolas: 'PG-13',
    feltoltesDatuma: '2023-01-07',
    trailer: 'https://www.youtube-nocookie.com/embed/IUq59ARXtdg?enablejsapi=1&wmode=opaque&autoplay=0'
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
                <div className="relative max-w-7xl mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Borító kép */}
                        <div className="w-full md:w-1/4">
                            <div className="relative w-full aspect-[2/3] overflow-hidden rounded-lg shadow-lg">
                                <img
                                    src={anime.borito || "/placeholder.svg"}
                                    alt={anime.title_english || anime.title_japanese || anime.title || 'Anime cover'}
                                    className="w-full h-full object-cover rounded-lg scale-100 transition-transform duration-300"
                                />
                            </div>
                        </div>

                        {/* Részletek */}
                        <div className="w-full md:w-2/3">
                            {/* Címek */}
                            <div className="mb-4">
                                {anime.title_japanese && anime.title_english && anime.title_japanese !== anime.title_english ? (
                                    <>
                                        <h1 className="text-3xl md:text-4xl font-bold mb-2">{anime.title_japanese}</h1>
                                        <h2 className="text-xl md:text-2xl text-muted-foreground font-semibold">{anime.title_english}</h2>
                                    </>
                                ) : (
                                    <h1 className="text-3xl md:text-4xl font-bold">{anime.title_english || anime.title_japanese || anime.title}</h1>
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
                            {anime.studio && (
                                <div className="mb-6">
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 bg-muted/50 p-4 rounded-lg">
                                        {anime.fordito && (
                                            <>
                                                <div className="text-sm font-medium text-muted-foreground uppercase">FORDÍTÓ:</div>
                                                <div className="text-sm text-foreground">{anime.fordito}</div>
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
                                        {anime.studio && (
                                            <>
                                                <div className="text-sm font-medium text-muted-foreground uppercase">STÚDIÓ:</div>
                                                <div className="text-sm text-foreground">{anime.studio}</div>
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