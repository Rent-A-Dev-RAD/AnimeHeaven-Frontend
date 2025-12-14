import AnimeGrid from '@/components/anime-grid'
import Header from '@/components/header'

export default function Home() {
  return (
    <main className="bg-background text-foreground">
      <Header />
      <AnimeGrid />
    </main>
  )
}
