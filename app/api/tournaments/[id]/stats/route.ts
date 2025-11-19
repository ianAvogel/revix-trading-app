import { NextResponse } from "next/server"
import { calculateTournamentStats } from "@/services/tournament-scoring"

export const dynamic = 'force-dynamic'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const stats = await calculateTournamentStats(params.id)
    return NextResponse.json({ success: true, stats })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}
