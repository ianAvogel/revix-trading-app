"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Trophy, Medal, Crown, Users, TrendingUp, Target, Clock, DollarSign, Flame } from "lucide-react"

type TournamentStanding = {
  rank: number
  userId: string
  userName: string
  userAlias: string
  finalEquity: number | string
  roi: number
  trades: number
  maxDrawdown: number
  winRate: number
  profit: number | string
}

type Tournament = {
  id: string
  name: string
  description: string | null
  startTime: string
  endTime: string
  prizePool: number | string
  entryFee: number | string
  rules?: any
  entries: Array<{ id: string; user: { alias: string } }>
}

export default function TournamentDetailPage() {
  const params = useParams()
  const id = params.id as string
  
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [standings, setStandings] = useState<TournamentStanding[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (id) {
      const fetchTournamentData = async () => {
        try {
          setLoading(true)
          const [tournRes, standingsRes, statsRes] = await Promise.all([
            fetch(`/api/tournaments/${id}`),
            fetch(`/api/tournaments/${id}/standings`),
            fetch(`/api/tournaments/${id}/stats`),
          ])

          const tournData = await tournRes.json()
          const standingsData = await standingsRes.json()
          const statsData = await statsRes.json()

          if (tournData.success) {
            setTournament(tournData.tournament)
            const now = new Date()
            const endTime = new Date(tournData.tournament.endTime)
            setIsActive(now < endTime)
          }
          if (standingsData.success) setStandings(standingsData.standings)
          if (statsData.success) setStats(statsData.stats)
        } catch (error) {
          console.error("Error fetching tournament data:", error)
        } finally {
          setLoading(false)
        }
      }

      fetchTournamentData()
      const interval = setInterval(fetchTournamentData, 10000) // Refresh every 10s
      return () => clearInterval(interval)
    }
  }, [id])

  const handleJoinTournament = async () => {
    try {
      setJoining(true)
      const res = await fetch(`/api/tournaments/${id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      const data = await res.json()
      if (data.success) {
        window.location.reload()
      }
    } catch (error) {
      console.error("Error joining tournament:", error)
    } finally {
      setJoining(false)
    }
  }

  const getMedalColor = (rank: number) => {
    if (rank === 1) return "bg-yellow-100 text-yellow-800 border-yellow-300"
    if (rank === 2) return "bg-gray-100 text-gray-800 border-gray-300"
    if (rank === 3) return "bg-orange-100 text-orange-800 border-orange-300"
    return "bg-slate-50 text-slate-700 border-slate-200"
  }

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5" />
    if (rank === 2) return <Trophy className="h-5 w-5" />
    if (rank === 3) return <Medal className="h-5 w-5" />
    return null
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin mb-3">
            <Trophy className="h-8 w-8 text-purple-600 mx-auto" />
          </div>
          <p className="text-muted-foreground">Loading tournament...</p>
        </div>
      </div>
    )
  }

  if (!tournament) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700">Tournament not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Trophy className="h-8 w-8 text-yellow-500" />
              {tournament.name}
            </h1>
            <p className="text-muted-foreground mt-2">{tournament.description}</p>
          </div>
          {isActive && (
            <Badge className="bg-green-100 text-green-800 border-green-300">LIVE</Badge>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Participants</p>
                  <p className="text-2xl font-bold">{tournament.entries.length}</p>
                </div>
                <Users className="h-6 w-6 text-blue-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Prize Pool</p>
                  <p className="text-2xl font-bold">${parseFloat(tournament.prizePool.toString()).toFixed(0)}</p>
                </div>
                <DollarSign className="h-6 w-6 text-green-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg ROI</p>
                  <p className={`text-2xl font-bold ${stats?.averageROI >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {stats?.averageROI?.toFixed(2)}%
                  </p>
                </div>
                <TrendingUp className="h-6 w-6 text-purple-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ends In</p>
                  <p className="text-2xl font-bold">
                    {Math.max(0, Math.floor((new Date(tournament.endTime).getTime() - Date.now()) / 3600000))}h
                  </p>
                </div>
                <Clock className="h-6 w-6 text-orange-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="standings" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="standings">Standings</TabsTrigger>
          <TabsTrigger value="prizes">Prize Distribution</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
        </TabsList>

        {/* Standings Tab */}
        <TabsContent value="standings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tournament Standings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Rank</TableHead>
                      <TableHead>Trader</TableHead>
                      <TableHead className="text-right">ROI</TableHead>
                      <TableHead className="text-right">Profit</TableHead>
                      <TableHead className="text-right">Win Rate</TableHead>
                      <TableHead className="text-right">Drawdown</TableHead>
                      <TableHead className="text-right">Trades</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {standings.map((standing, idx) => (
                      <motion.tr
                        key={standing.userId}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`border-b ${getMedalColor(standing.rank)}`}
                      >
                        <TableCell className="font-bold">
                          <div className="flex items-center gap-2">
                            {getMedalIcon(standing.rank)}
                            #{standing.rank}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{standing.userAlias}</TableCell>
                        <TableCell className="text-right font-semibold">
                          <span className={standing.roi >= 0 ? "text-green-600" : "text-red-600"}>
                            {standing.roi >= 0 ? "+" : ""}{standing.roi.toFixed(2)}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={parseFloat(standing.profit.toString()) >= 0 ? "text-green-600" : "text-red-600"}>
                            ${parseFloat(standing.profit.toString()).toFixed(0)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-sm">{standing.winRate.toFixed(1)}%</TableCell>
                        <TableCell className="text-right text-sm">{standing.maxDrawdown.toFixed(1)}%</TableCell>
                        <TableCell className="text-right text-sm">{standing.trades}</TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prize Distribution Tab */}
        <TabsContent value="prizes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prize Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((rank) => {
                  const prizePercentage = rank === 1 ? 40 : rank === 2 ? 25 : rank === 3 ? 20 : rank === 4 ? 10 : 5
                  const prizeAmount = (parseFloat(tournament.prizePool.toString()) * prizePercentage) / 100
                  return (
                    <motion.div
                      key={rank}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: rank * 0.1 }}
                    >
                      <Card className={`p-4 ${getMedalColor(rank)}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getMedalIcon(rank)}
                            <span className="font-bold">Place #{rank}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">${prizeAmount.toFixed(0)}</p>
                            <p className="text-sm opacity-75">{prizePercentage}% of pool</p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rules Tab */}
        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>Tournament Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tournament.rules ? (
                <div className="space-y-2">
                  {Object.entries(tournament.rules as Record<string, any>).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center pb-2 border-b">
                      <span className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                      <span className="text-muted-foreground">{JSON.stringify(value)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No specific rules configured</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Join Button */}
      {isActive && (
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleJoinTournament}
            disabled={joining}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg"
          >
            {joining ? "Joining..." : `Join Tournament (${tournament.entryFee})`}
          </Button>
        </div>
      )}
    </div>
  )
}
