import { NextResponse } from 'next/server'
import { marketDataService } from '@/services/market-data-service'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol') || 'BTC'
    const interval = (searchParams.get('interval') as '1m' | '5m' | '15m' | '1h' | '4h' | '1d') || '1h'
    const limit = parseInt(searchParams.get('limit') || '100')

    if (!symbol) {
      return NextResponse.json({ error: 'Symbol is required' }, { status: 400 })
    }

    const candles = await marketDataService.getHistoricalCandles(symbol, interval, limit)

    return NextResponse.json({
      success: true,
      symbol,
      interval,
      candles,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error fetching candles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch candles', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
