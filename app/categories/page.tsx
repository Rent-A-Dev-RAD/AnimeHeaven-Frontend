import Header from '@/components/header'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { getAllAnimes } from '@/lib/api/anime.service'

export default async function CategoriesPage() {
  const result = await getAllAnimes()
  const animes = result.data || []

  // Kategóriák gyűjtése (egyedi műfajok)
  const genresMap = new Map<string, number>()
  
  animes.forEach(anime => {
    const genreField = anime.cimkek || anime.genre
    if (genreField) {
      const genres = genreField.split(',').map(g => g.trim())
      genres.forEach(genre => {
        genresMap.set(genre, (genresMap.get(genre) || 0) + 1)
      })
    }
  })

  // Rendezés népszerűség szerint
  const sortedGenres = Array.from(genresMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([genre, count]) => ({ genre, count }))

  return (
    <>
      <nav>
        <Header animes={animes} />
      </nav>
      <main className="bg-background text-foreground min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Kategóriák</h1>
            <p className="text-muted-foreground">
              Böngészd az animéket műfaj alapján
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sortedGenres.map(({ genre, count }) => (
              <Link key={genre} href={`/categories/${encodeURIComponent(genre)}`}>
                <Card className="p-6 hover:border-accent transition-all cursor-pointer group h-full">
                  <div className="flex flex-col items-center text-center gap-2">
                    <h3 className="font-semibold text-lg group-hover:text-accent transition-colors">
                      {genre}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      {count} anime
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
