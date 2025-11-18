import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: tournamentId } = await params;

    const tournament = await prisma.tournament.findUnique({
      where: {
        id: tournamentId,
      },
      include: {
        entries: {
          orderBy: {
            rank: 'asc',
          },
          include: {
            user: {
              select: {
                alias: true,
                avatarUrl: true,
              },
            },
            account: {
              select: {
                equity: true,
              }
            }
          },
        },
      },
    });

    if (!tournament) {
      return NextResponse.json({ success: false, error: "Tournament not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, tournament });
  } catch (error) {
    console.error(`Error fetching tournament:`, error);
    return NextResponse.json({ success: false, error: "Failed to fetch tournament details" }, { status: 500 });
  }
}
