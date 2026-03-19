import type { Episode, ApiResponse, EpisodesApiResponse } from '@/lib/types/anime'
import { API_CONFIG, getApiUrl } from '@/lib/config/api.config'

/**
 * Epizód lekérése ID alapján
 */
export async function getEpisodeById(episodeId: number): Promise<ApiResponse<Episode>> {
  try {
    const url = API_CONFIG.USE_REAL_API 
      ? getApiUrl(API_CONFIG.ENDPOINTS.EPISODE_BY_ID, { id: episodeId })
      : `/api/episodes/${episodeId}`;

    const response = await fetch(
      url,
      {
        next: { 
          revalidate: 0,
          tags: [`episode-${episodeId}`] 
        }
      }
    )
    
    if (!response.ok) {
      throw new Error('Az epizód nem található')
    }
    
    const result = await response.json()
    return result
  } catch (error) {
    console.error(`Hiba az epizód lekérése közben (ID: ${episodeId}):`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ismeretlen hiba'
    }
  }
}

/**
 * Epizód létrehozása (admin funkció)
 */
export async function createEpisode(animeId: number, episodeData: {
  sorrend: number
  resz: string
  lathatosag: boolean | number
  forrasok?: any[]
  inda?: string
  videa?: string
}): Promise<ApiResponse<Episode>> {
  try {
    // Bővített payload az animeId-vel, megbizonyosodunk róla, hogy bekerül a payloadba
    const payload = { 
      ...episodeData, 
      anime_id: animeId,
      lathatosag: episodeData.lathatosag === 1 || episodeData.lathatosag === true
    }
    
    const url = API_CONFIG.USE_REAL_API 
      ? `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CREATE_EPISODE}`
      : '/api/episodes';

    const response = await fetch(
      url,
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
      console.error('Backend hiba részletei (POST):', errorData)
      const errorMsg = errorData.message || errorData.error || 
                       (errorData.errors ? JSON.stringify(errorData.errors) : 'Nem sikerült létrehozzni az epizódot');
      throw new Error(errorMsg)
    }
    
    const result = await response.json()
    return {
      success: true,
      data: result.data || result, // A backend válaszától függően
      message: result.message || 'Az epizód sikeresen létrehozva!'
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
export async function updateEpisode(episodeId: number, episodeData: {
  anime_id?: number
  sorrend?: number
  resz?: string
  lathatosag?: boolean | number
  forrasok?: any[]
  inda?: string
  videa?: string
}): Promise<ApiResponse<Episode>> {
  try {
    const url = API_CONFIG.USE_REAL_API 
      ? getApiUrl(API_CONFIG.ENDPOINTS.EPISODE_BY_ID, { id: episodeId })
      : `/api/episodes/${episodeId}`;

    // Fix payload lathatosag cast
    const payload = {
      ...episodeData,
      lathatosag: episodeData.lathatosag === 1 || episodeData.lathatosag === true
    }

    const response = await fetch(
      url,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      }
    )
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Backend hiba részletei (PUT):', errorData)
            
      const errorMsg = errorData.message || errorData.error || 
                       (errorData.errors ? JSON.stringify(errorData.errors) : 'Nem sikerült frissíteni az epizódot');
      throw new Error(errorMsg)
    }
    
    const result = await response.json()
    return {
      success: true,
      data: result.data || episodeData as any,
      message: result.message || 'Az epizód sikeresen frissítve!'
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
 * Epizód törlése (admin funkció)
 */
export async function deleteEpisode(episodeId: number): Promise<ApiResponse<void>> {
  try {
    const url = API_CONFIG.USE_REAL_API 
      ? getApiUrl(API_CONFIG.ENDPOINTS.EPISODE_BY_ID, { id: episodeId })
      : `/api/episodes/${episodeId}`;

    const response = await fetch(
      url,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Nem sikerült törölni az epizódot')
    }
    
    const result = await response.json()
    return {
      success: true,
      message: result.message || 'Az epizód sikeresen törölve!'
    }
  } catch (error) {
    console.error(`Hiba az epizód törlése közben (ID: ${episodeId}):`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ismeretlen hiba történt a törlés során'
    }
  }
}

/**
 * Több epizód törlése egyszerre (admin funkció)
 */
export async function deleteEpisodes(episodeIds: number[]): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(
      '/api/episodes/batch',
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: episodeIds })
      }
    )
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Nem sikerült törölni az epizódokat')
    }
    
    const result = await response.json()
    return {
      success: true,
      message: result.message || 'Az epizódok sikeresen törölve!'
    }
  } catch (error) {
    console.error(`Hiba az epizódok törlése közben:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ismeretlen hiba történt a törlés során'
    }
  }
}

/**
 * Epizódok rendezésének frissítése (sorrend módosítása)
 */
export async function reorderEpisodes(animeId: number, episodes: Array<{id: number, sorrend: number}>): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(
      `/api/animes/${animeId}/episodes/reorder`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ episodes })
      }
    )
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Nem sikerült átrendezni az epizódokat')
    }
    
    const result = await response.json()
    return {
      success: true,
      message: result.message || 'Az epizódok sorrendje sikeresen frissítve!'
    }
  } catch (error) {
    console.error(`Hiba az epizódok rendezése közben:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ismeretlen hiba történt a rendezés során'
    }
  }
}
