// Example Usage of Accelerate Cache Strategies
// This file demonstrates how to use cache strategies when they become compatible

import { prisma } from '@/lib/prisma'
import { applyCacheStrategy, CACHE_STRATEGIES, USE_CASE_CACHE } from '@/services/accelerate-cache'

// ============================================================================
// CURRENT STATE: These examples show how cache hints will be used
// Right now the cacheStrategy parameter is a no-op, but the code is ready
// for when the extension becomes compatible with NextAuth
// ============================================================================

/**
 * Example 1: User Profile Query with Caching
 * Cache user data for 5 minutes to reduce database load
 */
export async function getUserProfile(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    // ...applyCacheStrategy(CACHE_STRATEGIES.user),
  })
}

/**
 * Example 2: Market Data with Short Cache
 * Real-time data - cache for only 30 seconds
 */
export async function getMarketPrices() {
  return await prisma.marketData.findMany({
    orderBy: { symbol: 'asc' },
    take: 100,
    // ...applyCacheStrategy(CACHE_STRATEGIES.prices),
  })
}

/**
 * Example 3: Leaderboard with Medium Cache
 * Top traders - cache for 10 minutes
 */
export async function getLeaderboard(limit = 10) {
  return await prisma.virtualAccount.findMany({
    orderBy: { equity: 'desc' },
    take: limit,
    include: { user: true },
    // ...applyCacheStrategy(CACHE_STRATEGIES.leaderboard),
  })
}

/**
 * Example 4: Trading Activity with Short Cache
 * Active trading - cache for 10 seconds only
 */
export async function getRecentTrades(limit = 20) {
  return await prisma.trade.findMany({
    orderBy: { executedAt: 'desc' },
    take: limit,
    // ...applyCacheStrategy(USE_CASE_CACHE.trading),
  })
}

/**
 * Example 5: Portfolio Data with Real-time Cache
 * User portfolio - cache for 30 seconds
 */
export async function getUserPortfolio(accountId: string) {
  const account = await prisma.virtualAccount.findUnique({
    where: { id: accountId },
    include: {
      positions: true,
      trades: { orderBy: { executedAt: 'desc' }, take: 50 },
    },
    // ...applyCacheStrategy(USE_CASE_CACHE.trading),
  })

  return account
}

/**
 * Example 6: Historical Data with Long Cache
 * Historical analysis - cache for 1 hour
 */
export async function getHistoricalData(symbol: string, days = 30) {
  return await prisma.historicalData.findMany({
    where: { symbol },
    orderBy: { timestamp: 'desc' },
    take: days,
    // ...applyCacheStrategy(USE_CASE_CACHE.history),
  })
}

/**
 * Example 7: Tournament Data with Static Cache
 * Tournaments are infrequently updated - cache for 1 hour
 */
export async function getTournaments() {
  return await prisma.tournament.findMany({
    orderBy: { startTime: 'desc' },
    take: 20,
    // ...applyCacheStrategy(CACHE_STRATEGIES.tournaments),
  })
}

/**
 * Example 8: Signals with Medium Cache
 * Trading signals - cache for 5 minutes
 */
export async function getSignals(limit = 50) {
  return await prisma.signal.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    // ...applyCacheStrategy(CACHE_STRATEGIES.signals),
  })
}

/**
 * Example 9: Batch Query with Different Caches
 * Mix of queries with different cache needs
 */
export async function getDashboardData(userId: string) {
  const [user, recentTrades, leaderboard, signals] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      // ...applyCacheStrategy(CACHE_STRATEGIES.user),
    }),
    prisma.trade.findMany({
      where: { account: { user: { id: userId } } },
      orderBy: { executedAt: 'desc' },
      take: 5,
      // ...applyCacheStrategy(USE_CASE_CACHE.trading),
    }),
    prisma.virtualAccount.findMany({
      orderBy: { equity: 'desc' },
      take: 10,
      // ...applyCacheStrategy(CACHE_STRATEGIES.leaderboard),
    }),
    prisma.signal.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      // ...applyCacheStrategy(CACHE_STRATEGIES.signals),
    }),
  ])

  return { user, recentTrades, leaderboard, signals }
}

/**
 * IMPORTANT: Cache Strategy Guidelines
 * 
 * NEVER cache:
 * - Authentication/session data (security risk)
 * - User input validation
 * - One-time operations
 * 
 * ALWAYS cache with short TTL (10-30s):
 * - Real-time market data
 * - Active trading positions
 * - Current user activity
 * 
 * Cache with medium TTL (1-5 min):
 * - User profiles
 * - Trading signals
 * - Portfolio summaries
 * 
 * Cache with long TTL (10 min - 1 hour):
 * - Leaderboard data
 * - Tournament information
 * - Historical data
 * - Configuration
 */

// ============================================================================
// ACTIVATION INSTRUCTIONS
// ============================================================================
// 
// When Prisma and NextAuth compatibility is resolved:
// 
// 1. Uncomment the ...applyCacheStrategy(...) lines in each function above
// 2. Import applyCacheStrategy in your API routes:
//    import { applyCacheStrategy, CACHE_STRATEGIES } from '@/services/accelerate-cache'
// 
// 3. Add to your Prisma client initialization (lib/prisma.ts):
//    import { withAccelerate } from '@prisma/extension-accelerate'
//    export const prisma = globalForPrisma.prisma ?? 
//      new PrismaClient().$extends(withAccelerate())
// 
// 4. Rebuild and deploy
// 
// ============================================================================

export default {
  getUserProfile,
  getMarketPrices,
  getLeaderboard,
  getRecentTrades,
  getUserPortfolio,
  getHistoricalData,
  getTournaments,
  getSignals,
  getDashboardData,
}
