export const API_CONFIG = {
  // BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || '',
  
  // Egyelőre false, később true-ra állítod
  USE_REAL_API: process.env.NEXT_PUBLIC_USE_REAL_API === 'true' || false,
  
  ENDPOINTS: {
    ANIMES: '/animes',
    ANIME_BY_ID: '/animes/:id',
    SEARCH_ANIMES: '/animes/search',
    FILTER_ANIMES: '/animes/filter',
  },
  
  TIMEOUT: 10000,
  
  // Cache beállítások (Next.js App Router)
  CACHE: {
    REVALIDATE: 3600, // 1 óra (másodpercben)
    TAGS: {
      ANIMES: 'animes',
      ANIME: 'anime',
    }
  }
} as const

export function getApiUrl(endpoint: string, params?: Record<string, string | number>): string {
  let url = endpoint
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, String(value))
    })
  }
  
  return API_CONFIG.USE_REAL_API 
    ? `${API_CONFIG.BASE_URL}${url}` 
    : url
}
