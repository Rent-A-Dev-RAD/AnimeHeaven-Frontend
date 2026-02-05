// Anime típus definíciók - Backend válasz szerint
export interface Anime {
  id: number
  japan_cim: string          // Backend mezőnevek
  angol_cim: string
  borito?: string
  hatter?: string
  ertekeles: number          // Backend: ertekeles (nem rating)
  cimkek: string            // Backend: cimkek (nem genre) - vesszővel elválasztva
  studiok?: string          // Backend: studiok (nem studio) - vesszővel elválasztva
  mal_link: string          // Backend: mal_link (URL string, nem ID)
  leiras?: string
  statusz?: string
  tipus?: string
  osszes_epizod?: number
  jelenlegi_epizod?: number
  megjelenes?: string
  szezon?: string
  keszito?: string          // Backend: keszito (fordító)
  besorolas?: string
  feltoltes_ido?: string    // Backend: feltoltes_ido
  trailer?: string
  lathatosag?: number
  reszek?: Episode[]        // Epizódok lista
  
  // Backward compatibility alias-ok (ha használod valahol)
  title_japanese?: string
  title_english?: string
  rating?: number
  genre?: string
  studio?: string
}

// Epizód típus
export interface Episode {
  id: number
  sorrend: number
  resz: string
  lathatosag: number
  anime_id?: number
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
