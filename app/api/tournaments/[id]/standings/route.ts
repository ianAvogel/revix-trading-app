import { NextResponse } from "next/server"
import { calculateTournamentStandings } from "@/services/tournament-scoring"

export const dynamic = 'force-dynamic'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const standings = await calculateTournamentStandings(params.id)
    return NextResponse.json({ success: true, standings })
  } catch (error) {
    console.error("Error fetching standings:", error)
    return NextResponse.json(
      { error: "Failed to fetch standings" },
      { status: 500 }
    )
  }
}
