import AnimeGrid from '@/components/anime-grid'
import Header from '@/components/header'
import Hero from '@/components/hero'

export default function Home() {
  return (
    <main className="bg-background text-foreground">
      <Header />
      <Hero />
      <AnimeGrid />
    </main>
  )
}
