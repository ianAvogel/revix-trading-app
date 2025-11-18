import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    // For simplicity, calculate ROI across all active accounts and update leaderboard entries (global period)
    const accounts = await prisma.virtualAccount.findMany({ include: { user: true, positions: true } })

    for (const a of accounts) {
      const initial = Number(a.initialBalance)
      const current = Number(a.equity)
      const roi = initial === 0 ? 0 : ((current - initial) / initial) * 100
      const riskScore = 0 // placeholder

      await prisma.leaderboardEntry.upsert({
        where: { userId_period: { userId: a.userId, period: "GLOBAL" } },
        create: { userId: a.userId, period: "GLOBAL", roi: roi as any, riskScore: riskScore as any, rank: 0, maxDrawdown: 0 as any },
        update: { roi: roi as any, riskScore: riskScore as any, calculatedAt: new Date() }
      })
    }

    // Recalculate ranks (simple ordering)
    const entries = await prisma.leaderboardEntry.findMany({ where: { period: "GLOBAL" }, orderBy: { roi: "desc" } })
    for (let i = 0; i < entries.length; i++) {
      await prisma.leaderboardEntry.update({ where: { id: entries[i].id }, data: { rank: i + 1 } })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error recalculating leaderboard:", error)
    return NextResponse.json({ error: "Failed to recalc leaderboard" }, { status: 500 })
  }
}
