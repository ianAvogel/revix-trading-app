import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const timestampStr = searchParams.get("timestamp")
    const replayTimestamp = timestampStr ? new Date(timestampStr) : null

    if (replayTimestamp) {
      // Replay mode: Calculate portfolio state at a specific time
      const account = await prisma.virtualAccount.findFirst({
        where: { userId: session.user.id },
      })

      if (!account) {
        return NextResponse.json({ success: false, error: "Virtual account not found" })
      }

      const tradesAtTime = await prisma.trade.findMany({
        where: {
          accountId: account.id,
          executedAt: {
            lte: replayTimestamp,
          },
        },
        orderBy: {
          executedAt: 'asc',
        },
        include: {
          position: true,
        }
      })

      let equity = account.initialBalance
      // This is a simplified calculation. A real implementation would be more complex.
      // @ts-ignore
      tradesAtTime.forEach(trade => {
        if (trade.side === 'SELL' && trade.position) {
          // Simplified PnL calculation
          // @ts-ignore
          equity += (trade.price - trade.position.entryPrice) * trade.quantity;
        }
      });

      return NextResponse.json({
        success: true,
        account: {
          ...account,
          equity: equity,
          // Note: Positions and other details would also need to be calculated for this point in time
        },
      })
    } else {
      // Live mode
      const account = await prisma.virtualAccount.findFirst({
        where: { userId: session.user.id },
        include: {
          positions: { where: { isOpen: true } },
          trades: { orderBy: { executedAt: 'desc' }, take: 10 },
        },
      })

      if (!account) {
        return NextResponse.json({ success: false, error: "Virtual account not found" })
      }

      return NextResponse.json({ success: true, account })
    }
  } catch (error) {
    console.error("Error fetching account:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
