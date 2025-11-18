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
      select: { id: true }
    })

    if (!virtualAccount) {
      return NextResponse.json({ success: false, message: "Virtual account not found" }, { status: 404 })
    }

    const positions = await prisma.position.findMany({
      where: {
        accountId: virtualAccount.id,
        isOpen: true,
      },
      orderBy: {
        openedAt: "desc",
      },
    })

    // Here you might want to enrich positions with current market price
    // For now, we'll return them as is.

    return NextResponse.json({ success: true, positions })
  } catch (error) {
    console.error("Failed to fetch open positions:", error)
    return NextResponse.json({ success: false, message: "An error occurred." }, { status: 500 })
  }
}
