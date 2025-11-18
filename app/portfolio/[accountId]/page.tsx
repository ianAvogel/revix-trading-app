import { prisma } from "@/lib/prisma"
import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { format } from "date-fns"

export const dynamic = 'force-dynamic'

export default async function PortfolioPage({ params }: any) {
  const { accountId } = params as { accountId: string }
  const positions = await prisma.position.findMany({ where: { accountId } })
  const trades = await prisma.trade.findMany({ where: { accountId }, orderBy: { executedAt: 'desc' } })

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-6">
          <Card>
            <CardHeader>
              <CardTitle>Open Positions</CardTitle>
            </CardHeader>
            <CardContent>
              {positions.length === 0 ? (
                <div className="text-sm text-muted-foreground">You have no open positions.</div>
              ) : (
                <div className="space-y-2">
                  {/* @ts-ignore */}
                  {positions.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium">{p.symbol}</div>
                        <div className="text-xs text-muted-foreground">Qty: {Number(p.quantity)} @ {Number(p.entryPrice)}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${Number(p.currentPrice).toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">Unrealized: ${Number(p.unrealizedPnl).toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="col-span-12 md:col-span-6">
          <Card>
            <CardHeader>
              <CardTitle>Trade History</CardTitle>
            </CardHeader>
            <CardContent>
              {trades.length === 0 ? (
                <div className="text-sm text-muted-foreground">No trades yet.</div>
              ) : (
                <div className="space-y-2">
                  {/* @ts-ignore */}
                  {trades.map(t => (
                    <div key={t.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium">{t.symbol} — {t.side}</div>
                        <div className="text-xs text-muted-foreground">{format(new Date(t.executedAt), 'PPpp')}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">Qty: {Number(t.quantity)} @ ${Number(t.price).toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">Fee: ${Number(t.fee).toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
