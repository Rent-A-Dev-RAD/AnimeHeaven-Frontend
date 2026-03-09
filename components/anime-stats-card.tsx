'use client'

import { useState, useEffect } from 'react'
import { Tv } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { getAllAnimes } from '@/lib/api/anime.service'

export function AnimeStatsCard() {
  const [count, setCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  const fetchAnimeCount = async () => {
    try {
      const result = await getAllAnimes()
      
      if (result.success && result.data) {
        setCount(result.data.length)
        setError(false)
        setLastUpdated(new Date().toLocaleTimeString('hu-HU', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }))
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnimeCount()
    
    // Refresh every 60 seconds
    const interval = setInterval(fetchAnimeCount, 60000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Tv className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">Összes Anime</p>
          {loading ? (
            <p className="text-2xl font-bold">Betöltés...</p>
          ) : error ? (
            <p className="text-2xl font-bold text-red-500">Hiba</p>
          ) : (
            <>
              <p className="text-2xl font-bold">{count?.toLocaleString('hu-HU')}</p>
              {lastUpdated && (
                <p className="text-xs text-muted-foreground mt-1">
                  Frissítve: {lastUpdated}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </Card>
  )
}
