'use client'

import { useState, useEffect } from 'react'
import { Settings, AlertCircle, CheckCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface HealthStatus {
  success: boolean
  status: string
  message: string
  timestamp: string
  startTime: string
  uptime: string
  uptimeMs: number
  database: {
    connected: boolean
    status: string
  }
  environment: string
  version: string
}

export function ServerStatusCard() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchHealth = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/health')
      if (response.ok) {
        const data = await response.json()
        setHealth(data)
        setError(false)
      } else {
        setError(true)
      }
    } catch (err) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHealth()
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchHealth, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const isOnline = health?.success && health?.database.connected && !error

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${isOnline ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
          <Settings className={`w-6 h-6 ${isOnline ? 'text-green-500' : 'text-red-500'}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Szerver</p>
            {isOnline ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
          {loading ? (
            <p className="text-2xl font-bold">Betöltés...</p>
          ) : error ? (
            <div>
              <p className="text-2xl font-bold text-red-500">Offline</p>
              <p className="text-xs text-muted-foreground mt-1">
                Nem elérhető
              </p>
            </div>
          ) : health ? (
            <div>
              <p className="text-2xl font-bold">{health.status}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Üzemidő: {health.uptime}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className={`w-2 h-2 rounded-full ${health.database.connected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                <p className="text-xs text-muted-foreground">
                  {health.database.status}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  )
}
