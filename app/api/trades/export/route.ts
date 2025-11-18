import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const trades = await prisma.trade.findMany({ where: { account: { userId: session.user.id } }, include: { audits: true } })

    // @ts-ignore
    const rows = trades.map(t => ({
      id: t.id,
      symbol: t.symbol,
      side: t.side,
      quantity: Number(t.quantity),
      price: Number(t.price),
      fee: Number(t.fee),
      executedAt: t.executedAt.toISOString(),
      auditCount: t.audits.length,
    }))

    // Simple CSV serialization
    const headers = ["id","symbol","side","quantity","price","fee","executedAt","auditCount"]
    // @ts-ignore
    const csv = [headers.join(",")].concat(rows.map(r => headers.map(h => String((r as any)[h] ?? "")).join(","))).join("\n")
    return new NextResponse(csv, { status: 200, headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="trades.csv"' } })
  } catch (error) {
    console.error("Error exporting trades:", error)
    return NextResponse.json({ error: "Failed to export trades" }, { status: 500 })
  }
}
