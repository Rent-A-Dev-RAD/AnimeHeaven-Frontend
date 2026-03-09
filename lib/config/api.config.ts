// Runtime environment check
const getBaseUrl = () => {
  // Server-side rendering esetén
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
  }
  // Client-side esetén
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
}

const getUseRealApi = () => {
  return process.env.NEXT_PUBLIC_USE_REAL_API === 'true'
}

export const API_CONFIG = {
  get BASE_URL() {
    return getBaseUrl()
  },
  
  get USE_REAL_API() {
    return getUseRealApi()
  },
    ENDPOINTS: {
    ANIMES: '/animes',
    ANIME_BY_ID: '/animes/:id',
    SEARCH_ANIMES: '/animes/search',
    FILTER_ANIMES: '/animes/filter',
    EPISODES_BY_ANIME: '/episodes/anime/:animeId',
    
    // Auth endpoints
    AUTH_REGISTER: '/auth/register',
    AUTH_LOGIN: '/auth/login',
    AUTH_ME: '/auth/me',
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
