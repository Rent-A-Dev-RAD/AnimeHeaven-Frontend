// Anime típus definíciók - Ezt használd mindenhol az alkalmazásban
export interface Anime {
  id: number
  title_japanese: string
  title_english: string
  borito?: string
  hatter?: string
  rating: number
  genre: string
  malId: number
  leiras?: string
  studio?: string
  statusz?: string
  tipus?: string
  osszes_epizod?: number
  jelenlegi_epizod?: number
  megjelenes?: string
  fordito?: string
  besorolas?: string
  feltoltesDatuma?: string
  trailer?: string
  title?: string
}

// API Response típusok
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  error?: string
}

export interface AnimeFilters {
  genre?: string
  status?: string
  type?: string
  rating?: number
  search?: string
  page?: number
  limit?: number
}
