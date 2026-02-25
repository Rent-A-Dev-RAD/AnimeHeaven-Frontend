'use client'

import { useState, useEffect } from 'react'
import { Users } from 'lucide-react'
import { Card } from '@/components/ui/card'

export function UserStatsCard() {
  const [count, setCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  const fetchUserCount = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const result = await response.json()
        // API response lehet tömb vagy { success: true, data: [...] } formátum
        let users: unknown[] = []
        
        if (Array.isArray(result)) {
          users = result
        } else if (result.success && Array.isArray(result.data)) {
          users = result.data
        } else if (result.data && Array.isArray(result.data)) {
          users = result.data
        }
        
        setCount(users.length)
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
    fetchUserCount()
    
    // Refresh every 60 seconds
    const interval = setInterval(fetchUserCount, 60000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-accent/10 rounded-lg">
          <Users className="w-6 h-6 text-accent" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">Felhasználók</p>
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
