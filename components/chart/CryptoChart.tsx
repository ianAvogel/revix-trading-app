"use client"
import React, { useEffect, useRef, useState } from "react"
import { createChart, type IChartApi, type LineStyleOptions } from "lightweight-charts"

type Props = {
  symbol?: string
  timeframe?: string
}

export default function CryptoChart({ symbol = "BTC", timeframe = "1m" }: Props) {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const chartInstance = useRef<IChartApi | null>(null)
  const [price, setPrice] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [ticks, setTicks] = useState<Array<{ time: number; value: number }>>([])

  useEffect(() => {
    if (!chartRef.current) return

    chartInstance.current = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: 300,
      layout: { background: { color: "#0f172a" }, textColor: "#fff" },
      grid: { vertLines: { color: "#1f2937" }, horzLines: { color: "#1f2937" } },
    })

    const lineSeries = chartInstance.current.addLineSeries({
      color: "#10b981",
      lineWidth: 2,
    })

    // Update periodically by polling the market prices endpoint
    let active = true
    const fetchPrices = async () => {
      try {
        const res = await fetch("/api/market/prices")
        const json = await res.json()
        const symbolData = json.data.find((s: any) => s.symbol === symbol)
        if (symbolData) {
          const now = Date.now() / 1000
          setPrice(symbolData.price)
          setLoading(false)
          setTicks((prev) => {
            const next = [...prev.slice(-200), { time: Math.floor(now), value: symbolData.price }]
            lineSeries.setData(next.map(t => ({ time: t.time, value: t.value } as any)))
            return next
          })
        }
      } catch (err) {
        // ignore
      }
    }

    fetchPrices()
    const id = setInterval(() => { if (active) fetchPrices() }, 2000)

    const onResize = () => {
      if (chartRef.current && chartInstance.current) {
        chartInstance.current.applyOptions({ width: chartRef.current.clientWidth })
      }
    }
    window.addEventListener("resize", onResize)

    return () => {
      active = false
      clearInterval(id)
      window.removeEventListener("resize", onResize)
      chartInstance.current?.remove()
    }
  }, [symbol])

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="text-white font-semibold">{symbol}/USD</div>
        <div className="text-sm text-muted-foreground">{loading ? <span className="animate-pulse bg-slate-700 text-transparent px-4 py-1 rounded">Loading</span> : `$${price!.toFixed(2)}`}</div>
      </div>
      <div ref={chartRef} className="bg-slate-900 rounded-md" />
    </div>
  )
}
