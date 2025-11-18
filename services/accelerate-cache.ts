// Accelerate Cache Strategy Helper
// This file provides utilities for leveraging Prisma Accelerate caching
// without using the full extension (which has compatibility issues with NextAuth)

export interface CacheStrategy {
  ttl?: number // Time to live in seconds
  swr?: number // Stale-while-revalidate in seconds
}

/**
 * Default cache strategies for common query patterns
 */
export const CACHE_STRATEGIES = {
  // User and account data - cache for 5 minutes
  user: { ttl: 300 } as CacheStrategy,
  account: { ttl: 300 } as CacheStrategy,
  
  // Market data - cache for 1 minute (prices change frequently)
  marketData: { ttl: 60 } as CacheStrategy,
  prices: { ttl: 30 } as CacheStrategy,
  
  // Leaderboard - cache for 10 minutes (less frequent updates)
  leaderboard: { ttl: 600 } as CacheStrategy,
  
  // Static content - cache for 1 hour
  tournaments: { ttl: 3600 } as CacheStrategy,
  signals: { ttl: 300 } as CacheStrategy,
  
  // Portfolio data - cache for 30 seconds (updates more frequently)
  portfolio: { ttl: 30 } as CacheStrategy,
}

/**
 * Helper to add cache strategy metadata to Prisma queries
 * Note: When using Prisma Accelerate, you can add cacheStrategy parameter to queries
 * 
 * Example usage:
 * const result = await prisma.user.findMany({
 *   where: { id: '123' },
 *   ...applyCacheStrategy(CACHE_STRATEGIES.user)
 * })
 */
export function applyCacheStrategy(strategy: CacheStrategy) {
  // This will work when Accelerate extension is properly integrated
  return { cacheStrategy: strategy }
}

/**
 * Cache strategies for specific use cases
 */
export const USE_CASE_CACHE = {
  // Real-time trading data - minimal cache
  trading: { ttl: 10 } as CacheStrategy,
  
  // User profiles - medium cache
  profile: { ttl: 300 } as CacheStrategy,
  
  // Historical data - longer cache (rarely changes)
  history: { ttl: 3600 } as CacheStrategy,
  
  // Configuration - very long cache
  config: { ttl: 3600 } as CacheStrategy,
}
