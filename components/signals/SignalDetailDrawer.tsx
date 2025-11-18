"use client"
import React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTradeModalStore } from "@/stores/tradeModalStore"

export default function SignalDetailDrawer({ signal, onClose, onApply }: any) {
  const openTradeModal = useTradeModalStore(state => state.openModal)
  if (!signal) return null
  return (
    <div className="fixed right-0 top-0 h-full w-full md:w-1/3 bg-white shadow-lg z-50 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-semibold">Signal Details</div>
        <button onClick={onClose} aria-label="Close">✕</button>
      </div>
      <Card className="p-4">
        <div className="text-sm text-muted-foreground">{signal.symbol} — {signal.direction}</div>
        <div className="mt-2 font-medium">Confidence: {signal.confidence}%</div>
        <div className="mt-4 text-sm">Rationale:</div>
        <ul className="list-disc ml-4 mt-2">
          {(signal.rationale || []).map((r: any, i: number) => (
            <li key={i}>{r.point || JSON.stringify(r)}</li>
          ))}
        </ul>
          <div className="mt-6 flex gap-2">
          <Button onClick={() => {
            // Open trade modal prefilling symbol and side
            openTradeModal({ symbol: signal.symbol, side: signal.direction === 'BUY' ? 'BUY' : 'SELL' })
            if (onApply) onApply(signal)
          }} size="sm">Apply</Button>
          <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
        </div>
      </Card>
    </div>
  )
}
