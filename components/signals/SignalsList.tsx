"use client"
import React, { useEffect, useState, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Zap, Target, AlertCircle } from "lucide-react"

type Signal = {
  id: string
  symbol: string
  direction: "BUY" | "SELL" | "HOLD"
  confidence: number
  technicalScore?: number
  sentimentScore?: number
  riskLevel?: "LOW" | "MEDIUM" | "HIGH"
  targetPrice?: number
  stopLoss?: number
  riskRewardRatio?: number
  rationale: any
  indicators?: string[]
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
  const [useAI, setUseAI] = useState(true)

  const fetchSignals = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (symbol) params.append("symbol", symbol)
      if (confidenceMin) params.append("confidenceMin", String(confidenceMin))
      params.append("useAI", String(useAI))
      
      const res = await fetch(`/api/signals?${params.toString()}`)
      const json = await res.json()
      if (json.success) setSignals(json.signals)
    } catch (err) {
      console.warn("Failed to load signals")
    } finally {
      setLoading(false)
    }
  }, [symbol, confidenceMin, useAI])

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
    } catch (error) {
      console.error("Failed to save signal", error)
      setSignals(originalSignals)
    }
  }

  const getDirectionIcon = (direction: string) => {
    return direction === "BUY" ? (
      <TrendingUp className="h-5 w-5 text-green-600" />
    ) : (
      <TrendingDown className="h-5 w-5 text-red-600" />
    )
  }

  const getDirectionColor = (direction: string) => {
    return direction === "BUY"
      ? "bg-green-50 border-green-200"
      : direction === "SELL"
        ? "bg-red-50 border-red-200"
        : "bg-gray-50 border-gray-200"
  }

  const getConfidenceBadgeColor = (confidence: number) => {
    if (confidence >= 80) return "bg-green-100 text-green-800"
    if (confidence >= 60) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin mb-3">
            <Zap className="h-8 w-8 text-purple-600 mx-auto" />
          </div>
          <p className="text-sm text-muted-foreground">Analyzing signals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* AI Toggle */}
      <div className="flex gap-2">
        <Button
          variant={useAI ? "default" : "outline"}
          size="sm"
          onClick={() => setUseAI(true)}
          className="flex-1"
        >
          <Zap className="h-4 w-4 mr-1" />
          AI Signals
        </Button>
        <Button
          variant={!useAI ? "default" : "outline"}
          size="sm"
          onClick={() => setUseAI(false)}
          className="flex-1"
        >
          Database
        </Button>
      </div>

      {signals.map((s, idx) => (
        <motion.div
          key={s.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
        >
          <Card
            className={`p-4 border-l-4 cursor-pointer transition-all hover:shadow-lg ${getDirectionColor(s.direction)} ${
              s.direction === "BUY"
                ? "border-l-green-600"
                : s.direction === "SELL"
                  ? "border-l-red-600"
                  : "border-l-gray-600"
            }`}
            onClick={() => onSelect && onSelect(s)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Header */}
                <div className="flex items-center gap-3 mb-2">
                  {getDirectionIcon(s.direction)}
                  <span className="text-lg font-bold">{s.symbol}</span>
                  <Badge className="text-xs">{s.direction}</Badge>
                  <Badge className={`text-xs ${getConfidenceBadgeColor(s.confidence)}`}>
                    {s.confidence}% confidence
                  </Badge>
                </div>

                {/* Scores */}
                {(s.technicalScore || s.sentimentScore) && (
                  <div className="flex gap-4 mb-3 text-sm">
                    {s.technicalScore && (
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-600" />
                        <span>Technical: {s.technicalScore}%</span>
                      </div>
                    )}
                    {s.sentimentScore && (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-purple-600" />
                        <span>Sentiment: {s.sentimentScore}%</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Risk & Targets */}
                {(s.riskLevel || s.riskRewardRatio) && (
                  <div className="flex gap-3 text-sm mb-3">
                    {s.riskLevel && (
                      <Badge
                        variant="outline"
                        className={
                          s.riskLevel === "LOW"
                            ? "border-green-500 text-green-700"
                            : s.riskLevel === "MEDIUM"
                              ? "border-yellow-500 text-yellow-700"
                              : "border-red-500 text-red-700"
                        }
                      >
                        {s.riskLevel} Risk
                      </Badge>
                    )}
                    {s.riskRewardRatio && (
                      <span className="text-muted-foreground">
                        R/R: {s.riskRewardRatio.toFixed(2)}:1
                      </span>
                    )}
                  </div>
                )}

                {/* Indicators */}
                {s.rationale?.indicators && s.rationale.indicators.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-1">Triggered by:</p>
                    <div className="flex flex-wrap gap-1">
                      {s.rationale.indicators.map((indicator: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {indicator}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Targets & Stops */}
                {(s.targetPrice || s.stopLoss) && (
                  <div className="text-xs text-muted-foreground space-y-1">
                    {s.targetPrice && (
                      <div>
                        Target: <span className="font-semibold text-green-600">${s.targetPrice.toFixed(2)}</span>
                      </div>
                    )}
                    {s.stopLoss && (
                      <div>
                        Stop Loss: <span className="font-semibold text-red-600">${s.stopLoss.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 ml-4">
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelect && onSelect(s)
                  }}
                  className="text-xs"
                >
                  Details
                </Button>
                <Button
                  variant={s.isSaved ? "default" : "outline"}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSaveToggle(s.id, !!s.isSaved)
                  }}
                  className="text-xs"
                >
                  {s.isSaved ? "✓ Saved" : "Save"}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}

      {signals.length === 0 && !loading && (
        <div className="p-8 text-center text-muted-foreground">
          <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No signals match your criteria.</p>
        </div>
      )}
    </div>
  )
}
