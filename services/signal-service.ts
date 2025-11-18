import { prisma } from "@/lib/prisma"
import { getCurrentPrice } from "./market-data"

export async function generateSampleSignals() {
  const symbols = ["BTC","ETH","SOL","MATIC","BNB"]
  const now = new Date()
  const signals = []
  for (const s of symbols) {
    const price = await getCurrentPrice(s)
    signals.push({
      symbol: s,
      direction: Math.random() > 0.5 ? "BUY" : "SELL",
      confidence: Math.floor(60 + Math.random() * 35),
      rationale: [{ point: `Price at ${price}` }],
      indicators: { price },
      expiresAt: new Date(now.getTime() + 1 * 60 * 60 * 1000),
    })
  }
  return signals
}

export async function getActiveSignals(limit = 20, symbol?: string, confidenceMin: number = 0) {
  const where: any = { isActive: true }
  if (symbol) where.symbol = symbol
  if (confidenceMin) where.confidence = { gte: confidenceMin }
  const signals = await prisma.signal.findMany({ where, orderBy: { createdAt: "desc" }, take: limit })
  if (signals.length === 0) {
    const generated = await generateSampleSignals()
    const created = await Promise.all(generated.map(s => prisma.signal.create({ data: s })))
    return created
  }
  return signals
}
