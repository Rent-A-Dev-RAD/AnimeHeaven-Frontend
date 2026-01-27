import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'app', 'data', 'animes.json')
    const fileContents = await fs.readFile(filePath, 'utf8')
    const animes = JSON.parse(fileContents)
    
    return NextResponse.json(animes)
  } catch (error) {
    console.error('Error reading animes:', error)
    return NextResponse.json(
      { error: 'Failed to load animes' },
      { status: 500 }
    )
  }
}
