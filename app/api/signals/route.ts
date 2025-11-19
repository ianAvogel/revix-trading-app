import { NextResponse } from "next/server"
import { getActiveSignals } from "@/services/signal-service"
import { generateAISignal, generateMultipleAISignals } from "@/services/ai-signal-generator"
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
    const useAI = q.get("useAI") === "true"

    let signals: any[] = []

    if (useAI) {
      // Use AI-powered signal generation
      const defaultSymbols = ["BTC", "ETH", "SOL", "MATIC", "BNB", "ADA", "XRP", "DOT"]
      const targetSymbols = symbol ? [symbol] : defaultSymbols
      
      try {
        const aiSignals = await generateMultipleAISignals(targetSymbols)
        signals = aiSignals
          .filter(s => s.confidence >= confidenceMin)
          .sort((a, b) => b.confidence - a.confidence)
          .slice(0, limit)

        // Save signals to database for persistence
        for (const signal of signals) {
          await prisma.signal.upsert({
            where: { symbol: signal.symbol },
            update: {
              direction: signal.direction,
              confidence: signal.confidence,
              rationale: signal.rationale,
              indicators: {
                technicalScore: signal.technicalScore,
                sentimentScore: signal.sentimentScore,
                riskLevel: signal.riskLevel,
                targetPrice: signal.targetPrice,
                stopLoss: signal.stopLoss,
                riskRewardRatio: signal.riskRewardRatio,
              },
              isActive: true,
              expiresAt: signal.expiresAt,
            },
            create: {
              symbol: signal.symbol,
              direction: signal.direction,
              confidence: signal.confidence,
              rationale: signal.rationale,
              indicators: {
                technicalScore: signal.technicalScore,
                sentimentScore: signal.sentimentScore,
                riskLevel: signal.riskLevel,
                targetPrice: signal.targetPrice,
                stopLoss: signal.stopLoss,
                riskRewardRatio: signal.riskRewardRatio,
              },
              isActive: true,
              expiresAt: signal.expiresAt,
            }
          })
        }
      } catch (error) {
        console.error("Error generating AI signals, falling back to database:", error)
        // Fallback to database signals
        signals = await getActiveSignals(limit, symbol, confidenceMin)
      }
    } else {
      // Use database signals (original behavior)
      signals = await getActiveSignals(limit, symbol, confidenceMin)
    }

    // Add saved status if user is logged in
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
