import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const tournaments = await prisma.tournament.findMany({
      where: {
        endTime: {
          gt: new Date() // Only fetch active or upcoming tournaments
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    });
    return NextResponse.json({ success: true, tournaments });
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch tournaments" }, { status: 500 });
  }
}
