"use client"
import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import SignalsList from "@/components/signals/SignalsList"
import SignalDetailDrawer from "@/components/signals/SignalDetailDrawer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Zap, Target, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function SignalsPageShell() {
  const [selected, setSelected] = useState<any>(null)

  const [symbol, setSymbol] = useState("")
  const [confidence, setConfidence] = useState(60)
  const [signalType, setSignalType] = useState("all")

  const [debouncedSymbol, setDebouncedSymbol] = useState(symbol)
  const [debouncedConfidence, setDebouncedConfidence] = useState(confidence)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSymbol(symbol)
      setDebouncedConfidence(confidence)
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [symbol, confidence])

  const StatBox = ({ icon: Icon, label, value, trend }: any) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-lg ${trend === 'up' ? 'bg-green-100' : trend === 'down' ? 'bg-red-100' : 'bg-blue-100'}`}>
            <Icon className={`h-6 w-6 ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-blue-600'}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold">Signal Center</h1>
        <p className="text-muted-foreground">AI-generated buy/sell signals from real-time technical analysis</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <StatBox icon={Zap} label="Active Signals" value="12" trend="up" />
        <StatBox icon={Target} label="Signal Accuracy" value="78%" trend="up" />
        <StatBox icon={AlertCircle} label="High Confidence" value="5" trend="neutral" />
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Filters Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-3"
        >
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Signal Type */}
              <div>
                <Label className="font-medium mb-3 block">Signal Type</Label>
                <Tabs value={signalType} onValueChange={setSignalType} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="buy">Buy</TabsTrigger>
                    <TabsTrigger value="sell">Sell</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Symbol */}
              <div>
                <Label htmlFor="symbol-filter" className="font-medium mb-2 block">Symbol</Label>
                <Input
                  id="symbol-filter"
                  placeholder="e.g., BTC, ETH"
                  value={symbol}
                  onChange={e => setSymbol(e.target.value.toUpperCase())}
                  className="font-medium"
                />
                <p className="text-xs text-muted-foreground mt-2">Leave blank for all symbols</p>
              </div>

              {/* Confidence */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label htmlFor="confidence-filter" className="font-medium">Minimum Confidence</Label>
                  <Badge variant="secondary">{confidence}%</Badge>
                </div>
                <Slider
                  id="confidence-filter"
                  min={0}
                  max={100}
                  step={5}
                  value={[confidence]}
                  onValueChange={([val]) => setConfidence(val)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Quick Filters */}
              <div>
                <Label className="font-medium mb-2 block">Quick Filters</Label>
                <div className="space-y-2">
                  <button className="w-full px-3 py-2 rounded border border-gray-200 text-sm hover:bg-gray-50 transition text-left">
                    🔥 High Confidence (&gt;80%)
                  </button>
                  <button className="w-full px-3 py-2 rounded border border-gray-200 text-sm hover:bg-gray-50 transition text-left">
                    ⭐ Top Performers Only
                  </button>
                  <button className="w-full px-3 py-2 rounded border border-gray-200 text-sm hover:bg-gray-50 transition text-left">
                    📈 My Watchlist
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Signals List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="lg:col-span-9"
        >
          <SignalsList
            onSelect={(s) => setSelected(s)}
            symbol={debouncedSymbol || undefined}
            confidenceMin={debouncedConfidence}
            type={signalType !== "all" ? signalType : undefined}
          />
        </motion.div>
      </div>

      {/* Signal Detail Drawer */}
      <SignalDetailDrawer signal={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
