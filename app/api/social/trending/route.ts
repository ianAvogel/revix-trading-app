import { NextResponse } from 'next/server'
import { SocialService } from '@/services/social-service'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    const traders = await SocialService.getTrendingTraders(limit)

    return NextResponse.json({
      success: true,
      data: traders,
    })
  } catch (error) {
    console.error('Error fetching trending traders:', error)
    return NextResponse.json({ error: 'Failed to fetch trending traders' }, { status: 500 })
  }
}
