import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url || !url.includes("myanimelist.net/anime/")) {
      return NextResponse.json({ error: "Érvénytelen MyAnimeList URL" }, { status: 400 })
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })

    if (!response.ok) {
      throw new Error("Nem sikerült letölteni az oldalt")
    }

    const html = await response.text()

    const animeData = {
      title: extractData(html, /<h1[^>]*class="title-name[^>]*>([^<]+)<\/h1>/),
      englishTitle:
        extractData(html, /<p[^>]*class="title-english[^>]*>([^<]+)<\/p>/) ||
        extractData(html, /<h1[^>]*class="title-name[^>]*>([^<]+)<\/h1>/),
      japaneseTitle: extractData(html, /<p[^>]*class="title-japanese[^>]*>([^<]+)<\/p>/),
      synopsis:
        extractData(html, /<p[^>]*itemprop="description"[^>]*>([^<]+)<\/p>/) ||
        extractData(html, /"description":"([^"]+)"/),
      episodes: extractData(html, /Episodes:<\/span>\s*<[^>]*>([^<]+)</),
      status: extractData(html, /Status:<\/span>\s*<[^>]*>([^<]+)</),
      aired: extractData(html, /Aired:<\/span>\s*([^<]+)</),
      season: extractData(html, /Premiered:<\/span>\s*<a[^>]*>([^<]+)</) || extractData(html, /"startDate":"([^"]+)"/),
      studio: extractData(html, /Studios:<\/span>[\s\S]*?<a[^>]*>([^<]+)<\/a>/),
      genres: extractGenres(html),
      rating: extractData(html, /"ratingValue":"([^"]+)"/) || extractData(html, /Score:<\/span>\s*<span[^>]*>([^<]+)</),
      imageUrl:
        extractData(html, /"image":"([^"]+)"/) ||
        extractData(html, /<img[^>]*data-src="([^"]+)"[^>]*alt="[^"]*"[^>]*>/),
      trailerUrl: extractData(html, /youtube\.com\/embed\/([^?"]+)/, "https://youtube.com/watch?v="),
    }

    Object.keys(animeData).forEach((key) => {
      if (typeof animeData[key as keyof typeof animeData] === "string") {
        animeData[key as keyof typeof animeData] = animeData[key as keyof typeof animeData]
          .replace(/&quot;/g, '"')
          .replace(/&#039;/g, "'")
          .replace(/&amp;/g, "&")
          .replace(/\\/g, "")
          .trim()
      }
    })

    return NextResponse.json(animeData)
  } catch (error) {
    console.error("MAL fetch error:", error)
    return NextResponse.json({ error: "Hiba történt az adatok lekérése közben" }, { status: 500 })
  }
}

function extractData(html: string, regex: RegExp, prefix = ""): string {
  const match = html.match(regex)
  return match ? prefix + match[1].trim() : ""
}

function extractGenres(html: string): string {
  const genreMatches = html.match(/Genres:<\/span>[\s\S]*?<div[^>]*>([\s\S]*?)<\/div>/)
  if (!genreMatches) return ""

  const genreLinks = genreMatches[1].match(/<a[^>]*>([^<]+)<\/a>/g) || []
  return genreLinks.map((link) => link.replace(/<[^>]*>/g, "").trim()).join(", ")
}
