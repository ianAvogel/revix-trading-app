import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id: tournamentId } = await params;
    const userId = session.user.id;

    // Check if user has already joined
    const existingEntry = await prisma.tournamentEntry.findFirst({
      where: {
        tournamentId,
        userId,
      },
    });

    if (existingEntry) {
      return NextResponse.json({ success: false, error: "User has already joined this tournament" }, { status: 400 });
    }

    // Create a dedicated virtual account for the tournament
    const tournamentAccount = await prisma.virtualAccount.create({
      data: {
        userId,
        name: `Tournament Account - ${tournamentId}`,
        // You might want to fetch tournament-specific initial balance
        initialBalance: 50000, 
        currentBalance: 50000,
        equity: 50000,
      },
    });

    // Create the tournament entry
    const tournamentEntry = await prisma.tournamentEntry.create({
      data: {
        tournamentId,
        userId,
        accountId: tournamentAccount.id,
      },
    });

    return NextResponse.json({ success: true, tournamentEntry });
  } catch (error) {
    console.error("Error joining tournament:", error);
    return NextResponse.json({ success: false, error: "Failed to join tournament" }, { status: 500 });
  }
}
