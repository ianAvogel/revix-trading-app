import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const q = new URL(req.url).searchParams
    const period = q.get("period") || "GLOBAL"

    const entries = await prisma.leaderboardEntry.findMany({
      where: {
        period: period.toUpperCase(),
      },
      orderBy: {
        rank: "asc",
      },
      take: 50, // Limit to top 50
      include: {
        user: {
          select: {
            alias: true,
            avatarUrl: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, leaderboard: entries })
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    return NextResponse.json({ success: false, message: "An error occurred." }, { status: 500 })
  }
}
