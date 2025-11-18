import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { executeTrade } from "@/services/trade-executor"
import { z } from "zod"

const tradeSchema = z.object({
  accountId: z.string(),
  symbol: z.string(),
  side: z.enum(["BUY", "SELL"]),
  type: z.enum(["MARKET", "LIMIT"]),
  quantity: z.number().positive(),
  limitPrice: z.number().optional(),
  signalId: z.string().optional(),
  mentorSuggested: z.boolean().optional(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const params = tradeSchema.parse(body)

    // Verify account belongs to user
    const { prisma } = await import("@/lib/prisma")
    const account = await prisma.virtualAccount.findFirst({
      where: {
        id: params.accountId,
        userId: session.user.id
      }
    })

    if (!account) {
      return NextResponse.json(
        { error: "Account not found or unauthorized" },
        { status: 403 }
      )
    }

    const result = await executeTrade({ ...params, userId: session.user.id })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      trade: result.trade,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("Error in /api/trades/execute:", error)
    return NextResponse.json(
      { error: "Trade execution failed" },
      { status: 500 }
    )
  }
}
