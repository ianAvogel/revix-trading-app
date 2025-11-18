import axios from "axios"
import { prisma } from "@/lib/prisma"

export interface CryptoPrice {
  symbol: string
  price: number
  change24h: number
  change7d: number
  volume: number
  marketCap: number
  high24h: number
  low24h: number
}

// Top crypto symbols to track
const TRACKED_SYMBOLS = [
  "BTC", "ETH", "BNB", "SOL", "XRP", "ADA", "DOGE", "DOT", "MATIC", "LTC",
  "AVAX", "LINK", "UNI", "ATOM", "XLM", "ALGO", "VET", "FIL", "HBAR", "NEAR"
]

/**
 * Fetch crypto prices from CoinGecko API (free tier)
 * Alternative to CoinMarketCap - no API key required
 */
export async function fetchCryptoPrices(): Promise<CryptoPrice[]> {
  try {
    const symbols = TRACKED_SYMBOLS.join(",")

    // Using CoinGecko free API
    const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
      params: {
        vs_currency: "usd",
        ids: TRACKED_SYMBOLS.map(s => getCoinGeckoId(s)).join(","),
        order: "market_cap_desc",
        per_page: 20,
        page: 1,
        sparkline: false,
        price_change_percentage: "24h,7d",
      }
    })

    return response.data.map((coin: any) => ({
      symbol: getSymbolFromId(coin.id),
      price: coin.current_price,
      change24h: coin.price_change_percentage_24h || 0,
      change7d: coin.price_change_percentage_7d_in_currency || 0,
      volume: coin.total_volume,
      marketCap: coin.market_cap,
      high24h: coin.high_24h,
      low24h: coin.low_24h,
    }))
  } catch (error) {
    console.error("Error fetching crypto prices:", error)

    // Fallback to cached data
    const cachedData = await prisma.marketData.findMany({
      take: 20,
      orderBy: { updatedAt: "desc" }
    })

    return cachedData.map((data: any) => ({
      symbol: data.symbol,
      price: Number(data.close),
      change24h: Number(data.change24h || 0),
      change7d: Number(data.change7d || 0),
      volume: Number(data.volume),
      marketCap: Number(data.marketCap || 0),
      high24h: Number(data.high),
      low24h: Number(data.low),
    }))
  }
}

/**
 * Get current price for a specific symbol
 */
export async function getCurrentPrice(symbol: string): Promise<number> {
  try {
    const coinId = getCoinGeckoId(symbol)

    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
      params: {
        ids: coinId,
        vs_currencies: "usd"
      }
    })

    return response.data[coinId]?.usd || 0
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error)

    // Fallback to cached data
    const cached = await prisma.marketData.findUnique({
      where: { symbol }
    })

    return Number(cached?.close || 0)
  }
}

/**
 * Update market data cache in database
 */
export async function updateMarketDataCache(prices: CryptoPrice[]) {
  try {
    const operations = prices.map(price =>
      prisma.marketData.upsert({
        where: { symbol: price.symbol },
        create: {
          symbol: price.symbol,
          open: price.price,
          high: price.high24h,
          low: price.low24h,
          close: price.price,
          volume: price.volume,
          marketCap: price.marketCap,
          change24h: price.change24h,
          change7d: price.change7d,
        },
        update: {
          open: price.price,
          high: price.high24h,
          low: price.low24h,
          close: price.price,
          volume: price.volume,
          marketCap: price.marketCap,
          change24h: price.change24h,
          change7d: price.change7d,
          updatedAt: new Date(),
        }
      })
    )

    await Promise.all(operations)
  } catch (error) {
    console.error("Error updating market data cache:", error)
  }
}

// Map crypto symbols to CoinGecko IDs
function getCoinGeckoId(symbol: string): string {
  const map: Record<string, string> = {
    BTC: "bitcoin",
    ETH: "ethereum",
    BNB: "binancecoin",
    SOL: "solana",
    XRP: "ripple",
    ADA: "cardano",
    DOGE: "dogecoin",
    DOT: "polkadot",
    MATIC: "matic-network",
    LTC: "litecoin",
    AVAX: "avalanche-2",
    LINK: "chainlink",
    UNI: "uniswap",
    ATOM: "cosmos",
    XLM: "stellar",
    ALGO: "algorand",
    VET: "vechain",
    FIL: "filecoin",
    HBAR: "hedera-hashgraph",
    NEAR: "near",
  }
  return map[symbol] || symbol.toLowerCase()
}

function getSymbolFromId(id: string): string {
  const reverseMap: Record<string, string> = {
    "bitcoin": "BTC",
    "ethereum": "ETH",
    "binancecoin": "BNB",
    "solana": "SOL",
    "ripple": "XRP",
    "cardano": "ADA",
    "dogecoin": "DOGE",
    "polkadot": "DOT",
    "matic-network": "MATIC",
    "litecoin": "LTC",
    "avalanche-2": "AVAX",
    "chainlink": "LINK",
    "uniswap": "UNI",
    "cosmos": "ATOM",
    "stellar": "XLM",
    "algorand": "ALGO",
    "vechain": "VET",
    "filecoin": "FIL",
    "hedera-hashgraph": "HBAR",
    "near": "NEAR",
  }
  return reverseMap[id] || id.toUpperCase()
}
