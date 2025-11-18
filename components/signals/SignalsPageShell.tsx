"use client"
import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import SignalsList from "@/components/signals/SignalsList"
import SignalDetailDrawer from "@/components/signals/SignalDetailDrawer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export default function SignalsPageShell() {
  const [selected, setSelected] = useState<any>(null)

  const [symbol, setSymbol] = useState("")
  const [confidence, setConfidence] = useState(60)

  const [debouncedSymbol, setDebouncedSymbol] = useState(symbol)
  const [debouncedConfidence, setDebouncedConfidence] = useState(confidence)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSymbol(symbol)
      setDebouncedConfidence(confidence)
    }, 500) // 500ms debounce delay

    return () => {
      clearTimeout(handler)
    }
  }, [symbol, confidence])

  return (
    <div className="container mx-auto p-4 sm:p-6">
        <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold">Signal Center</h1>
            <p className="text-muted-foreground mt-1">Discover and analyze trading signals from top performers.</p>
        </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4 xl:col-span-3"
        >
          <Card>
            <CardHeader>
                <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Label htmlFor="symbol-filter">Symbol</Label>
                    <Input id="symbol-filter" placeholder="e.g., BTC" value={symbol} onChange={e => setSymbol(e.target.value.toUpperCase())} />
                </div>
                <div>
                    <Label htmlFor="confidence-filter">Minimum Confidence: {confidence}%</Label>
                    <Slider id="confidence-filter" min={0} max={100} value={[confidence]} onValueChange={([val]: number[]) => setConfidence(val)} />
                </div>
            </CardContent>
          </Card>
        </motion.div>
        <div className="lg:col-span-8 xl:col-span-9">
            <SignalsList onSelect={(s) => setSelected(s)} symbol={debouncedSymbol || undefined} confidenceMin={debouncedConfidence} />
        </div>
      </div>

      <SignalDetailDrawer signal={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
