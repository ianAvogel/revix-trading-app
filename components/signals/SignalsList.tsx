"use client"
import React, { useEffect, useState, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Signal = {
  id: string
  symbol: string
  direction: string
  confidence: number
  rationale: any
  isSaved?: boolean
}

export default function SignalsList({
  onSelect,
  symbol,
  confidenceMin,
}: {
  onSelect?: (sig: Signal) => void
  symbol?: string
  confidenceMin?: number
}) {
  const [signals, setSignals] = useState<Signal[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSignals = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (symbol) params.append("symbol", symbol)
      if (confidenceMin) params.append("confidenceMin", String(confidenceMin))
      const res = await fetch(`/api/signals?${params.toString()}`)
      const json = await res.json()
      if (json.success) setSignals(json.signals)
    } catch (err) {
      console.warn("Failed to load signals")
    } finally {
      setLoading(false)
    }
  }, [symbol, confidenceMin])

  useEffect(() => {
    fetchSignals()
  }, [fetchSignals])

  const handleSaveToggle = async (signalId: string, isSaved: boolean) => {
    const originalSignals = [...signals]
    // Optimistically update UI
    setSignals(currentSignals =>
      currentSignals.map(s =>
        s.id === signalId ? { ...s, isSaved: !isSaved } : s
      )
    )

    try {
      await fetch("/api/signals/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signalId, action: isSaved ? "UNSAVE" : "SAVE" }),
      })
      // No need to re-fetch, optimistic update is enough
    } catch (error) {
      console.error("Failed to save signal", error)
      // Revert on error
      setSignals(originalSignals)
    }
  }

  if (loading) return <div className="p-2">Loading signals...</div>

  return (
    <div className="space-y-2">
      {signals.map((s) => (
        <Card key={s.id} className="p-3 flex items-center justify-between">
          <div>
            <div className="font-medium">
              {s.symbol} <span className="text-xs text-muted-foreground">{s.direction}</span>
            </div>
            <div className="text-sm text-muted-foreground">Confidence: {s.confidence}%</div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => onSelect && onSelect(s)}>
              View
            </Button>
            <Button
              variant={s.isSaved ? "default" : "outline"}
              size="sm"
              onClick={() => handleSaveToggle(s.id, !!s.isSaved)}
            >
              {s.isSaved ? "Saved" : "Save"}
            </Button>
          </div>
        </Card>
      ))}
      {signals.length === 0 && !loading && (
        <div className="p-2 text-center text-muted-foreground">No signals match your criteria.</div>
      )}
    </div>
  )
}
