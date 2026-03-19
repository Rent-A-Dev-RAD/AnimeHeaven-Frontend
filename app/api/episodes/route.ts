import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

/**
 * GET /api/episodes
 * Lekéri az epizódokat anime ID alapján (query paraméter)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const animeId = searchParams.get('anime_id')

    if (!animeId) {
      return NextResponse.json(
        { error: 'anime_id szükséges' },
        { status: 400 }
      )
    }

    const filePath = path.join(process.cwd(), 'app', 'data', 'animes.json')
    
    let fileContents: string
    try {
      fileContents = await fs.readFile(filePath, 'utf8')
    } catch (readError) {
      console.error('Fájl olvasási hiba:', readError)
      return NextResponse.json(
        { error: 'Az adatbázis fájl nem olvasható' },
        { status: 500 }
      )
    }

    let animes: any[]
    try {
      animes = JSON.parse(fileContents)
    } catch (parseError) {
      console.error('JSON parse hiba:', parseError)
      return NextResponse.json(
        { error: 'Az adatbázis formátuma hibás' },
        { status: 500 }
      )
    }

    const anime = animes.find((a: any) => a.id === parseInt(animeId))

    if (!anime) {
      return NextResponse.json({
        success: true,
        count: 0,
        data: []
      })
    }

    const episodes = anime.reszek || []

    return NextResponse.json({
      success: true,
      count: episodes.length,
      data: episodes
    })
  } catch (error) {
    console.error('Hiba az epizódok lekérése közben:', error)
    return NextResponse.json(
      { error: `Az epizódok betöltése sikertelen: ${error instanceof Error ? error.message : 'Ismeretlen hiba'}` },
      { status: 500 }
    )
  }
}

/**
 * POST /api/episodes
 * Új epizód létrehozása
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { anime_id, sorrend, resz, lathatosag, forras_elems } = body

    if (!anime_id) {
      return NextResponse.json(
        { error: 'anime_id szükséges' },
        { status: 400 }
      )
    }

    // Fájl útvonal - biztosan az abszolút útvonal
    const filePath = path.join(process.cwd(), 'app', 'data', 'animes.json')
    
    // Fájl olvasása
    let fileContents: string
    try {
      fileContents = await fs.readFile(filePath, 'utf8')
    } catch (readError) {
      console.error('Fájl olvasási hiba:', readError)
      return NextResponse.json(
        { error: 'Az adatbázis fájl nem olvasható' },
        { status: 500 }
      )
    }

    let animes: any[]
    try {
      animes = JSON.parse(fileContents)
    } catch (parseError) {
      console.error('JSON parse hiba:', parseError)
      return NextResponse.json(
        { error: 'Az adatbázis formátuma hibás' },
        { status: 500 }
      )
    }

    const animeIndex = animes.findIndex((a: any) => a.id === anime_id)

    if (animeIndex === -1) {
      return NextResponse.json(
        { error: `Anime nem található (ID: ${anime_id})` },
        { status: 404 }
      )
    }

    // Epizódok tömb inicializálása ha nem létezik
    if (!animes[animeIndex].reszek) {
      animes[animeIndex].reszek = []
    }

    // Új epizód ID generálása - biztosan egyedi
    let newId = 1
    if (animes[animeIndex].reszek.length > 0) {
      const maxId = Math.max(...animes[animeIndex].reszek.map((ep: any) => ep.id || 0))
      newId = maxId + 1
    }

    const newEpisode = {
      id: newId,
      anime_id,
      sorrend: sorrend || animes[animeIndex].reszek.length + 1,
      resz: resz || `Új epizód`,
      lathatosag: lathatosag ? 1 : 0,
      forras_elems: forras_elems || []
    }

    // Epizód hozzáadása
    animes[animeIndex].reszek.push(newEpisode)

    // **Fájl írása - különösen nagy gondossággal**
    try {
      const jsonData = JSON.stringify(animes, null, 2)
      await fs.writeFile(filePath, jsonData, 'utf8')
      
      // Verifikáció: az írás után olvassunk vissza
      const verifyContents = await fs.readFile(filePath, 'utf8')
      const verifyAnimes = JSON.parse(verifyContents)
      const verifyEpisode = verifyAnimes[animeIndex].reszek.find((ep: any) => ep.id === newId)
      
      if (!verifyEpisode) {
        console.error('Verifikáció sikertelen - az epizód nem talált a fájlban!')
        return NextResponse.json(
          { error: 'Az epizód nem sikerült menteni' },
          { status: 500 }
        )
      }
      
    } catch (writeError) {
      console.error('Fájl írási hiba:', writeError)
      return NextResponse.json(
        { error: `Az adatbázis nem írható: ${writeError instanceof Error ? writeError.message : 'Ismeretlen hiba'}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: newEpisode,
      message: 'Az epizód sikeresen létrehozva!'
    })
  } catch (error) {
    console.error('Hiba az epizód létrehozása közben:', error)
    return NextResponse.json(
      { error: `Az epizód létrehozása sikertelen: ${error instanceof Error ? error.message : 'Ismeretlen hiba'}` },
      { status: 500 }
    )
  }
}
