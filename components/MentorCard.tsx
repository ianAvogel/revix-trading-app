"use client"
import React from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTradeModalStore } from "@/stores/tradeModalStore"

type Props = {
  signal?: {
    headline?: string
    confidence?: number
    shortExplain?: string
  }
}

export default function MentorCard({ signal }: Props) {
  const openTradeModal = useTradeModalStore(state => state.openModal)
  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>AI Mentor</CardTitle>
        <div className="text-sm text-muted-foreground">Top signal & explainers</div>
      </CardHeader>
      <CardContent>
        {signal ? (
          <div>
            <div className="font-medium">{signal.headline}</div>
            <div className="text-xs text-muted-foreground">Confidence: {signal.confidence}%</div>
            <div className="mt-2 text-sm">{signal.shortExplain}</div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No signal available</div>
        )}
      </CardContent>
      <CardFooter>
          <div className="flex gap-2 w-full"> 
          <Button className="w-full" size="sm" onClick={() => openTradeModal({ symbol: signal?.headline?.split(' ')[0] ?? 'BTC', side: 'BUY' })}>Apply</Button>
          <Button variant="outline" className="w-full" size="sm">Ignore</Button>
        </div>
      </CardFooter>
    </Card>
  )
}
