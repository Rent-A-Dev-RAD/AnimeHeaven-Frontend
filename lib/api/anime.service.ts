import type { Anime, ApiResponse, PaginatedResponse, AnimeFilters, Episode, EpisodesApiResponse } from '@/lib/types/anime'
import { API_CONFIG, getApiUrl } from '@/lib/config/api.config'
import animesData from '@/app/data/animes.json'
import episodesData from '@/app/data/episodes.json'

const mockAnimes: Anime[] = animesData as unknown as Anime[]
const mockEpisodes: Episode[] = episodesData as unknown as Episode[]

export async function getAllAnimes(): Promise<ApiResponse<Anime[]>> {
  try {
    if (API_CONFIG.USE_REAL_API) {
      const apiUrl = getApiUrl(API_CONFIG.ENDPOINTS.ANIMES)
      
      try {
        const response = await fetch(apiUrl, {
          cache: 'no-store', // Disable cache to get fresh data
          next: { revalidate: 0 }
        })
        
        if (!response.ok) {
          console.error('Backend response not OK:', response.status)
          throw new Error('Nem sikerült betölteni az animéket')
        }
        
        const result = await response.json()
        // Backend már {success: true, data: [...]} formátumban válaszol
        return result
      } catch (fetchError) {
        // Ha a backend nem elérhető, fallback mock adatokra
        console.warn('Backend nem elérhető, mock adatok használata:', fetchError)
        return {
          success: true,
          data: mockAnimes
        }
      }
    } else {
      // Mock adatok használata
      return {
        success: true,
        data: mockAnimes
      }
    }
  } catch (error) {
    console.error('Hiba az animék betöltése közben:', error)
    // Fallback mock adatokra hiba esetén is
    return {
      success: true,
      data: mockAnimes
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

/**
 * Epizódok lekérése anime ID alapján
 */
export async function getEpisodesByAnimeId(animeId: number): Promise<EpisodesApiResponse> {
  try {
    if (API_CONFIG.USE_REAL_API) {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.EPISODES_BY_ANIME, { animeId }), 
        {
          next: { 
            revalidate: API_CONFIG.CACHE.REVALIDATE,
            tags: [API_CONFIG.CACHE.TAGS.ANIME, `episodes-${animeId}`] 
          }
        }
      )
      
      if (!response.ok) {
        throw new Error('Az epizódok nem tölthetők be')
      }
      
      const result = await response.json()
      return result
    } else {
      // Mock adatok használata (fallback)
      return {
        success: true,
        count: mockEpisodes.length,
        data: mockEpisodes
      }
    }
  } catch (error) {
    console.error(`Hiba az epizódok betöltése közben (Anime ID: ${animeId}):`, error)
    return {
      success: false,
      count: 0,
      data: [],
      error: error instanceof Error ? error.message : 'Ismeretlen hiba'
    }
  }
}

/**
 * Anime törlése (admin funkció)
 */
export async function deleteAnime(id: number): Promise<ApiResponse<void>> {
  try {
    if (API_CONFIG.USE_REAL_API) {
      const response = await fetch(
        `${getApiUrl(API_CONFIG.ENDPOINTS.ANIMES)}/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Nem sikerült törölni az animét')
      }
      
      const result = await response.json()
      return {
        success: true,
        message: result.message || 'Az animé sikeresen törölve!'
      }
    } else {
      // Mock törlés - csak szimuláció
      return {
        success: true,
        message: 'Mock: Az animé törölve (nincs backend kapcsolat)'
      }
    }
  } catch (error) {
    console.error(`Hiba az anime törlése közben (ID: ${id}):`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ismeretlen hiba történt a törlés során'
    }
  }
}

/**
 * Epizód létrehozása (admin funkció)
 */
export async function createEpisode(animeId: number, episodeData: any): Promise<ApiResponse<any>> {
  try {
    if (API_CONFIG.USE_REAL_API) {
      // Bővített payload az animeId-vel
      const payload = { ...episodeData, anime_id: animeId }
      
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.CREATE_EPISODE),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        }
      )
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Nem sikerült létrehozni az epizódot')
      }
      
      const result = await response.json()
      return {
        success: true,
        data: result.data,
        message: result.message || 'Az epizód sikeresen létrehozva!'
      }
    } else {
      // Mock létrehozás
      return {
        success: true,
        data: { ...episodeData, id: Date.now(), anime_id: animeId },
        message: 'Mock: Az epizód létrehozva (nincs backend kapcsolat)'
      }
    }
  } catch (error) {
    console.error(`Hiba az epizód létrehozása közben:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ismeretlen hiba történt a létrehozás során'
    }
  }
}

/**
 * Epizód frissítése (admin funkció)
 */
export async function updateEpisode(episodeId: number, episodeData: any): Promise<ApiResponse<any>> {
  try {
    if (API_CONFIG.USE_REAL_API) {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.EPISODE_BY_ID, { id: episodeId }),
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(episodeData)
        }
      )
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Nem sikerült frissíteni az epizódot')
      }
      
      const result = await response.json()
      return {
        success: true,
        data: result.data,
        message: result.message || 'Az epizód sikeresen frissítve!'
      }
    } else {
      // Mock frissítés
      return {
        success: true,
        data: { ...episodeData, id: episodeId },
        message: 'Mock: Az epizód frissítve (nincs backend kapcsolat)'
      }
    }
  } catch (error) {
    console.error(`Hiba az epizód frissítése közben (ID: ${episodeId}):`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ismeretlen hiba történt a frissítés során'
    }
  }
}

/**
 * Anime frissítése (admin funkció)
 */
export async function updateAnime(id: number, animeData: Partial<Anime>): Promise<ApiResponse<Anime>> {
  try {
    if (API_CONFIG.USE_REAL_API) {
      const response = await fetch(
        `${getApiUrl(API_CONFIG.ENDPOINTS.ANIMES)}/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(animeData)
        }
      )
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Nem sikerült frissíteni az animét')
      }
      
      const result = await response.json()
      return {
        success: true,
        data: result.data,
        message: result.message || 'Az animé sikeresen frissítve!'
      }
    } else {
      // Mock frissítés - csak szimuláció
      return {
        success: true,
        data: { ...animeData, id } as Anime,
        message: 'Mock: Az animé frissítve (nincs backend kapcsolat)'
      }
    }
  } catch (error) {
    console.error(`Hiba az anime frissítése közben (ID: ${id}):`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ismeretlen hiba történt a frissítés során'
    }
  }
}
