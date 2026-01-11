'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import type { Anime } from '@/lib/types/anime'

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  animes: Anime[]
}

export default function SearchDialog({ open, onOpenChange, animes }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Szűrés
  const filteredAnimes = animes.filter(anime => {
    const query = searchQuery.toLowerCase()
    return (
      anime.title_english?.toLowerCase().includes(query) ||
      anime.title_japanese?.toLowerCase().includes(query) ||
      anime.genre?.toLowerCase().includes(query) ||
      anime.studio?.toLowerCase().includes(query)
    )
  })

  const handleAnimeClick = () => {
    setSearchQuery('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Anime keresése</DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Keresés cím, műfaj vagy stúdió alapján..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
            autoFocus
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
              onClick={() => setSearchQuery('')}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto mt-4 space-y-2">
          {searchQuery === '' ? (
            <div className="text-center text-muted-foreground py-8">
              Kezdj el gépelni a kereséshez...
            </div>
          ) : filteredAnimes.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Nincs találat &quot;{searchQuery}&quot; keresésre
            </div>
          ) : (
            filteredAnimes.map((anime) => (
              <Link
                key={anime.id}
                href={`/anime/${anime.id}`}
                onClick={handleAnimeClick}
                className="flex gap-3 p-3 rounded-lg hover:bg-accent/10 transition-colors group"
              >
                <div className="relative w-16 h-24 flex-shrink-0 overflow-hidden rounded">
                  <img
                    src={anime.borito || '/placeholder.svg'}
                    alt={anime.title_english || anime.title_japanese}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold group-hover:text-accent transition-colors line-clamp-1">
                    {anime.title_english || anime.title_japanese}
                  </h3>
                  {anime.title_japanese && anime.title_english && anime.title_japanese !== anime.title_english && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {anime.title_japanese}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {anime.genre}
                    </span>
                    {anime.rating && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs font-semibold text-accent">
                          ⭐ {anime.rating}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
