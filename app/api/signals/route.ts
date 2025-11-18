import { NextResponse } from "next/server"
import { getActiveSignals } from "@/services/signal-service"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    const q = new URL(req.url).searchParams
    const limit = Number(q.get("limit") || 20)
    const symbol = q.get("symbol") || undefined
    const confidenceMin = Number(q.get("confidenceMin") || 0)
    
    const signals = await getActiveSignals(limit, symbol, confidenceMin)

    if (userId) {
      const savedSignalActions = await prisma.userSignalAction.findMany({
        where: {
          userId,
          action: "SAVED"
        },
        select: {
          signalId: true
        }
      })
      // @ts-ignore
      const savedSignalIds = new Set(savedSignalActions.map(s => s.signalId))

      // @ts-ignore
      const signalsWithSavedStatus = signals.map(signal => ({
        ...signal,
        isSaved: savedSignalIds.has(signal.id)
      }))
      return NextResponse.json({ success: true, signals: signalsWithSavedStatus })
    }


    return NextResponse.json({ success: true, signals })
  } catch (error) {
    console.error("Error in /api/signals:", error)
    return NextResponse.json({ error: "Failed to fetch signals" }, { status: 500 })
  }
}
