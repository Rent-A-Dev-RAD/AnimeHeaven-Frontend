'use client'

import { useRouter } from 'next/navigation'
import type { Anime } from '@/lib/types/anime'

interface RandomAnimeButtonProps {
    animes: Anime[]
    className?: string
    children?: React.ReactNode
}

export default function RandomAnimeButton({ animes, className, children }: RandomAnimeButtonProps) {
    const router = useRouter()

    const handleRandomAnime = () => {
        if (animes.length === 0) return
        
        const randomIndex = Math.floor(Math.random() * animes.length)
        const randomAnime = animes[randomIndex]
        
        router.push(`/anime/${randomAnime.id}`)
    }

    return (
        <button 
            onClick={handleRandomAnime}
            className={`cursor-pointer ${className}`}
            disabled={animes.length === 0}
            >
            {children || 'Random anime'}
        </button>
    )
}
