"use client"
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useTradeModalStore } from "@/stores/tradeModalStore"

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

  useEffect(() => {
    setSymbol(storeSymbol ?? defaultSymbol)
    if (storeSide) setSide(storeSide)
  }, [defaultSymbol, storeSymbol, storeSide])

  if (!isOpen) return null

  const confirm = async () => {
    setError(null)
    if (quantity <= 0) return setError("Amount must be > 0")

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-3xl">
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">Place Trade</div>
              <button onClick={close} aria-label="Close">✕</button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">Pair</label>
                <input className="w-full mt-1 p-2 rounded border bg-transparent" value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Side</label>
                <div className="mt-1 flex gap-2">
                  <Button variant={side === "BUY" ? "default" : "outline"} size="sm" onClick={() => setSide("BUY")}>Buy</Button>
                  <Button variant={side === "SELL" ? "destructive" : "outline"} size="sm" onClick={() => setSide("SELL")}>Sell</Button>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">Order Type</label>
                <div className="mt-1 flex gap-2">
                  <Button size="sm" variant={type === "MARKET" ? "default" : "outline"} onClick={() => setType("MARKET")}>Market</Button>
                  <Button size="sm" variant={type === "LIMIT" ? "default" : "outline"} onClick={() => setType("LIMIT")}>Limit</Button>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Amount</label>
                <input type="number" step="0.0001" min="0" className="w-full mt-1 p-2 rounded border bg-transparent" value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
              </div>
            </div>

            {type === "LIMIT" && (
              <div className="mt-4">
                <label className="text-xs text-muted-foreground">Limit Price</label>
                <input type="number" step="0.01" className="w-full mt-1 p-2 rounded border bg-transparent" value={limitPrice ?? ""} onChange={e => setLimitPrice(Number(e.target.value))} />
              </div>
            )}

            <div className="mt-4">
              <label className="text-xs text-muted-foreground">Slippage ({slippage}%)</label>
              <input type="range" min="0" max="5" step="0.1" value={slippage} onChange={e => setSlippage(Number(e.target.value))} className="mt-2 w-full" />
            </div>

            {error && <div className="mt-4 text-sm text-destructive">{error}</div>}

            <div className="mt-4 flex items-center gap-2">
              <Button onClick={confirm} disabled={isSubmitting} size="default">Confirm</Button>
              <Button variant="outline" onClick={close} size="default">Cancel</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
