'use client'

import { useState } from 'react'
import { Menu, Search, Bell} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from "next/link"
import SearchDialog from './search-dialog'
import NotificationsDialog from './notifications-dialog'
import type { Anime } from '@/lib/types/anime'

interface HeaderProps {
  animes?: Anime[]
}

export default function Header({ animes = [] }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  
  // TODO: Később ezt a backend-ből fogjuk lekérni
  const isLoggedIn = false

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="flex items-center justify-between px-4 md:px-6 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-accent-foreground font-bold">AH</span>
            </div>
            <span className="text-xl font-bold hidden sm:inline">AnimeHeaven</span>
          </div>
        </Link>

        {/* Navigation - PC */}
        <nav className="hidden md:flex gap-8">
           <Link href="/" className="hover:text-accent transition">
            Kezdőlap
          </Link>
          <a href="#" className="hover:text-accent transition">Random anime</a>
          <Link href="/categories" className="hover:text-accent transition">
            Kategóriák
          </Link>
          <Link href="/admin" className="hover:text-accent transition">
            Admin
          </Link>
        </nav>

        {/* Header jobb oldali elemei */}
        <div className="flex items-center gap-2 md:gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-accent/10 hover:text-accent"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-accent/10 hover:text-accent"
            onClick={() => setIsNotificationsOpen(true)}
          >
            <Bell className="w-5 h-5" />
          </Button>
          <Link href="/login">
              <Button className="hidden sm:inline bg-accent text-accent-foreground hover:bg-accent/80 transition-colors">
                Bejelentkezés
              </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-accent/10 hover:text-accent"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      {/* Dialógusok */}
      <SearchDialog 
        open={isSearchOpen} 
        onOpenChange={setIsSearchOpen}
        animes={animes}
      />
      <NotificationsDialog
        open={isNotificationsOpen}
        onOpenChange={setIsNotificationsOpen}
        isLoggedIn={isLoggedIn}
      />

      {/* Telefon Menu */}
      {isMenuOpen && (
        <nav className="md:hidden bg-card border-t border-border px-4 py-4 space-y-3">
          <Link href="/" className="block hover:text-accent transition">
            Kezdőlap
          </Link>
          <a href="#" className="block hover:text-accent transition">Random Anime</a>
          <Link href="/categories" className="block hover:text-accent transition">
            Kategóriák
          </Link>
          <Link href="/admin" className="block hover:text-accent transition">
            Admin
          </Link>
        </nav>
      )}
    </header>
  )
}
