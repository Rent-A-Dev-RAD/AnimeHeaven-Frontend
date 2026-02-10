import type { Anime, ApiResponse, PaginatedResponse, AnimeFilters } from '@/lib/types/anime'
import { API_CONFIG, getApiUrl } from '@/lib/config/api.config'
import animesData from '@/app/data/animes.json'

const mockAnimes: Anime[] = animesData as unknown as Anime[]

export async function getAllAnimes(): Promise<ApiResponse<Anime[]>> {
  try {
    if (API_CONFIG.USE_REAL_API) {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.ANIMES), {
        next: { 
          revalidate: API_CONFIG.CACHE.REVALIDATE,
          tags: [API_CONFIG.CACHE.TAGS.ANIMES] 
        }
      })
      
      if (!response.ok) {
        throw new Error('Nem sikerült betölteni az animéket')
      }
      
      const result = await response.json()
      // Backend már {success: true, data: [...]} formátumban válaszol
      return result
    } else {
      // Mock adatok használata
      return {
        success: true,
        data: mockAnimes
      }
    }
  } catch (error) {
    console.error('Hiba az animék betöltése közben:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ismeretlen hiba',
      data: [] // Fallback üres tömb
    }
  }
}

/**
 * Egy konkrét anime lekérése ID alapján
 */
export async function getAnimeById(id: number): Promise<ApiResponse<Anime>> {
  try {
    if (API_CONFIG.USE_REAL_API) {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.ANIME_BY_ID, { id }), 
        {
          next: { 
            revalidate: API_CONFIG.CACHE.REVALIDATE,
            tags: [API_CONFIG.CACHE.TAGS.ANIME, `anime-${id}`] 
          }
        }
      )
      
      if (!response.ok) {
        throw new Error('Az anime nem található')
      }
      
      const result = await response.json()
      // Backend már {success: true, data: anime} formátumban válaszol
      return result
    } else {
      // Mock adatok használata
      const anime = mockAnimes.find(a => a.id === id)
      
      if (!anime) {
        return {
          success: false,
          error: 'Az anime nem található'
        }
      }
      
      return {
        success: true,
        data: anime
      }
    }
  } catch (error) {
    console.error(`Hiba az anime betöltése közben (ID: ${id}):`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ismeretlen hiba'
    }
  }
}

/**
 * Animék keresése szűrőkkel
 */
export async function searchAnimes(filters: AnimeFilters): Promise<PaginatedResponse<Anime>> {
  try {
    if (API_CONFIG.USE_REAL_API) {
      // Valódi API hívás (később)
      const queryParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value))
        }
      })
      
      const response = await fetch(
        `${getApiUrl(API_CONFIG.ENDPOINTS.SEARCH_ANIMES)}?${queryParams}`,
        {
          next: { 
            revalidate: API_CONFIG.CACHE.REVALIDATE,
            tags: [API_CONFIG.CACHE.TAGS.ANIMES] 
          }
        }
      )
      
      if (!response.ok) {
        throw new Error('Hiba a keresés során')
      }
      
      // Backend már teljes formátumban válaszol
      return await response.json()
    } else {
      // Mock szűrés
      let filtered = [...mockAnimes]
      
      // Szöveges keresés
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filtered = filtered.filter(anime => 
          anime.title_english?.toLowerCase().includes(searchLower) ||
          anime.title_japanese?.toLowerCase().includes(searchLower) ||
          anime.leiras?.toLowerCase().includes(searchLower)
        )
      }
      
      // Műfaj szűrés
      if (filters.genre) {
        filtered = filtered.filter(anime => 
          anime.genre?.toLowerCase().includes(filters.genre!.toLowerCase()) ||
          anime.cimkek?.toLowerCase().includes(filters.genre!.toLowerCase())
        )
      }
      
      // Státusz szűrés
      if (filters.status) {
        filtered = filtered.filter(anime => 
          anime.statusz?.toLowerCase() === filters.status!.toLowerCase()
        )
      }
      
      // Típus szűrés
      if (filters.type) {
        filtered = filtered.filter(anime => 
          anime.tipus?.toLowerCase() === filters.type!.toLowerCase()
        )
      }
      
      // Rating szűrés
      if (filters.rating) {
        filtered = filtered.filter(anime => {
          const rating = anime.rating || (anime.ertekeles ? Number(anime.ertekeles) : 0)
          return rating >= filters.rating!
        })
      }
      
      // Pagination
      const page = filters.page || 1
      const limit = filters.limit || 12
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedData = filtered.slice(startIndex, endIndex)
      
      return {
        success: true,
        data: paginatedData,
        pagination: {
          page,
          limit,
          total: filtered.length,
          totalPages: Math.ceil(filtered.length / limit)
        }
      }
    }
  } catch (error) {
    console.error('Hiba a keresés során:', error)
    return {
      success: false,
      data: [],
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0
      },
      error: error instanceof Error ? error.message : 'Ismeretlen hiba'
    }
  }
}

/**
 * Népszerű animék lekérése
 */
export async function getPopularAnimes(limit: number = 6): Promise<ApiResponse<Anime[]>> {
  try {
    const result = await getAllAnimes()
    
    if (!result.success || !result.data) {
      return result
    }
    
    // Rating alapján rendezés és limit
    const popular = [...result.data]
      .sort((a, b) => {
        const ratingB = b.rating || (b.ertekeles ? Number(b.ertekeles) : 0)
        const ratingA = a.rating || (a.ertekeles ? Number(a.ertekeles) : 0)
        return ratingB - ratingA
      })
      .slice(0, limit)
    
    return {
      success: true,
      data: popular
    }
  } catch (error) {
    console.error('Hiba a népszerű animék betöltése közben:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ismeretlen hiba',
      data: []
    }
  }
}

/**
 * Legújabb animék lekérése
 */
export async function getLatestAnimes(limit: number = 6): Promise<ApiResponse<Anime[]>> {
  try {
    const result = await getAllAnimes()
    
    if (!result.success || !result.data) {
      return result
    }
    
    // Feltöltés dátuma alapján rendezés
    const latest = [...result.data]
      .filter(anime => anime.feltoltesDatuma)
      .sort((a, b) => {
        const dateA = new Date(a.feltoltesDatuma!)
        const dateB = new Date(b.feltoltesDatuma!)
        return dateB.getTime() - dateA.getTime()
      })
      .slice(0, limit)
    
    return {
      success: true,
      data: latest
    }
  } catch (error) {
    console.error('Hiba a legújabb animék betöltése közben:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ismeretlen hiba',
      data: []
    }
  }
}
