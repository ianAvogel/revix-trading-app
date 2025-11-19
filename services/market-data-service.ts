/**
 * Market Data Service
 * Fetches real-time cryptocurrency prices and historical candle data
 * Uses CoinGecko API (free tier, no auth required) for real-time prices
 * Uses Binance API for historical candles
 */

import { Decimal } from '@prisma/client/runtime/library'

export interface PriceData {
  symbol: string
  price: number
  change24h: number
  change7d: number
  marketCap?: number
  volume24h?: number
  timestamp: Date
}

export interface Candle {
  timestamp: Date
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface MarketStats {
  totalMarketCap: number
  totalVolume24h: number
  btcDominance: number
  timestamp: Date
}

// Cache for real-time prices (in-memory for MVP, can be Redis later)
const priceCache = new Map<string, { data: PriceData; timestamp: number }>()
const CACHE_TTL = 60000 // 60 seconds

class MarketDataService {
  /**
   * Get real-time price for a single symbol
   * Uses CoinGecko API
   */
  async getRealtimePrice(symbol: string): Promise<PriceData> {
    const cached = priceCache.get(symbol)
    const now = Date.now()

    // Return cached data if still fresh
    if (cached && now - cached.timestamp < CACHE_TTL) {
      return cached.data
    }

    try {
      const coingeckoId = this.symbolToCoingeckoId(symbol)
      const url = new URL('https://api.coingecko.com/api/v3/simple/price')
      url.searchParams.append('ids', coingeckoId)
      url.searchParams.append('vs_currencies', 'usd')
      url.searchParams.append('include_market_cap', 'true')
      url.searchParams.append('include_24hr_vol', 'true')
      url.searchParams.append('include_24hr_change', 'true')

      const response = await fetch(url.toString())
      if (!response.ok) throw new Error(`CoinGecko API error: ${response.status}`)

      const data = await response.json()
      const coinData = data[coingeckoId]

      if (!coinData) throw new Error(`No data for ${symbol}`)

      const priceData: PriceData = {
        symbol,
        price: coinData.usd,
        change24h: coinData.usd_24h_change || 0,
        change7d: 0, // CoinGecko free tier doesn't provide 7d change
        marketCap: coinData.usd_market_cap,
        volume24h: coinData.usd_24h_vol,
        timestamp: new Date(),
      }

      // Cache the result
      priceCache.set(symbol, { data: priceData, timestamp: now })
      return priceData
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error)
      // Return cached data even if stale
      const cached = priceCache.get(symbol)
      if (cached) return cached.data
      // Fallback: return mock data for development
      return this.getMockPrice(symbol)
    }
  }

  /**
   * Get real-time prices for multiple symbols
   */
  async getMultiplePrices(symbols: string[]): Promise<Map<string, PriceData>> {
    const results = new Map<string, PriceData>()

    try {
      // Deduplicate symbols
      const uniqueSymbols = [...new Set(symbols)]

      // Fetch in batches (CoinGecko limit is ~250 IDs per request)
      const batchSize = 250
      for (let i = 0; i < uniqueSymbols.length; i += batchSize) {
        const batch = uniqueSymbols.slice(i, i + batchSize)
        const ids = batch.map(s => this.symbolToCoingeckoId(s)).join(',')

        const url = new URL('https://api.coingecko.com/api/v3/simple/price')
        url.searchParams.append('ids', ids)
        url.searchParams.append('vs_currencies', 'usd')
        url.searchParams.append('include_market_cap', 'true')
        url.searchParams.append('include_24hr_vol', 'true')
        url.searchParams.append('include_24hr_change', 'true')

        const response = await fetch(url.toString())
        if (!response.ok) throw new Error(`CoinGecko API error: ${response.status}`)

        const data = await response.json()

        batch.forEach(symbol => {
          const coingeckoId = this.symbolToCoingeckoId(symbol)
          const coinData = data[coingeckoId]

          if (coinData) {
            const priceData: PriceData = {
              symbol,
              price: coinData.usd,
              change24h: coinData.usd_24h_change || 0,
              change7d: 0,
              marketCap: coinData.usd_market_cap,
              volume24h: coinData.usd_24h_vol,
              timestamp: new Date(),
            }
            results.set(symbol, priceData)
            priceCache.set(symbol, { data: priceData, timestamp: Date.now() })
          }
        })
      }
    } catch (error) {
      console.error('Error fetching multiple prices:', error)
    }

    // Fill in cached or mock data for any symbols we couldn't fetch
    symbols.forEach(symbol => {
      if (!results.has(symbol)) {
        const cached = priceCache.get(symbol)
        if (cached) {
          results.set(symbol, cached.data)
        } else {
          results.set(symbol, this.getMockPrice(symbol))
        }
      }
    })

    return results
  }

  /**
   * Get historical candle data from Binance
   * @param symbol - e.g., "BTC"
   * @param interval - e.g., "1h", "1d"
   * @param limit - number of candles (max 1000)
   */
  async getHistoricalCandles(
    symbol: string,
    interval: '1m' | '5m' | '15m' | '1h' | '4h' | '1d' = '1h',
    limit: number = 100
  ): Promise<Candle[]> {
    try {
      // Binance expects USDT pairs
      const pair = `${symbol}USDT`
      const url = new URL('https://api.binance.com/api/v3/klines')
      url.searchParams.append('symbol', pair)
      url.searchParams.append('interval', interval)
      url.searchParams.append('limit', Math.min(limit, 1000).toString())

      const response = await fetch(url.toString())
      if (!response.ok) throw new Error(`Binance API error: ${response.status}`)

      const data = await response.json()

      return data.map((candle: any[]) => ({
        timestamp: new Date(candle[0]),
        open: Number(candle[1]),
        high: Number(candle[2]),
        low: Number(candle[3]),
        close: Number(candle[4]),
        volume: Number(candle[7]),
      }))
    } catch (error) {
      console.error(`Error fetching candles for ${symbol}:`, error)
      // Return mock candles for development
      return this.getMockCandles(limit)
    }
  }

  /**
   * Get overall market statistics
   */
  async getMarketStats(): Promise<MarketStats> {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/global')
      if (!response.ok) throw new Error(`CoinGecko API error: ${response.status}`)

      const data = await response.json()

      return {
        totalMarketCap: data.total_market_cap.usd || 0,
        totalVolume24h: data.total_volume.usd || 0,
        btcDominance: data.btc_market_cap_percentage || 0,
        timestamp: new Date(),
      }
    } catch (error) {
      console.error('Error fetching market stats:', error)
      return {
        totalMarketCap: 0,
        totalVolume24h: 0,
        btcDominance: 0,
        timestamp: new Date(),
      }
    }
  }

  /**
   * Convert symbol to CoinGecko ID
   */
  private symbolToCoingeckoId(symbol: string): string {
    const mapping: Record<string, string> = {
      BTC: 'bitcoin',
      ETH: 'ethereum',
      SOL: 'solana',
      XRP: 'ripple',
      ADA: 'cardano',
      DOGE: 'dogecoin',
      LINK: 'chainlink',
      USDC: 'usd-coin',
      USDT: 'tether',
      MATIC: 'matic-network',
    }
    return mapping[symbol.toUpperCase()] || symbol.toLowerCase()
  }

  /**
   * Mock price data for development/fallback
   */
  private getMockPrice(symbol: string): PriceData {
    const mockPrices: Record<string, number> = {
      BTC: 42500,
      ETH: 2300,
      SOL: 95,
    }

    const basePrice = mockPrices[symbol] || 100
    const variance = basePrice * 0.02 * (Math.random() - 0.5)

    return {
      symbol,
      price: basePrice + variance,
      change24h: (Math.random() - 0.5) * 10,
      change7d: (Math.random() - 0.5) * 20,
      marketCap: basePrice * 1000000,
      volume24h: basePrice * 100000,
      timestamp: new Date(),
    }
  }

  /**
   * Mock candle data for development/fallback
   */
  private getMockCandles(count: number): Candle[] {
    const candles: Candle[] = []
    let price = 42500

    for (let i = count - 1; i >= 0; i--) {
      const change = (Math.random() - 0.5) * 1000
      const open = price
      const close = price + change
      const high = Math.max(open, close) + Math.random() * 500
      const low = Math.min(open, close) - Math.random() * 500

      candles.push({
        timestamp: new Date(Date.now() - i * 3600000), // 1 hour intervals
        open,
        high,
        low,
        close,
        volume: Math.random() * 1000000,
      })

      price = close
    }

    return candles
  }
}

// Export singleton instance
export const marketDataService = new MarketDataService()
