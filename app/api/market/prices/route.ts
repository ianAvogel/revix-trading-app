import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic'

// This is a simplified mock. In a real app, you'd use a WebSocket or a real-time data provider.
const lastPrices: Record<string, number> = {
  BTC: 68000,
  ETH: 3500,
  SOL: 150,
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const timestampStr = searchParams.get("timestamp");
  const replayTimestamp = timestampStr ? new Date(timestampStr) : null;

  if (replayTimestamp) {
    // Fetch historical prices for the replay timestamp
    const historicalPrices = await prisma.historicalData.findMany({
      where: {
        timestamp: {
          lte: replayTimestamp,
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      distinct: ['symbol'],
    });

    // @ts-ignore
    const prices = historicalPrices.reduce((acc: Record<string, number>, p) => {
      acc[p.symbol] = Number(p.close);
      return acc;
    }, {});

    return NextResponse.json({ success: true, prices });
  } else {
    // Return live prices (mocked)
    Object.keys(lastPrices).forEach(symbol => {
      const change = (Math.random() - 0.5) * (lastPrices[symbol] * 0.001); // +/- 0.1%
      lastPrices[symbol] += change;
    });
    return NextResponse.json({ success: true, prices: lastPrices });
  }
}
