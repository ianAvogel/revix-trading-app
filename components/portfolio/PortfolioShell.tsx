"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { ErrorDisplay } from "@/components/ui/error-display"
import { TrendingUp, TrendingDown, Wallet, PieChart } from "lucide-react"

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
    const [stats, setStats] = useState({
      totalDeposited: 50000,
      currentValue: 50000,
      totalPnL: 0,
      winRate: 0,
      totalTrades: 0,
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      const fetchStats = async () => {
        try {
          // Simulate fetching portfolio stats
          const positions = await fetch("/api/portfolio/positions").then(r => r.json())
          const trades = await fetch("/api/portfolio/history").then(r => r.json())
          
          let totalPnL = 0
          if (positions.positions) {
            positions.positions.forEach((p: any) => {
              totalPnL += Number(p.unrealizedPnl) || 0
            })
          }
          
          const totalTrades = trades.trades?.length || 0
          const winningTrades = trades.trades?.filter((t: any) => t.pnl > 0).length || 0
          
          setStats({
            totalDeposited: 50000,
            currentValue: 50000 + totalPnL,
            totalPnL,
            winRate: totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0,
            totalTrades,
          })
        } catch (err) {
          // Use defaults
        } finally {
          setLoading(false)
        }
      }
      fetchStats()
    }, [])

    const StatCard = ({ icon: Icon, label, value, color }: any) => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-gray-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
              <div className={`p-3 rounded-lg ${color}`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )

    return (
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Portfolio</h1>
          <p className="text-muted-foreground">Track your trades and open positions</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            icon={Wallet}
            label="Current Value"
            value={`$${stats.currentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
            color="bg-blue-500"
          />
          <StatCard
            icon={stats.totalPnL >= 0 ? TrendingUp : TrendingDown}
            label="Total P&L"
            value={`$${stats.totalPnL.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
            color={stats.totalPnL >= 0 ? "bg-green-500" : "bg-red-500"}
          />
          <StatCard
            icon={PieChart}
            label="ROI"
            value={`${((stats.totalPnL / stats.totalDeposited) * 100).toFixed(2)}%`}
            color={stats.totalPnL >= 0 ? "bg-purple-500" : "bg-orange-500"}
          />
          <StatCard
            icon={TrendingUp}
            label="Win Rate"
            value={`${stats.winRate.toFixed(1)}%`}
            color="bg-indigo-500"
          />
          <StatCard
            icon={Wallet}
            label="Total Trades"
            value={stats.totalTrades}
            color="bg-cyan-500"
          />
        </div>

        {/* Positions and History Tabs */}
        <Tabs defaultValue="positions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="positions">Open Positions</TabsTrigger>
            <TabsTrigger value="history">Trade History</TabsTrigger>
          </TabsList>
          <TabsContent value="positions" className="space-y-4">
            <OpenPositionsList />
          </TabsContent>
          <TabsContent value="history" className="space-y-4">
            <TradeHistoryList />
          </TabsContent>
        </Tabs>
      </div>
    )
  }
