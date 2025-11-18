"use client"
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useTradeModalStore } from "@/stores/tradeModalStore"
import { AlertCircle, TrendingDown, TrendingUp } from "lucide-react"

type Props = {
  open: boolean
  onClose: () => void
  accountId: string
  defaultSymbol?: string
}

export default function TradeModal({ open: propOpen, onClose: propOnClose, accountId: propAccountId, defaultSymbol = "BTC" }: any) {
  const { open, symbol: storeSymbol, side: storeSide, accountId: storeAccountId, closeModal } = useTradeModalStore()
  const isOpen = propOpen ?? open
  const close = () => {
    if (propOnClose) propOnClose()
    closeModal()
  }
  const [symbol, setSymbol] = useState(defaultSymbol)
  const [side, setSide] = useState<"BUY" | "SELL">("BUY")
  const [type, setType] = useState<"MARKET" | "LIMIT">("MARKET")
  const [quantity, setQuantity] = useState<number>(0.01)
  const [limitPrice, setLimitPrice] = useState<number | undefined>(undefined)
  const [slippage, setSlippage] = useState<number>(0.5)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setSubmitting] = useState(false)
  const [currentPrice, setCurrentPrice] = useState<number>(42500) // Mock price

  useEffect(() => {
    setSymbol(storeSymbol ?? defaultSymbol)
    if (storeSide) setSide(storeSide)
  }, [defaultSymbol, storeSymbol, storeSide])

  // Fetch current price
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch(`/api/market/prices?symbol=${symbol}`)
        const data = await res.json()
        if (data.prices && data.prices[symbol]) {
          setCurrentPrice(data.prices[symbol])
        }
      } catch (err) {
        // Use mock price
      }
    }
    fetchPrice()
  }, [symbol])

  if (!isOpen) return null

  const executionPrice = type === "LIMIT" ? (limitPrice ?? currentPrice) : currentPrice
  const totalCost = quantity * executionPrice
  const slippageAmount = totalCost * (slippage / 100)
  const totalWithSlippage = totalCost + slippageAmount

  const confirm = async () => {
    setError(null)
    if (quantity <= 0) return setError("Amount must be > 0")
    if (type === "LIMIT" && !limitPrice) return setError("Limit price required")

    setSubmitting(true)
    try {
        const accountIdToUse = propAccountId ?? storeAccountId
        const res = await fetch("/api/trades/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId: accountIdToUse,
          symbol,
          side,
          type,
          quantity,
          limitPrice,
        })
      })
      const json = await res.json()
      if (!json.success) {
        setError(json.error || "Trade failed")
      } else {
        close()
      }
    } catch (err) {
      setError("Network error")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card>
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {side === "BUY" ? (
                  <TrendingUp className="h-6 w-6 text-green-500" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-red-500" />
                )}
                <div>
                  <div className="text-lg font-semibold">Place {side} Trade</div>
                  <div className="text-sm text-muted-foreground">{symbol}/USD</div>
                </div>
              </div>
              <button
                onClick={close}
                className="text-muted-foreground hover:text-foreground transition"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form Section */}
              <div className="space-y-4">
                {/* Pair */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase">Cryptocurrency</label>
                  <input
                    className="w-full mt-2 p-2 rounded border border-gray-300 bg-white text-sm font-medium"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    placeholder="BTC"
                  />
                </div>

                {/* Side */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase">Side</label>
                  <div className="mt-2 flex gap-2">
                    <Button
                      type="button"
                      variant={side === "BUY" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSide("BUY")}
                      className={side === "BUY" ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      Buy
                    </Button>
                    <Button
                      type="button"
                      variant={side === "SELL" ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => setSide("SELL")}
                    >
                      Sell
                    </Button>
                  </div>
                </div>

                {/* Order Type */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase">Order Type</label>
                  <div className="mt-2 flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={type === "MARKET" ? "default" : "outline"}
                      onClick={() => setType("MARKET")}
                    >
                      Market
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={type === "LIMIT" ? "default" : "outline"}
                      onClick={() => setType("LIMIT")}
                    >
                      Limit
                    </Button>
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase">Amount ({symbol})</label>
                  <input
                    type="number"
                    step="0.0001"
                    min="0"
                    className="w-full mt-2 p-2 rounded border border-gray-300 bg-white text-sm"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    placeholder="0.01"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Current price: ${currentPrice.toLocaleString()}</p>
                </div>

                {/* Limit Price */}
                {type === "LIMIT" && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase">Limit Price (USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full mt-2 p-2 rounded border border-gray-300 bg-white text-sm"
                      value={limitPrice ?? ""}
                      onChange={(e) => setLimitPrice(Number(e.target.value))}
                      placeholder="0.00"
                    />
                  </div>
                )}

                {/* Slippage */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-muted-foreground uppercase">Max Slippage</label>
                    <span className="text-sm font-medium">{slippage.toFixed(1)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.1"
                    value={slippage}
                    onChange={(e) => setSlippage(Number(e.target.value))}
                    className="mt-2 w-full"
                  />
                </div>
              </div>

              {/* Preview Section */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="text-sm font-semibold mb-4">Order Preview</div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Quantity</span>
                  <span className="text-sm font-medium">{quantity} {symbol}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {type === "LIMIT" ? "Limit Price" : "Current Price"}
                  </span>
                  <span className="text-sm font-medium">${executionPrice.toLocaleString()}</span>
                </div>

                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="text-sm font-medium">${totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Slippage ({slippage.toFixed(1)}%)</span>
                  <span className="text-sm font-medium text-orange-600">+${slippageAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>

                <div className="border-t border-gray-200 pt-3 flex justify-between bg-white rounded p-3">
                  <span className="font-medium">Total Cost</span>
                  <span className={`font-semibold ${side === "BUY" ? "text-red-600" : "text-green-600"}`}>
                    ${totalWithSlippage.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                </div>

                {error && (
                  <div className="flex gap-2 bg-destructive/10 text-destructive p-3 rounded text-sm">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3 pt-6 border-t border-gray-200">
              <Button
                onClick={confirm}
                disabled={isSubmitting || quantity <= 0}
                size="default"
                className={side === "BUY" ? "bg-green-600 hover:bg-green-700 flex-1" : "flex-1"}
              >
                {isSubmitting ? "Processing..." : `Confirm ${side}`}
              </Button>
              <Button variant="outline" onClick={close} size="default" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
