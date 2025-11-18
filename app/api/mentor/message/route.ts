import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic'

// LLM Integration with Groq API for fast, intelligent responses
async function getLLMReply(userMessage: string, portfolioContext: string, conversationHistory: Array<{role: string, content: string}>): Promise<string> {
  try {
    // Use Groq API for fast responses (free, fast, no rate limits for dev)
    const groqApiKey = process.env.GROQ_API_KEY
    
    if (!groqApiKey) {
      console.warn("GROQ_API_KEY not configured, using fallback response")
      return getFallbackReply(userMessage)
    }

    // Build system prompt for trading mentor
    const systemPrompt = `You are an expert trading mentor with deep knowledge of technical analysis, risk management, and trading psychology. 
Your role is to provide educational, actionable advice to help traders improve their skills.

${portfolioContext ? `Current Portfolio Context:\n${portfolioContext}\n` : ''}

Key principles:
- Give specific, actionable advice based on the trader's situation
- Emphasize risk management and position sizing
- Explain trading concepts clearly without jargon
- Ask clarifying questions when needed
- Provide educational value above all else
- Keep responses concise but comprehensive (under 200 words typically)
- Never provide financial advice or guarantee outcomes
- Encourage learning and experimentation`

    // Build message history for context awareness
    const messages = [
      ...conversationHistory.slice(-5), // Keep last 5 messages for context
      { role: "user", content: userMessage }
    ]

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqApiKey}`
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768", // Fast, capable model
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        max_tokens: 500,
        temperature: 0.7,
        top_p: 0.9,
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Groq API error:", response.status, errorText)
      return getFallbackReply(userMessage)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || getFallbackReply(userMessage)
  } catch (error) {
    console.error("Error calling LLM:", error)
    return getFallbackReply(userMessage)
  }
}

// Fallback replies when LLM is unavailable
function getFallbackReply(userMessage: string): string {
  const lower = userMessage.toLowerCase()
  
  const responses: Record<string, string> = {
    "risk": "Risk management is crucial in trading. Consider using stop-losses, position sizing, and diversification. What's your typical risk-to-reward ratio?",
    "strategy": "Common trading strategies include trend following, mean reversion, support/resistance, and breakout trading. Which timeframe are you trading on?",
    "technical": "Technical analysis uses price action and indicators to make decisions. Candlesticks, moving averages, and RSI are good starting points. What chart pattern are you analyzing?",
    "entry": "A solid entry typically comes after identifying resistance/support, waiting for confirmation, and ensuring good risk-reward. Are you using limit or market orders?",
    "loss": "Losses are part of trading. What matters is learning from them. Can you identify why the trade didn't work out?",
    "profit": "Great trade! Document what went right so you can repeat it. Are you following a consistent trading plan?",
  }

  for (const [keyword, response] of Object.entries(responses)) {
    if (lower.includes(keyword)) return response
  }

  return "That's a great question! Can you tell me more about your current trading situation or which specific area you'd like to focus on?"
}


const RATE_LIMIT_PER_HOUR = 50 // Generous limit for development/testing

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { message, conversationContext = [] } = body

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 })
    }

    // Rate limiter: count messages in last hour
    const oneHourAgo = new Date(Date.now() - (60 * 60 * 1000))
    const recentMessagesCount = await prisma.mentorConversation.count({
      where: {
        userId: session.user.id,
        updatedAt: { gt: oneHourAgo }
      }
    })
    if (recentMessagesCount >= RATE_LIMIT_PER_HOUR) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again in an hour." },
        { status: 429 }
      )
    }

    // Fetch Portfolio Context for personalized responses
    const virtualAccount = await prisma.virtualAccount.findFirst({
      where: { userId: session.user.id },
      include: {
        positions: {
          where: { isOpen: true },
          orderBy: { unrealizedPnl: 'desc' },
          take: 5
        },
        trades: {
          orderBy: { executedAt: 'desc' },
          take: 5
        }
      }
    })

    let portfolioContext = ""
    if (virtualAccount && virtualAccount.positions.length > 0) {
      const positionsSummary = virtualAccount.positions
        // @ts-ignore
        .map(p => `${p.side} ${p.symbol}: ${p.quantity} units @ $${p.entryPrice}, PnL: $${p.unrealizedPnl}`)
        .join('\n• ')

      const totalPnL = virtualAccount.positions
        // @ts-ignore
        .reduce((sum, p) => sum + (p.unrealizedPnl || 0), 0)

      portfolioContext = `User's current positions:
• ${positionsSummary}
Total unrealized P&L: $${totalPnL.toFixed(2)}
Account equity: $${virtualAccount.equity.toFixed(2)}`
    }

    // Call LLM with conversation history for context awareness
    const reply = await getLLMReply(message, portfolioContext, conversationContext)

    // Persist the conversation
    const conversation = await prisma.mentorConversation.findFirst({
      where: {
        userId: session.user.id,
        contextType: "ACCOUNT",
        contextId: virtualAccount?.id || null
      },
      orderBy: { updatedAt: 'desc' }
    })

    const newMessages = [
      { role: "user", content: message },
      { role: "assistant", content: reply }
    ]

    if (conversation) {
      // Append to existing conversation
      const existingMessages = Array.isArray(conversation.messages)
        ? conversation.messages
        : []
      await prisma.mentorConversation.update({
        where: { id: conversation.id },
        data: {
          messages: [...existingMessages, ...newMessages]
        }
      })
    } else {
      // Create new conversation
      await prisma.mentorConversation.create({
        data: {
          userId: session.user.id,
          contextType: "ACCOUNT",
          contextId: virtualAccount?.id || null,
          messages: newMessages
        }
      })
    }

    return NextResponse.json({ success: true, reply })
  } catch (error) {
    console.error("Error in /api/mentor/message:", error)
    return NextResponse.json(
      { error: "Failed to get mentor reply" },
      { status: 500 }
    )
  }
}
