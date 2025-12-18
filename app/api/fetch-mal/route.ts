import { NextResponse } from "next/server"

// Helper function to translate seasons
function translateSeason(season: string): string {
  const seasonMap: Record<string, string> = {
    'fall': 'Ősz',
    'summer': 'Nyár',
    'winter': 'Tél',
    'spring': 'Tavasz'
  }
  return seasonMap[season.toLowerCase()] || season
}

// Helper function to translate status
function translateStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'Currently Airing': 'Fut',
    'Finished Airing': 'Befejezett',
    'Not yet aired': 'Hamarosan',
    'On Hiatus': 'Felfüggesztett'
  }
  return statusMap[status] || status
}

// Helper function to translate type
function translateType(type: string): string {
  if (type === 'Movie') {
    return 'Film'
  }
  return type
}

// Helper function to extract rating prefix
function extractRatingPrefix(rating: string): string {
  // Handle special cases
  if (rating.includes('R - 17+')) {
    return 'R-17+'
  }
  if (rating.startsWith('R+')) {
    return 'R+'
  }
  // Extract only the first part before the dash (e.g., "PG-13 - Teens 13 or older" -> "PG-13")
  const match = rating.match(/^([^-]+)/)
  return match ? match[1].trim() : rating
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url || !url.includes("myanimelist.net/anime/")) {
      return NextResponse.json({ error: "Érvénytelen MyAnimeList URL" }, { status: 400 })
    }

    // Extract MAL ID from URL
    const malIdMatch = url.match(/\/anime\/(\d+)/)
    if (!malIdMatch) {
      return NextResponse.json({ error: "Nem sikerült kinyerni a MAL ID-t az URL-ből" }, { status: 400 })
    }

    const malId = malIdMatch[1]
    
    // Use Jikan API instead of scraping
    const jikanUrl = `https://api.jikan.moe/v4/anime/${malId}`
    const response = await fetch(jikanUrl)

    if (!response.ok) {
      throw new Error("Nem sikerült lekérni az adatokat a Jikan API-ból")
    }

    const jikanData = await response.json()
    const data = jikanData.data

    // Format season (e.g., "fall 2023" -> "2023 Ősz")
    let seasonText = ""
    if (data.season && data.year) {
      const translatedSeason = translateSeason(data.season)
      seasonText = `${data.year} ${translatedSeason}`
    }

    // Extract studio name
    const studio = data.studios && data.studios.length > 0 ? data.studios[0].name : ""

    // Extract genres
    const genres = data.genres && data.genres.length > 0 
      ? data.genres.map((g: any) => g.name).join(", ")
      : ""

    // Get image URL (prefer webp large, fallback to jpg large)
    const imageUrl = data.images?.webp?.large_image_url || data.images?.jpg?.large_image_url || ""

    // Get trailer URL and change autoplay to 0
    let trailerUrl = ""
    if (data.trailer?.embed_url) {
      trailerUrl = data.trailer.embed_url.replace(/autoplay=1/, "autoplay=0")
    }

    // Extract rating prefix (e.g., "PG-13 - Teens 13 or older" -> "PG-13")
    const rating = data.rating ? extractRatingPrefix(data.rating) : ""

    // Translate status to Hungarian
    const status = data.status ? translateStatus(data.status) : ""

    // Translate type (Movie -> Film)
    const type = data.type ? translateType(data.type) : ""

    // Extract Japanese title from titles array (Default type)
    let japaneseTitle = ""
    if (data.titles && data.titles.length > 0) {
      const defaultTitle = data.titles.find((t: any) => t.type === "Default")
      japaneseTitle = defaultTitle ? defaultTitle.title : (data.title || "")
    } else {
      japaneseTitle = data.title || ""
    }

    const animeData = {
      japaneseTitle: japaneseTitle,
      englishTitle: data.title_english || data.title || "",
      synopsis: "", // Manually filled
      episodes: data.episodes?.toString() || "",
      status: status,
      season: seasonText,
      studio: studio,
      genres: genres,
      score: data.score?.toString() || "",
      imageUrl: imageUrl,
      trailerUrl: trailerUrl,
      type: type,
      rating: rating,
      backgroundUrl: "", // Not from API
      translator: "" // Not from API
    }

    return NextResponse.json(animeData)
  } catch (error) {
    console.error("MAL fetch error:", error)
    return NextResponse.json({ error: "Hiba történt az adatok lekérése közben" }, { status: 500 })
  }
}
