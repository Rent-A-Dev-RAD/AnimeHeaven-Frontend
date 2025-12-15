'use client'

import { useState } from 'react'
import { Menu, Search, Bell} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from "next/link"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
          <a href="#" className="hover:text-accent transition">Kategóriák</a>
          <Link href="/admin" className="hover:text-accent transition">
            Admin
          </Link>
        </nav>

        {/* Header jobb oldali elemei */}
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" className="hover:bg-accent/20">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-accent/20">
            <Bell className="w-5 h-5" />
          </Button>
          <Link href="/login">
              <Button className="hidden sm:inline bg-accent text-accent-foreground hover:bg-accent/90">
                Bejelentkezés
              </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Telefon Menu */}
      {isMenuOpen && (
        <nav className="md:hidden bg-card border-t border-border px-4 py-4 space-y-3">
          <Link href="/" className="hover:text-accent transition">
            Kezdőlap
          </Link>
          <a href="#" className="block hover:text-accent transition">Random Anime</a>
          <a href="#" className="block hover:text-accent transition">Kategóriák</a>
          <Link href="/admin" className="hover:text-accent transition">
            Admin
          </Link>
        </nav>
      )}
    </header>
  )
}
