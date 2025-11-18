"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { ErrorDisplay } from "@/components/ui/error-display"

type Trade = {
  id: string
  symbol: string
  side: "BUY" | "SELL"
  quantity: number
  price: number
  executedAt: string
}

type Position = {
  id: string;
  symbol: string;
  side: "LONG" | "SHORT";
  quantity: number;
  entryPrice: number;
  unrealizedPnl: number;
  openedAt: string;
}

function TradeHistoryList() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/portfolio/history")
        const data = await res.json()
        if (data.success) {
          setTrades(data.trades)
        } else {
          setError(data.message || "Failed to load trades.")
        }
      } catch (err) {
        setError("An unexpected error occurred.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchTrades()
  }, [])

  const handleExport = async () => {
    try {
      const res = await fetch('/api/trades/export');
      if (!res.ok) throw new Error('Failed to export');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'trade-history.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Export failed", error);
      // You could show an error toast here
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner />
        <span className="ml-2">Loading trade history...</span>
      </div>
    );
  }
  if (error) return <ErrorDisplay title="Could not load Trade History" message={error} />

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Closed Trades</CardTitle>
          <Button onClick={handleExport} variant="outline" size="sm">Export to CSV</Button>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Side</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.length > 0 ? (
                trades.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell>{trade.symbol}</TableCell>
                    <TableCell
                      className={trade.side === "BUY" ? "text-green-500" : "text-red-500"}
                    >
                      {trade.side}
                    </TableCell>
                    <TableCell>{trade.quantity.toFixed(6)}</TableCell>
                    <TableCell>${trade.price.toFixed(2)}</TableCell>
                    <TableCell>{new Date(trade.executedAt).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    You have no closed trades yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function OpenPositionsList() {
  const [positions, setPositions] = useState<Position[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/portfolio/positions")
        const data = await res.json()
        if (data.success) {
          setPositions(data.positions)
        } else {
          setError(data.message || "Failed to load positions.")
        }
      } catch (err) {
        setError("An unexpected error occurred.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchPositions()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner />
        <span className="ml-2">Loading open positions...</span>
      </div>
    );
  }
  if (error) return <ErrorDisplay title="Could not load Open Positions" message={error} />

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
    <Card>
      <CardHeader>
        <CardTitle>Open Positions</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Side</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Entry Price</TableHead>
              <TableHead>Unrealized PnL</TableHead>
              <TableHead>Opened At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions.length > 0 ? (
              positions.map((pos) => (
                <TableRow key={pos.id}>
                  <TableCell>{pos.symbol}</TableCell>
                  <TableCell
                    className={pos.side === "LONG" ? "text-green-500" : "text-red-500"}
                  >
                    {pos.side}
                  </TableCell>
                  <TableCell>{Number(pos.quantity).toFixed(6)}</TableCell>
                  <TableCell>${Number(pos.entryPrice).toFixed(2)}</TableCell>
                  <TableCell className={Number(pos.unrealizedPnl) >= 0 ? "text-green-500" : "text-red-500"}>
                    ${Number(pos.unrealizedPnl).toFixed(2)}
                  </TableCell>
                  <TableCell>{new Date(pos.openedAt).toLocaleString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  You have no open positions.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    </motion.div>
  )
}

export default function PortfolioShell() {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">My Portfolio</h1>
        <Tabs defaultValue="history">
          <TabsList>
            <TabsTrigger value="positions">Open Positions</TabsTrigger>
            <TabsTrigger value="history">Trade History</TabsTrigger>
          </TabsList>
          <TabsContent value="positions">
            <OpenPositionsList />
          </TabsContent>
          <TabsContent value="history">
            <TradeHistoryList />
          </TabsContent>
        </Tabs>
      </div>
    )
  }
