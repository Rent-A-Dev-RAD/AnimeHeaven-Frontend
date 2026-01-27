import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function PUT(request: NextRequest) {
  try {
    const updatedAnime = await request.json()
    
    // Read the current animes.json file
    const filePath = path.join(process.cwd(), 'app', 'data', 'animes.json')
    const fileContents = await fs.readFile(filePath, 'utf8')
    const animes = JSON.parse(fileContents)
    
    // Find and update the anime
    const animeIndex = animes.findIndex((anime: any) => anime.id === updatedAnime.id)
    
    if (animeIndex === -1) {
      return NextResponse.json(
        { error: 'Anime not found' },
        { status: 404 }
      )
    }
    
    animes[animeIndex] = updatedAnime
    
    // Write back to the file
    await fs.writeFile(filePath, JSON.stringify(animes, null, 2), 'utf8')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Anime successfully updated',
      anime: updatedAnime
    })
  } catch (error) {
    console.error('Error updating anime:', error)
    return NextResponse.json(
      { error: 'Failed to update anime' },
      { status: 500 }
    )
  }
}
