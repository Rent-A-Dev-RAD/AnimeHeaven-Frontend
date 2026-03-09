import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
    
    // Közvetlenül a cimke_lista táblából kérjük le a kategóriákat
    // Ehhez szükség lenne egy backend endpoint-ra: GET /api/cimkek vagy /api/categories
    
    // Alternatíva: Ha van ilyen endpoint a backenden
    try {
      const categoriesResponse = await fetch(`${backendUrl}/cimkek`)
      if (categoriesResponse.ok) {
        const result = await categoriesResponse.json()
        return NextResponse.json(result)
      }
    } catch (err) {
      console.log('No /api/cimkek endpoint available, trying alternative...')
    }
    
    // Ha nincs dedikált endpoint, hardcoded kategóriák az adatbázis alapján
    const hardcodedCategories = [
      { id: 1, nev: 'Action', count: 2 },
      { id: 2, nev: 'Adventure', count: 0 },
      { id: 3, nev: 'Avant Garde', count: 0 },
      { id: 7, nev: 'Drama', count: 0 },
      { id: 8, nev: 'Ecchi', count: 0 },
      { id: 9, nev: 'Erotica', count: 0 },
      { id: 10, nev: 'Fantasy', count: 2 },
      { id: 17, nev: 'Romance', count: 3 },
      { id: 22, nev: 'Slice of Life', count: 2 },
      { id: 21, nev: 'Shounen', count: 1 },
      { id: 23, nev: 'Supernatural', count: 2 },
      { id: 24, nev: 'Thriller', count: 1 },
    ]
    
    return NextResponse.json({
      success: true,
      count: hardcodedCategories.length,
      data: hardcodedCategories
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to load categories',
        data: []
      },
      { status: 500 }
    )
  }
}
