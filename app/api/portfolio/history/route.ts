import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
  }

  try {
    const virtualAccount = await prisma.virtualAccount.findFirst({
      where: { userId: session.user.id },
    })

    if (!virtualAccount) {
      return NextResponse.json({ success: false, message: "Virtual account not found" }, { status: 404 })
    }

    const trades = await prisma.trade.findMany({
      where: {
        accountId: virtualAccount.id,
      },
      orderBy: {
        executedAt: "desc",
      },
      take: 100, // Limit to the last 100 trades for now
    })

    return NextResponse.json({ success: true, trades })
  } catch (error) {
    console.error("Failed to fetch trade history:", error)
    return NextResponse.json({ success: false, message: "An error occurred." }, { status: 500 })
  }
}
