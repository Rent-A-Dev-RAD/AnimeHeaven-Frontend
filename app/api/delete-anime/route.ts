import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const idParam = searchParams.get('id')
    
    if (!idParam) {
      return NextResponse.json(
        { error: 'Anime ID is required' },
        { status: 400 }
      )
    }
    
    const id = parseInt(idParam)
    
    // Read the current animes.json file
    const filePath = path.join(process.cwd(), 'app', 'data', 'animes.json')
    const fileContents = await fs.readFile(filePath, 'utf8')
    const animes = JSON.parse(fileContents)
    
    // Find the anime to delete
    const animeIndex = animes.findIndex((anime: any) => anime.id === id)
    
    if (animeIndex === -1) {
      return NextResponse.json(
        { error: 'Anime not found' },
        { status: 404 }
      )
    }
    
    // Remove the anime
    const deletedAnime = animes.splice(animeIndex, 1)[0]
    
    // Write back to the file
    await fs.writeFile(filePath, JSON.stringify(animes, null, 2), 'utf8')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Anime successfully deleted',
      deletedAnime
    })
  } catch (error) {
    console.error('Error deleting anime:', error)
    return NextResponse.json(
      { error: 'Failed to delete anime' },
      { status: 500 }
    )
  }
}
