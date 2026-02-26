'use client'

import { useState, useEffect, useRef } from 'react'
import { Menu, Search, Bell, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from "next/link"
import Image from "next/image"
import SearchDialog from './search-dialog'
import NotificationsDialog from './notifications-dialog'
import RandomAnimeButton from './random-anime-button'
import type { Anime } from '@/lib/types/anime'
import { useAuth } from '@/lib/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  animes?: Anime[]
}

export default function Header({ animes = [] }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Bezárja a user menüt, ha kívülre kattintunk
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [showUserMenu])

  const handleLogout = () => {
    setShowUserMenu(false)
    logout()
    // A logout már megjeleníti a toast-ot az AuthContext-ben
    setTimeout(() => {
      router.push('/')
    }, 500)
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="flex items-center justify-between px-4 md:px-6 py-3 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image 
            src="/anime-heaven-logo.png" 
            alt="AnimeHeaven Logo" 
            width={60} 
            height={60}
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-[60px] md:h-[60px] transition-all duration-300 group-hover:scale-110 group-hover:brightness-110"
            style={{
              filter: 'drop-shadow(0 0 0px rgba(236, 72, 153, 0))',
              transition: 'filter 0.3s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'drop-shadow(0 0 8px rgba(236, 72, 153, 0.8)) drop-shadow(0 0 16px rgba(168, 85, 247, 0.6)) drop-shadow(0 0 24px rgba(236, 72, 153, 0.4))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'drop-shadow(0 0 0px rgba(236, 72, 153, 0))';
            }}
            priority
            unoptimized
          />
        </Link>

        {/* Navigation - PC */}
        <nav className="hidden md:flex gap-8">
          <Link href="/" className="hover:text-accent transition">
            Kezdőlap
          </Link>
          <RandomAnimeButton 
            animes={animes}
            className="hover:text-accent transition"
          >
            Random anime
          </RandomAnimeButton>
          <Link href="/categories" className="hover:text-accent transition">
            Kategóriák
          </Link>
          <Link href="/admin" className="hover:text-accent transition">
            Admin
          </Link>
        </nav>        {/* Header jobb oldali elemei */}
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
            {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <Button 
                variant="ghost" 
                size="icon"
                className="hover:bg-accent/10 hover:text-accent"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <User className="w-5 h-5" />
              </Button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-semibold">{user?.username}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <Link 
                    href="/profile" 
                    className="block px-4 py-2 hover:bg-accent/10 transition"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Profil
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      setShowUserMenu(false)
                      handleLogout()
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-accent/10 transition flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Kijelentkezés
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <Button className="hidden sm:inline bg-accent text-accent-foreground hover:bg-accent/80 transition-colors">
                Bejelentkezés
              </Button>
            </Link>
          )}
          
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
        isLoggedIn={isAuthenticated}
      />

      {/* Telefon Menu */}
      {isMenuOpen && (
        <nav className="md:hidden bg-card border-t border-border px-4 py-4 space-y-3">
          <Link href="/" className="block hover:text-accent transition">
            Kezdőlap
          </Link>
          <RandomAnimeButton 
            animes={animes}
            className="block hover:text-accent transition text-left"
          >
            Random Anime
          </RandomAnimeButton>
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
