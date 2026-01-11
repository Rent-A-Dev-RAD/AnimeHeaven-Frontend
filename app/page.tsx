import AnimeGrid from '@/components/anime-grid'
import Header from '@/components/header'
import Hero from '@/components/hero'
import { getAllAnimes } from '@/lib/api/anime.service'

export default async function Home() {
  // Animék lekérése a service-ből
  const result = await getAllAnimes()
  const animes = result.data || []

  return (
    <main className="bg-background text-foreground">
      <Header animes={animes} />
      <Hero />
      <AnimeGrid animes={animes} />
    </main>
  )
}
