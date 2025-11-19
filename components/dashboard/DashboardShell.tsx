"use client"
import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import VirtualAccountCard from "@/components/VirtualAccountCard"
import MentorCard from "@/components/MentorCard"
import dynamic from "next/dynamic"
import TradeModal from "@/components/trade/TradeModal"
import ChatDrawer from "@/components/mentor/ChatDrawer"
import { Button } from "@/components/ui/button"
import { TimeTravelControls } from "@/components/TimeTravelControls"
import { useTimeStore } from "@/stores/timeStore"
import { Card } from "@/components/ui/card"
import {
  containerVariants,
  itemVariants,
} from "@/lib/animation-presets"

const CryptoChart = dynamic(() => import("@/components/chart/CryptoChart"), { ssr: false })

export default function DashboardShell({ initialAccount }: any) {
  const [isOpen, setOpen] = useState(false)
  const [account, setAccount] = useState(initialAccount || {
    name: "Demo Account",
    equity: 50000,
    balance: 50000,
    roi: 0,
  })
  const [wsLatencyMs, setWsLatencyMs] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  const { replayTimestamp } = useTimeStore()

  // Detect mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Load account data
  useEffect(() => {
    const loadAccount = async () => {
      try {
        const url = replayTimestamp
          ? `/api/accounts/me?timestamp=${replayTimestamp.toISOString()}`
          : "/api/accounts/me"
        const res = await fetch(url)
        const json = await res.json()
        if (json?.success && json.account) {
          setAccount(json.account)
        }
      } catch (err) {
        console.warn("Could not fetch account")
      }
    }
    loadAccount()
  }, [replayTimestamp])

  // Monitor WebSocket latency
  useEffect(() => {
    let mounted = true
    const ping = async () => {
      try {
        const start = Date.now()
        const url = replayTimestamp
          ? `/api/market/prices?timestamp=${replayTimestamp.toISOString()}`
          : "/api/market/prices"
        const res = await fetch(url)
        await res.json()
        const end = Date.now()
        if (mounted) setWsLatencyMs(end - start)
      } catch (err) {
        // no-op
      }
    }
    ping()
    const id = setInterval(ping, 3000)
    return () => {
      mounted = false
      clearInterval(id)
    }
  }, [replayTimestamp])

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4 md:py-6">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Sidebar - Responsive */}
        <motion.div
          className="lg:col-span-3 space-y-4 md:space-y-6"
          variants={itemVariants}
        >
          <VirtualAccountCard account={account} />
          <TimeTravelControls />
        </motion.div>

        {/* Center - Chart - Full width on mobile, responsive on desktop */}
        <motion.div
          className="md:col-span-2 lg:col-span-6"
          variants={itemVariants}
        >
          <Card>
            <div className="p-3 sm:p-4 relative">
              <div className="absolute right-3 sm:right-4 top-3 sm:top-4 flex items-center gap-2 z-10">
                <div
                  className={
                    "h-2 w-2 rounded-full " +
                    (wsLatencyMs !== null && wsLatencyMs < 1000
                      ? "bg-green-400"
                      : "bg-yellow-500")
                  }
                />
                <div className="text-xs text-muted-foreground">
                  {wsLatencyMs ? `${wsLatencyMs}ms` : "—"}
                </div>
              </div>
              <CryptoChart symbol="BTC" timeframe="1m" />
            </div>
          </Card>
        </motion.div>

        {/* Right Sidebar - Responsive */}
        <motion.div
          className="md:col-span-2 lg:col-span-3 space-y-4 md:space-y-6"
          variants={itemVariants}
        >
          <MentorCard
            signal={{
              headline: "Long BTC — break above 30k",
              confidence: 84,
              shortExplain: "Momentum growing with MA crossover and low RSI.",
            }}
          />
          <Card>
            <div className="p-3 sm:p-4">
              <div className="text-sm font-medium">Notifications</div>
              <div className="text-xs text-muted-foreground mt-2">
                No new alerts.
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Activity Feed - Full width, responsive padding */}
      <motion.div
        className="mt-4 md:mt-6"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <Card>
          <div className="p-3 sm:p-4">
            <div className="text-sm font-medium">Activity Feed</div>
            <div className="text-xs text-muted-foreground mt-2">
              No trades yet. Start with the Mentor&apos;s suggested trade.
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Floating Action Button - Position optimized for mobile */}
      <div className={isMobile ? "fixed bottom-6 right-4 z-40" : "fixed bottom-8 right-8 z-40"}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size={isMobile ? "lg" : "lg"}
            onClick={() => setOpen(true)}
            className="w-full sm:w-auto"
          >
            Quick Trade
          </Button>
        </motion.div>
      </div>

      {/* Modals */}
      <TradeModal
        open={isOpen}
        onClose={() => setOpen(false)}
        accountId={account?.id ?? "demo-account"}
        defaultSymbol="BTC"
      />
      <ChatDrawer accountId={account?.id} />
    </div>
  )
}
