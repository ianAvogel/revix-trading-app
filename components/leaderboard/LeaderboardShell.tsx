"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Spinner } from "@/components/ui/spinner"
import { ErrorDisplay } from "@/components/ui/error-display"
import { Trophy, Medal, Target, Crown, Flame } from "lucide-react"

type LeaderboardEntry = {
  id: string
  rank: number
  roi: number
  maxDrawdown: number
  riskScore: number
  totalTrades: number
  winRate: number
  user: {
    alias: string
    avatarUrl: string | null
  }
}

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />
  if (rank === 2) return <Trophy className="h-5 w-5 text-gray-400" />
  if (rank === 3) return <Medal className="h-5 w-5 text-orange-500" />
  return null
}

const getMedalColor = (rank: number) => {
  if (rank === 1) return "bg-yellow-100 text-yellow-800"
  if (rank === 2) return "bg-gray-100 text-gray-800"
  if (rank === 3) return "bg-orange-100 text-orange-800"
  return "bg-gray-50"
}

function LeaderboardTable({ period }: { period: string }) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/leaderboard?period=${period}`)
        const data = await res.json()
        if (data.success) {
          setEntries(data.leaderboard)
        } else {
          setError(data.message || "Failed to load leaderboard.")
        }
      } catch (err) {
        setError("An unexpected error occurred.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchLeaderboard()
  }, [period])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner />
        <span className="ml-2">Loading {period.toLowerCase()} leaderboard...</span>
      </div>
    );
  }
  if (error) return <ErrorDisplay title={`Could not load ${period} Leaderboard`} message={error} />

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardContent className="overflow-x-auto pt-6">
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No entries on the leaderboard yet.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[60px] text-center">Rank</TableHead>
                  <TableHead>Trader</TableHead>
                  <TableHead className="text-right">ROI</TableHead>
                  <TableHead className="text-right">Win Rate</TableHead>
                  <TableHead className="text-right">Total Trades</TableHead>
                  <TableHead className="text-right">Max Drawdown</TableHead>
                  <TableHead className="text-right">Risk Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry, idx) => (
                  <motion.tr
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`${getMedalColor(entry.rank)} border-b hover:bg-opacity-75 transition-colors`}
                  >
                    <TableCell className="font-bold text-center">
                      <div className="flex items-center justify-center gap-2">
                        {getRankIcon(entry.rank)}
                        <span className="text-lg"># {entry.rank}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link href={`/u/${entry.user.alias}`} className="hover:underline font-medium flex items-center gap-2">
                        {entry.rank <= 3 && <Flame className="h-4 w-4 text-orange-500" />}
                        {entry.user.alias}
                      </Link>
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${Number(entry.roi) >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {Number(entry.roi) >= 0 ? "+" : ""}{Number(entry.roi).toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {Number(entry.winRate).toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-right">{entry.totalTrades}</TableCell>
                    <TableCell className="text-right text-gray-600">
                      {Number(entry.maxDrawdown).toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={Number(entry.riskScore) < 30 ? "default" : "secondary"}>
                        {Number(entry.riskScore).toFixed(1)}
                      </Badge>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function LeaderboardShell() {
  const [period, setPeriod] = useState("GLOBAL")

  const StatBox = ({ icon: Icon, label, value }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-2xl font-bold mt-1">{value}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Icon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">Leaderboards</h1>
        <p className="text-muted-foreground mt-1">Compete with other traders and climb the rankings</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <StatBox icon={Trophy} label="Total Traders" value="1,247" />
        <StatBox icon={Crown} label="Top ROI" value="+456.8%" />
        <StatBox icon={Medal} label="Avg Win Rate" value="62.3%" />
        <StatBox icon={Target} label="Active Tournaments" value="8" />
      </motion.div>

      {/* Leaderboards Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs value={period} onValueChange={setPeriod} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="GLOBAL">Global</TabsTrigger>
            <TabsTrigger value="WEEKLY">Weekly</TabsTrigger>
            <TabsTrigger value="MONTHLY">Monthly</TabsTrigger>
            <TabsTrigger value="TOURNAMENTS">Tournaments</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="GLOBAL">
              <div className="space-y-4">
                <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">Global Rankings</h3>
                    <p className="text-sm text-muted-foreground">
                      All-time leaderboard based on ROI, win rate, and risk management
                    </p>
                  </CardContent>
                </Card>
                <LeaderboardTable period="GLOBAL" />
              </div>
            </TabsContent>

            <TabsContent value="WEEKLY">
              <div className="space-y-4">
                <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">Weekly Leaderboard</h3>
                    <p className="text-sm text-muted-foreground">
                      Top performers this week • Reset every Monday
                    </p>
                  </CardContent>
                </Card>
                <LeaderboardTable period="WEEKLY" />
              </div>
            </TabsContent>

            <TabsContent value="MONTHLY">
              <div className="space-y-4">
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">Monthly Leaderboard</h3>
                    <p className="text-sm text-muted-foreground">
                      Top performers this month • Resets on the 1st
                    </p>
                  </CardContent>
                </Card>
                <LeaderboardTable period="MONTHLY" />
              </div>
            </TabsContent>

            <TabsContent value="TOURNAMENTS">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Tournaments</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { name: "Bitcoin Bull Run", prize: "$500", participants: 324, timeLeft: "5 days" },
                      { name: "Altcoin Hunter", prize: "$250", participants: 218, timeLeft: "3 days" },
                      { name: "Steady Gains", prize: "$300", participants: 445, timeLeft: "12 days" },
                    ].map((tournament, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                      >
                        <div>
                          <div className="font-semibold flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-yellow-500" />
                            {tournament.name}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {tournament.participants} participants • {tournament.timeLeft} remaining
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">{tournament.prize}</div>
                          <div className="text-xs text-muted-foreground">Prize pool</div>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>
    </div>
  )
}
