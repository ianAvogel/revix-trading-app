import { NextResponse } from 'next/server'
import { marketDataService } from '@/services/market-data-service'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbols = searchParams.getAll('symbols') || ['BTC', 'ETH', 'SOL']
    const timestampStr = searchParams.get('timestamp')

    // If replay timestamp is provided, fetch historical prices
    if (timestampStr) {
      const replayTimestamp = new Date(timestampStr)

      try {
        const historicalPrices = await prisma.historicalData.findMany({
          where: {
            timestamp: {
              lte: replayTimestamp,
            },
          },
          orderBy: {
            timestamp: 'desc',
          },
          distinct: ['symbol'],
        })

        const prices: Record<string, number> = {}
        historicalPrices.forEach(p => {
          prices[p.symbol] = Number(p.close)
        })

        return NextResponse.json({
          success: true,
          prices,
          mode: 'replay',
          timestamp: replayTimestamp.toISOString(),
        })
      } catch (error) {
        console.error('Error fetching historical prices:', error)
        // Fall through to live prices if historical fails
      }
    }

    // Fetch real-time prices
    if (symbols.length === 0) {
      return NextResponse.json({ error: 'No symbols provided' }, { status: 400 })
    }

    const prices = await marketDataService.getMultiplePrices(symbols)
    const pricesObj: Record<string, number> = {}

    prices.forEach(priceData => {
      pricesObj[priceData.symbol] = priceData.price
    })

    return NextResponse.json({
      success: true,
      prices: pricesObj,
      fullData: Array.from(prices.values()),
      mode: 'live',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error fetching prices:', error)
    return NextResponse.json(
      { error: 'Failed to fetch prices', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
