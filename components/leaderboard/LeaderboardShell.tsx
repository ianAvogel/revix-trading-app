"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Spinner } from "@/components/ui/spinner"
import { ErrorDisplay } from "@/components/ui/error-display"

type LeaderboardEntry = {
  id: string
  rank: number
  roi: number
  maxDrawdown: number
  riskScore: number
  user: {
    alias: string
    avatarUrl: string | null
  }
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-right">ROI</TableHead>
                <TableHead className="text-right">Max Drawdown</TableHead>
                <TableHead className="text-right">Risk Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.length > 0 ? (
                entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.rank}</TableCell>
                    <TableCell>
                      <Link href={`/u/${entry.user.alias}`} className="hover:underline">
                        {entry.user.alias}
                      </Link>
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${Number(entry.roi) >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {Number(entry.roi).toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right">{Number(entry.maxDrawdown).toFixed(2)}%</TableCell>
                    <TableCell className="text-right">{Number(entry.riskScore).toFixed(2)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No entries on the leaderboard yet.
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

export default function LeaderboardShell() {
  const [period, setPeriod] = useState("GLOBAL")

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Leaderboards</h1>
      <Tabs value={period} onValueChange={setPeriod}>
        <TabsList>
          <TabsTrigger value="GLOBAL">Global</TabsTrigger>
          <TabsTrigger value="WEEKLY" disabled>Weekly</TabsTrigger>
          <TabsTrigger value="FRIENDS" disabled>Friends</TabsTrigger>
          <TabsTrigger value="TOURNAMENTS" disabled>Tournaments</TabsTrigger>
        </TabsList>
        <Card className="mt-4">
          <CardContent className="p-6">
            <TabsContent value="GLOBAL">
              <LeaderboardTable period="GLOBAL" />
            </TabsContent>
            {/* Other tabs will be implemented later */}
          </CardContent>
        </Card>
      </Tabs>
    </div>
  )
}
