import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

/**
 * GET /api/episodes/:id
 * Lekéri az adott epizódot
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const episodeId = parseInt(resolvedParams.id)

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

    for (const anime of animes) {
      const episode = anime.reszek?.find((ep: any) => ep.id === episodeId)
      if (episode) {
        return NextResponse.json({
          success: true,
          data: episode
        })
      }
    }

    return NextResponse.json(
      { error: `Epizód nem található (ID: ${episodeId})` },
      { status: 404 }
    )
  } catch (error) {
    console.error('Hiba az epizód lekérése közben:', error)
    return NextResponse.json(
      { error: `Az epizód betöltése sikertelen: ${error instanceof Error ? error.message : 'Ismeretlen hiba'}` },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/episodes/:id
 * Frissíti az adott epizódot
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const episodeId = parseInt(resolvedParams.id)
    const body = await request.json()

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

    let episodeFound = false
    let foundAnimeIndex = -1

    for (let i = 0; i < animes.length; i++) {
      const episodeIndex = animes[i].reszek?.findIndex((ep: any) => ep.id === episodeId)
      if (episodeIndex !== undefined && episodeIndex !== -1) {
        // Meglévő adatok megtartása, csak a módosított mezőket frissítjük
        animes[i].reszek[episodeIndex] = {
          ...animes[i].reszek[episodeIndex],
          ...body,
          id: episodeId // ID nem módosulhat
        }
        episodeFound = true
        foundAnimeIndex = i
        break
      }
    }

    if (!episodeFound) {
      return NextResponse.json(
        { error: `Epizód nem található (ID: ${episodeId})` },
        { status: 404 }
      )
    }

    // Fájl írása
    try {
      const jsonData = JSON.stringify(animes, null, 2)
      await fs.writeFile(filePath, jsonData, 'utf8')
      
      // Verifikáció: az írás után olvassunk vissza
      const verifyContents = await fs.readFile(filePath, 'utf8')
      const verifyAnimes = JSON.parse(verifyContents)
      const verifyEpisode = verifyAnimes[foundAnimeIndex].reszek.find((ep: any) => ep.id === episodeId)
      
      if (!verifyEpisode) {
        console.error('Verifikáció sikertelen - az epizód módosítása nem talált a fájlban!')
        return NextResponse.json(
          { error: 'Az epizód módosítása nem sikerült menteni' },
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
      data: body,
      message: 'Az epizód sikeresen frissítve!'
    })
  } catch (error) {
    console.error('Hiba az epizód frissítése közben:', error)
    return NextResponse.json(
      { error: `Az epizód frissítése sikertelen: ${error instanceof Error ? error.message : 'Ismeretlen hiba'}` },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/episodes/:id
 * Törli az adott epizódot
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const episodeId = parseInt(resolvedParams.id)

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

    let episodeFound = false
    let foundAnimeIndex = -1

    for (let i = 0; i < animes.length; i++) {
      const episodeIndex = animes[i].reszek?.findIndex((ep: any) => ep.id === episodeId)
      if (episodeIndex !== undefined && episodeIndex !== -1) {
        animes[i].reszek.splice(episodeIndex, 1)
        episodeFound = true
        foundAnimeIndex = i
        break
      }
    }

    if (!episodeFound) {
      return NextResponse.json(
        { error: `Epizód nem található (ID: ${episodeId})` },
        { status: 404 }
      )
    }

    // Fájl írása
    try {
      const jsonData = JSON.stringify(animes, null, 2)
      await fs.writeFile(filePath, jsonData, 'utf8')
      
      // Verifikáció: az írás után olvassunk vissza
      const verifyContents = await fs.readFile(filePath, 'utf8')
      const verifyAnimes = JSON.parse(verifyContents)
      const verifyEpisode = verifyAnimes[foundAnimeIndex].reszek.find((ep: any) => ep.id === episodeId)
      
      if (verifyEpisode) {
        console.error('Verifikáció sikertelen - az epizód még mindig a fájlban van!')
        return NextResponse.json(
          { error: 'Az epizód törlése nem sikerült menteni' },
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
      message: 'Az epizód sikeresen törölve!'
    })
  } catch (error) {
    console.error('Hiba az epizód törlése közben:', error)
    return NextResponse.json(
      { error: `Az epizód törlése sikertelen: ${error instanceof Error ? error.message : 'Ismeretlen hiba'}` },
      { status: 500 }
    )
  }
}
