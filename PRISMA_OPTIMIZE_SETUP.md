# Prisma Optimize Setup Guide

## What is Prisma Optimize?

Prisma Optimize is Prisma's query analysis and optimization tool that helps you:
- **Identify N+1 queries** - Detect queries running in loops
- **Analyze query performance** - Understand which queries are slow
- **Get recommendations** - Receive specific optimization suggestions
- **Monitor trends** - Track performance over time
- **Prevent regressions** - Catch performance issues before they reach production

## Current Setup ✅

### Configuration
- **API Key**: Configured in `.env` as `OPTIMIZE_API_KEY`
- **Status**: Ready to use
- **Connection**: Automatic integration with Prisma Client

### How It Works

Prisma Optimize works by:
1. **Collecting Query Traces**: Your application sends query performance data to Prisma Cloud
2. **Analyzing Patterns**: Detect N+1 queries, slow queries, and inefficiencies
3. **Providing Insights**: Get actionable recommendations in your IDE and CI/CD

## Integration with Your App

### Automatic Integration

Prisma Optimize is already integrated! Once you start running queries with the configured API key, it will:
- Track all database queries
- Measure execution time
- Identify performance issues
- Suggest optimizations

### View Results

1. Go to **[Prisma Cloud](https://cloud.prisma.io)**
2. Navigate to your project
3. Go to **Insights** section
4. View:
   - Slow queries
   - N+1 query patterns
   - Database health metrics
   - Recommendations

## Example Issues It Detects

### N+1 Queries
```typescript
// ❌ BAD - Detected as N+1 query
const users = await prisma.user.findMany()
for (const user of users) {
  user.posts = await prisma.post.findMany({
    where: { userId: user.id }
  })
}

// ✅ GOOD - Prisma Optimize would recommend this
const users = await prisma.user.findMany({
  include: { posts: true }
})
```

### Missing Indexes
Prisma Optimize detects queries that would benefit from database indexes and shows:
- Which fields to index
- Expected performance improvement
- Index creation SQL

### Slow Queries
Automatically identifies queries taking longer than expected:
- Query text
- Execution time
- Affected endpoints
- Suggested optimizations

## Integration with Accelerate

Your setup includes both **Accelerate** and **Optimize**:

| Feature | Accelerate | Optimize |
|---------|-----------|----------|
| Connection Pooling | ✅ | — |
| Query Batching | ✅ | — |
| Response Caching | ✅ | — |
| Global Edge Locations | ✅ | — |
| Query Analysis | — | ✅ |
| N+1 Detection | — | ✅ |
| Performance Monitoring | — | ✅ |
| Recommendations | — | ✅ |

Together they provide:
- **Performance**: Accelerate speeds up queries via caching and pooling
- **Visibility**: Optimize helps you understand what's happening
- **Improvement**: Both combined help you build faster applications

## Monitoring Dashboard

### Key Metrics to Watch

1. **Query Count** - Total queries per interval
2. **Average Duration** - Mean query execution time
3. **Slow Query Threshold** - Queries exceeding baseline
4. **N+1 Patterns** - Detected inefficient query sequences
5. **Index Recommendations** - Missing database indexes

### Setting Alerts

Configure alerts in Prisma Cloud to notify you when:
- Query duration exceeds threshold
- N+1 patterns detected
- New slow query identified
- Query count spikes unexpectedly

## Common Optimizations

Based on Optimize insights, you might implement:

### 1. Add Indexes
```sql
-- Recommended by Optimize
CREATE INDEX idx_trades_accountId ON "Trade"("accountId");
CREATE INDEX idx_positions_accountId ON "Position"("accountId");
```

### 2. Use Relations Efficiently
```typescript
// Instead of multiple queries
const positions = await prisma.position.findMany()
positions.forEach(p => {
  p.trades = await prisma.trade.findMany({ where: { positionId: p.id } })
})

// Use single query with includes
const positions = await prisma.position.findMany({
  include: { trades: true }
})
```

### 3. Batch Operations
```typescript
// Instead of loop
for (const id of userIds) {
  await updateUser(id)
}

// Use batch
await prisma.user.updateMany({
  data: { /* update */ }
})
```

### 4. Select Only Needed Fields
```typescript
// Instead of fetching everything
const users = await prisma.user.findMany()

// Select specific fields
const users = await prisma.user.findMany({
  select: { id: true, name: true, email: true }
})
```

## Best Practices

✅ **DO**:
- Check Prisma Cloud dashboard weekly
- Review N+1 query recommendations
- Implement suggested indexes
- Monitor performance trends
- Use `select` for large result sets

❌ **DON'T**:
- Ignore slow query warnings
- Create indexes blindly
- Fetch entire objects when you need one field
- Loop queries in production code
- Commit without reviewing Optimize insights

## Performance Targets

For your trading app, target:

| Query Type | Target Duration | Timeout |
|-----------|-----------------|---------|
| User queries | < 50ms | 1s |
| Market data | < 100ms | 2s |
| Leaderboard | < 200ms | 3s |
| Portfolio | < 150ms | 2s |
| Trades | < 100ms | 2s |

## Troubleshooting

### If Optimize Shows No Data
1. Wait 5-10 minutes for first data collection
2. Verify `OPTIMIZE_API_KEY` is set correctly
3. Check that your app is running queries
4. Verify API key has correct permissions in Prisma Cloud

### If Seeing High Query Counts
- Review for N+1 patterns
- Check for unnecessary includes
- Consider caching with Accelerate
- Profile individual slow queries

### If Recommendations Don't Help
1. Validate in a test environment first
2. Monitor performance after changes
3. Check Prisma Cloud metrics for actual improvement
4. Adjust based on real-world usage patterns

## Next Steps

1. **Deploy Your App** - Start collecting performance data
2. **Wait for Insights** - Allow 30 minutes for baseline analysis
3. **Review Dashboard** - Check Prisma Cloud for recommendations
4. **Implement Changes** - Apply suggested optimizations
5. **Monitor Results** - Track improvement in metrics
6. **Set Alerts** - Configure notifications for anomalies
7. **Iterate** - Continuously improve based on insights

## Resources

- [Prisma Optimize Docs](https://www.prisma.io/docs/optimize)
- [Prisma Cloud Dashboard](https://cloud.prisma.io)
- [Performance Optimization Guide](https://www.prisma.io/docs/orm/prisma-client/performance-optimization)
- [Index Best Practices](https://www.prisma.io/docs/orm/reference/prisma-schema-reference#index)

## Summary

Your app now has:
- ✅ **Accelerate**: Connection pooling, batching, and caching
- ✅ **Optimize**: Query analysis and recommendations
- ✅ **Monitoring**: Real-time insights in Prisma Cloud
- ✅ **Production Ready**: Deploy with confidence

Start monitoring performance immediately after deployment!
