import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    const body = await req.json()
    const { signalId, action } = body // action should be "SAVE" or "UNSAVE"

    if (!signalId || !action) {
      return NextResponse.json({ success: false, message: "Missing signalId or action" }, { status: 400 })
    }

    if (action === "SAVE") {
      await prisma.userSignalAction.create({
        data: {
          userId: session.user.id,
          signalId: signalId,
          action: "SAVED",
        },
      })
      return NextResponse.json({ success: true, message: "Signal saved" })
    } else if (action === "UNSAVE") {
      await prisma.userSignalAction.deleteMany({
        where: {
          userId: session.user.id,
          signalId: signalId,
          action: "SAVED",
        },
      })
      return NextResponse.json({ success: true, message: "Signal unsaved" })
    } else {
      return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Failed to save/unsave signal:", error)
    return NextResponse.json({ success: false, message: "An error occurred." }, { status: 500 })
  }
}
