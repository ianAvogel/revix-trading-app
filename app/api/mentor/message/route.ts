import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic'

// In a real app, this would be a call to an LLM service like OpenAI
async function getLLMReply(userMessage: string, portfolioContext: string) {
  // Simulate LLM call with a deterministic reply for MVP
  const prompt = `
    Portfolio Context:
    ${portfolioContext}

    User Message:
    ${userMessage}
  `
  console.log("--- AI MENTOR PROMPT ---")
  console.log(prompt)
  console.log("------------------------")

  // Deterministic templated reply (MVP fallback)
  if (userMessage.toLowerCase().includes("risk")) {
    return "Based on your current holdings, consider diversifying away from highly correlated assets. Setting a stop-loss of 5% on your largest position could also mitigate downside risk."
  }
  if (userMessage.toLowerCase().includes("lose")) {
    return "Losses are part of trading. Looking at your recent trades, it seems the market moved unexpectedly. It's a good opportunity to review if the initial thesis for the trade still holds."
  }
  
  return `I've analyzed your portfolio. Regarding your question: "${userMessage}", a possible next step could be to re-evaluate your exposure to the assets you're holding. Your current unrealized PnL looks healthy.`
}


const RATE_LIMIT_PER_HOUR = 20 // Increased for development

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { message } = body

    // Simple rate limiter: count messages in last hour
    const oneHourAgo = new Date(Date.now() - (60 * 60 * 1000))
    const recentMessagesCount = await prisma.mentorConversation.count({ where: { userId: session.user.id, updatedAt: { gt: oneHourAgo } } })
    if (recentMessagesCount >= RATE_LIMIT_PER_HOUR) {
      return NextResponse.json({ error: "Rate limit exceeded. Please try again in an hour." }, { status: 429 })
    }

    // --- Fetch Portfolio Context ---
    const virtualAccount = await prisma.virtualAccount.findFirst({
      where: { userId: session.user.id },
      include: {
        positions: {
          where: { isOpen: true },
          orderBy: { unrealizedPnl: 'desc' }
        },
        trades: {
          orderBy: { executedAt: 'desc' },
          take: 5
        }
      }
    })

    let portfolioContext = "User has no trading activity yet."
    if (virtualAccount) {
      const positionsSummary = virtualAccount.positions.length > 0
        // @ts-ignore
        ? virtualAccount.positions.map(p => `${p.side} ${p.symbol}: ${p.quantity} units, Entry: $${p.entryPrice}, PnL: $${p.unrealizedPnl}`).join('\n')
        : "No open positions."

      const tradesSummary = virtualAccount.trades.length > 0
        // @ts-ignore
        ? virtualAccount.trades.map(t => `${t.side} ${t.symbol} @ $${t.price}`).join(', ')
        : "No recent trades."

      portfolioContext = `
        Account Equity: $${virtualAccount.equity}
        Open Positions:
        ${positionsSummary}
        Recent Trades: ${tradesSummary}
      `
    }
    // --- End Fetch ---

    const reply = await getLLMReply(message, portfolioContext)

    // Persist the conversation message
    await prisma.mentorConversation.create({
      data: {
        userId: session.user.id,
        contextType: "ACCOUNT", // Hardcoded for now
        contextId: virtualAccount?.id || null,
        messages: [{ role: "user", content: message }, { role: "assistant", content: reply }]
      }
    })

    return NextResponse.json({ success: true, reply })
  } catch (error) {
    console.error("Error in /api/mentor/message:", error)
    return NextResponse.json({ error: "Failed to get mentor reply" }, { status: 500 })
  }
}
