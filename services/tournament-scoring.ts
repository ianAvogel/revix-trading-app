/**
 * Tournament Scoring & Ranking Engine
 * Calculates standings, prizes, and bracket positions for trading tournaments
 */

import { prisma } from "@/lib/prisma"
import { Decimal } from "@prisma/client/runtime/library"

export type TournamentStanding = {
  rank: number
  userId: string
  userName: string
  userAlias: string
  finalEquity: Decimal | number
  roi: number
  trades: number
  maxDrawdown: number
  winRate: number
  profit: Decimal | number
}

export type PrizeDistribution = {
  rank: number
  percentage: number
}

export type TournamentStats = {
  totalParticipants: number
  averageROI: number
  highestROI: number
  totalPrizePool: number
  startPrice: number
  currentPrice: number
  priceChange: number
}

/**
 * Calculate ROI percentage
 */
function calculateROI(startingEquity: number, finalEquity: number): number {
  return ((finalEquity - startingEquity) / startingEquity) * 100
}

/**
 * Standard prize distribution (can be customized per tournament)
 */
export function getPrizeDistribution(participantCount: number): PrizeDistribution[] {
  if (participantCount <= 10) {
    return [
      { rank: 1, percentage: 50 },
      { rank: 2, percentage: 30 },
      { rank: 3, percentage: 20 },
    ]
  }
  if (participantCount <= 50) {
    return [
      { rank: 1, percentage: 40 },
      { rank: 2, percentage: 25 },
      { rank: 3, percentage: 15 },
      { rank: 4, percentage: 10 },
      { rank: 5, percentage: 10 },
    ]
  }
  // Large tournaments
  return [
    { rank: 1, percentage: 30 },
    { rank: 2, percentage: 20 },
    { rank: 3, percentage: 15 },
    { rank: 4, percentage: 12 },
    { rank: 5, percentage: 10 },
    { rank: 6, percentage: 8 },
    { rank: 7, percentage: 3 },
    { rank: 8, percentage: 2 },
  ]
}

/**
 * Calculate final rankings for a tournament
 */
export async function calculateTournamentStandings(
  tournamentId: string
): Promise<TournamentStanding[]> {
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    include: {
      entries: {
        include: {
          user: true,
          account: {
            include: {
              trades: true,
            },
          },
        },
      },
    },
  })

  if (!tournament) throw new Error("Tournament not found")

  // Calculate standings based on final equity
  const standings = tournament.entries.map((entry, idx) => {
    // @ts-ignore
    const finalEquity = entry.account.equity || 10000
    const startingEquity = 10000
    const roi = calculateROI(startingEquity, parseFloat(finalEquity.toString()))

    // @ts-ignore
    const trades = entry.account.trades || []
    const profitableTrades = trades.filter((t: any) => t.pnl > 0)
    const winRate = trades.length > 0 ? (profitableTrades.length / trades.length) * 100 : 0

    // Calculate max drawdown (simplified)
    let maxDrawdown = 0
    let runningMax = startingEquity
    trades.forEach((trade: any) => {
      const equity = startingEquity + (trade.pnl || 0)
      if (equity < runningMax) {
        const drawdown = ((runningMax - equity) / runningMax) * 100
        maxDrawdown = Math.max(maxDrawdown, drawdown)
      }
      runningMax = Math.max(runningMax, equity)
    })

    return {
      rank: idx + 1,
      userId: entry.userId,
      userName: entry.user.alias || "Anonymous",
      userAlias: entry.user.alias || "trader",
      finalEquity,
      roi,
      trades: trades.length,
      maxDrawdown,
      winRate,
      profit: parseFloat(finalEquity.toString()) - startingEquity,
    }
  })

  // Sort by ROI (primary) and final equity (tiebreaker)
  standings.sort((a, b) => {
    if (b.roi !== a.roi) return b.roi - a.roi
    return parseFloat(b.finalEquity.toString()) - parseFloat(a.finalEquity.toString())
  })

  // Update ranks
  standings.forEach((standing, idx) => {
    standing.rank = idx + 1
  })

  return standings
}

/**
 * Calculate tournament statistics
 */
export async function calculateTournamentStats(tournamentId: string): Promise<TournamentStats> {
  const standings = await calculateTournamentStandings(tournamentId)

  if (standings.length === 0) {
    return {
      totalParticipants: 0,
      averageROI: 0,
      highestROI: 0,
      totalPrizePool: 0,
      startPrice: 0,
      currentPrice: 0,
      priceChange: 0,
    }
  }

  const rois = standings.map((s) => s.roi)
  const averageROI = rois.reduce((a, b) => a + b, 0) / rois.length
  const highestROI = Math.max(...rois)

  return {
    totalParticipants: standings.length,
    averageROI,
    highestROI,
    totalPrizePool: standings.reduce((sum, s) => sum + parseFloat(s.profit.toString()), 0),
    startPrice: 42500, // Placeholder
    currentPrice: 43200, // Placeholder
    priceChange: 1.6,
  }
}

/**
 * Update tournament final results
 */
export async function finalizeTournament(tournamentId: string) {
  const standings = await calculateTournamentStandings(tournamentId)
  const prizeDistribution = getPrizeDistribution(standings.length)
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
  })

  if (!tournament) throw new Error("Tournament not found")

  const prizePool = tournament.prizePool ? parseFloat(tournament.prizePool.toString()) : 0

  // Update entries with final ranks and create prize records
  for (const standing of standings) {
    await prisma.tournamentEntry.updateMany({
      where: {
        tournamentId,
        userId: standing.userId,
      },
      data: {
        rank: standing.rank,
        finalEquity: new Decimal(standing.finalEquity.toString()),
      },
    })

    // Award prizes
    const prizeInfo = prizeDistribution.find((p) => p.rank === standing.rank)
    if (prizeInfo && prizePool > 0) {
      const prizeAmount = (prizePool * prizeInfo.percentage) / 100
      // In production: create Prize record or transfer funds to user
      console.log(`User ${standing.userId} awarded $${prizeAmount}`)
    }
  }
}

/**
 * Generate bracket structure for tournament visualization
 */
export function generateBracket(participantCount: number): { round: number; position: number }[][] {
  // Single elimination bracket structure
  const rounds = Math.ceil(Math.log2(participantCount))
  const bracket: { round: number; position: number }[][] = []

  let roundSize = participantCount
  for (let round = 0; round < rounds; round++) {
    const roundMatches: { round: number; position: number }[] = []
    for (let position = 0; position < Math.ceil(roundSize / 2); position++) {
      roundMatches.push({ round, position })
    }
    bracket.push(roundMatches)
    roundSize = Math.ceil(roundSize / 2)
  }

  return bracket
}
