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

const CryptoChart = dynamic(() => import("@/components/chart/CryptoChart"), { ssr: false })

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};


export default function DashboardShell({ initialAccount }: any) {
  const [isOpen, setOpen] = useState(false)
  // initialAccount passed for SSR rendering
  const [account, setAccount] = useState(initialAccount || { name: "Demo Account", equity: 50000, balance: 50000, roi: 0 })
  const [wsLatencyMs, setWsLatencyMs] = useState<number | null>(null)

  const { replayTimestamp } = useTimeStore();

  useEffect(() => {
    const loadAccount = async () => {
      try {
        const url = replayTimestamp 
          ? `/api/accounts/me?timestamp=${replayTimestamp.toISOString()}` 
          : "/api/accounts/me";
        const res = await fetch(url);
        const json = await res.json();
        if (json?.success && json.account) {
          setAccount(json.account);
        }
      } catch (err) {
        console.warn("Could not fetch account");
      }
    };
    loadAccount();
  }, [replayTimestamp]);

  useEffect(() => {
    let mounted = true;
    const ping = async () => {
      try {
        const start = Date.now();
        const url = replayTimestamp 
          ? `/api/market/prices?timestamp=${replayTimestamp.toISOString()}` 
          : "/api/market/prices";
        const res = await fetch(url);
        await res.json();
        const end = Date.now();
        if (mounted) setWsLatencyMs(end - start);
      } catch (err) {
        // no-op
      }
    };
    ping();
    const id = setInterval(ping, 3000);
    return () => { mounted = false; clearInterval(id); };
  }, [replayTimestamp]);

  return (
    <div className="container mx-auto p-4 md:p-6">
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="lg:col-span-3 space-y-6" variants={itemVariants}>
          <VirtualAccountCard account={account} />
          <TimeTravelControls />
        </motion.div>
        <motion.div className="lg:col-span-6" variants={itemVariants}>
          <Card>
            <div className="p-4 relative">
              <div className="absolute right-4 top-4 flex items-center gap-2 z-10">
                <div className={"h-2 w-2 rounded-full " + (wsLatencyMs !== null && wsLatencyMs < 1000 ? "bg-green-400" : "bg-yellow-500")} />
                <div className="text-xs text-muted-foreground">{wsLatencyMs ? `${wsLatencyMs}ms` : "—"}</div>
              </div>
              <CryptoChart symbol="BTC" timeframe="1m" />
            </div>
          </Card>
        </motion.div>
        <motion.div className="lg:col-span-3 space-y-6" variants={itemVariants}>
          <MentorCard signal={{ headline: "Long BTC — break above 30k", confidence: 84, shortExplain: "Momentum growing with MA crossover and low RSI." }} />
          <Card>
            <div className="p-4">
              <div className="text-sm font-medium">Notifications</div>
              <div className="text-xs text-muted-foreground mt-2">No new alerts.</div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div className="mt-6" variants={itemVariants} initial="hidden" animate="visible">
        <Card>
            <div className="p-4">
                <div className="text-sm font-medium">Activity Feed</div>
                <div className="text-xs text-muted-foreground mt-2">No trades yet. Start with the Mentor&apos;s suggested trade.</div>
            </div>
        </Card>
      </motion.div>

      <div className="fixed bottom-8 right-8">
        <Button size="lg" onClick={() => setOpen(true)}>Quick Trade</Button>
      </div>

      <TradeModal open={isOpen} onClose={() => setOpen(false)} accountId={account?.id ?? "demo-account"} defaultSymbol={"BTC"} />
      <ChatDrawer accountId={account?.id} />
    </div>
  )
}
