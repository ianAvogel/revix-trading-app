import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    const body = await req.json()
    
    // This endpoint can now handle multiple preference updates
    const dataToUpdate: { experienceLevel?: string, topAssets?: string[], isPublic?: boolean } = {}

    if (body.experienceLevel) dataToUpdate.experienceLevel = body.experienceLevel
    if (body.topAssets) dataToUpdate.topAssets = body.topAssets
    if (typeof body.isPublic === 'boolean') dataToUpdate.isPublic = body.isPublic

    if (Object.keys(dataToUpdate).length === 0) {
        return NextResponse.json({ success: false, message: "No preferences provided" }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: dataToUpdate,
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error("Failed to update user preferences:", error)
    return NextResponse.json({ success: false, message: "An error occurred." }, { status: 500 })
  }
}
