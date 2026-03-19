"use client"

import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { useAuth } from '@/lib/contexts/AuthContext'
import { canAccessAdmin } from '@/lib/utils/roles'
import { Settings } from 'lucide-react'

export function AdminEditButton({ animeId }: { animeId: number }) {
    const { user } = useAuth()
    
    // Csak admin jogosultsággal rendelkezők láthatják
    if (!canAccessAdmin(user?.role)) {
        return null;
    }

    return (
        <Link href={`/admin/manage-anime/edit-anime?id=${animeId}`}>
            <Button variant="outline" size="lg" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground ml-4">
                <Settings className="w-4 h-4 mr-2" />
                Admin oldala
            </Button>
        </Link>
    )
}
