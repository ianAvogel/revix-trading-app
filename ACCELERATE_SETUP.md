# Prisma Accelerate Setup Guide

## Current Status ✅

The Revix Trading App is configured to use Prisma Accelerate with the following setup:

### Database Configuration
- **Connection Method**: Prisma Accelerate (connection pooling proxy)
- **Database URL**: `prisma+postgres://accelerate.prisma-data.net/?api_key=...`
- **Status**: ✅ Connected and working
- **Client Generation**: Optimized for Accelerate (engine=none)

### Packages Installed
```
@prisma/extension-accelerate@1.2.x
@prisma/client@6.19.0
```

## Architecture Decision

We use a **hybrid approach** rather than the full `withAccelerate()` extension:

### Why Not Use Full Extension?
The `withAccelerate()` extension has a TypeScript compatibility issue with NextAuth's PrismaAdapter:
- The extension modifies the PrismaClient type to include a `PrismaCacheStrategy`
- NextAuth's PrismaAdapter expects an unmodified `$on` property
- Using the extension causes build failures: "Property '$on' is missing"

### Current Implementation (Working)
1. **Connection-Level Accelerate**: Enabled automatically via DATABASE_URL
   - Provides connection pooling, query batching, and response caching
   - No code changes needed - works transparently

2. **Manual Cache Strategies**: Documented in `services/accelerate-cache.ts`
   - Provides TypeScript-safe cache strategy definitions
   - Ready for when Prisma/NextAuth resolves extension compatibility
   - Includes recommended TTL values for different query types

## Benefits You Get Now

✅ **Connection Pooling** - Reduced connection overhead  
✅ **Query Batching** - Multiple queries combined into single request  
✅ **Automatic Response Caching** - Accelerate caches responses server-side  
✅ **Global Edge Locations** - Reduced latency for users worldwide  
✅ **Built-in Metrics** - Monitor performance in Prisma Cloud dashboard  

## How to Implement Query Caching (Future)

Once NextAuth compatibility is resolved, add cache strategies to frequently-called queries:

```typescript
import { applyCacheStrategy, CACHE_STRATEGIES } from '@/services/accelerate-cache'

// Example: User queries with caching
const user = await prisma.user.findUnique({
  where: { id: userId },
  ...applyCacheStrategy(CACHE_STRATEGIES.user),
})

// Example: Market data with short cache
const prices = await prisma.marketPrice.findMany({
  ...applyCacheStrategy(CACHE_STRATEGIES.prices),
})

// Example: Leaderboard with longer cache
const leaders = await prisma.virtualAccount.findMany({
  orderBy: { balance: 'desc' },
  take: 10,
  ...applyCacheStrategy(CACHE_STRATEGIES.leaderboard),
})
```

## Cache Strategy Recommendations

### High-Volume Queries (Cache Longer)
- **Leaderboard**: 10 minutes (TTL: 600s)
- **Tournaments**: 1 hour (TTL: 3600s)
- **User Profiles**: 5 minutes (TTL: 300s)

### Real-Time Data (Cache Shorter)
- **Market Prices**: 30 seconds (TTL: 30s)
- **Trading Activity**: 10 seconds (TTL: 10s)
- **Portfolio Updates**: 30 seconds (TTL: 30s)

### Static Content (Cache Long)
- **Signals**: 5 minutes (TTL: 300s)
- **Configuration**: 1 hour (TTL: 3600s)
- **Historical Data**: 1 hour (TTL: 3600s)

## Monitoring Performance

### Prisma Cloud Dashboard
1. Go to https://cloud.prisma.io
2. Navigate to your project's **Database** section
3. View metrics:
   - Query count
   - Cache hit rate
   - Average response time
   - Connection pool utilization

### Local Development
The database connection string includes metrics collection. Check your Prisma Cloud dashboard to see real-time performance data.

## Troubleshooting

### If Database Connection Fails
1. Verify API key in `.env`
2. Check Prisma Cloud dashboard for API key status
3. Ensure database backend is provisioned

### If Seeing "P1010" Errors
- Contact Prisma support to verify database provisioning
- Check that your API key has correct permissions
- Verify the database backend URL is accessible

### If Build Fails with Type Errors
- Current setup avoids `withAccelerate()` to maintain NextAuth compatibility
- This is intentional - extension support is in development
- Application is fully functional without the extension

## Next Steps

1. **Monitor Performance**: Check Prisma Cloud dashboard for cache statistics
2. **Add Cache Strategies**: Once NextAuth is compatible, uncomment cache strategies in key queries
3. **Tune TTL Values**: Adjust cache times based on your actual usage patterns
4. **Track Metrics**: Monitor cache hit rates to optimize TTL settings

## Resources

- [Prisma Accelerate Documentation](https://www.prisma.io/docs/accelerate)
- [Prisma Accelerate Client Extension](https://www.prisma.io/docs/accelerate/working-with-accelerate/caching)
- [Prisma Cloud Dashboard](https://cloud.prisma.io)
- [NextAuth.js Documentation](https://next-auth.js.org/)

## Summary

Your app is **production-ready** with Prisma Accelerate enabled. You're getting automatic benefits from connection pooling and response caching. Query-level cache strategies are ready to implement once framework compatibility is resolved.
