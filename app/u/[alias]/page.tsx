"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Trophy, TrendingUp, TrendingDown, Target, Heart, Share2, Medal } from "lucide-react"

type ProfileData = {
  user: {
    alias: string
    email?: string
    createdAt: string
  }
  stats: {
    rank: number
    roi: number
    totalTrades: number
    winRate: number
    maxDrawdown: number
    totalPnL: number
    averageReturnPerTrade: number
  }
  recentTrades: Array<{
    id: string
    symbol: string
    side: "BUY" | "SELL"
    quantity: number
    price: number
    pnl: number
    timestamp: string
  }>
  isPublic: boolean
}

export default function PublicProfilePage() {
  const params = useParams()
  const alias = params.alias as string
  
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/users/${alias}`)
        const data = await res.json()
        
        if (data.success && data.profile) {
          setProfile(data.profile)
        } else {
          setError(data.message || "Profile not found")
        }
      } catch (err) {
        setError("Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    if (alias) {
      fetchProfile()
    }
  }, [alias])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Spinner />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-lg font-semibold mb-2">Profile Not Found</p>
            <p className="text-muted-foreground">{error || "We couldn't find this trader's profile."}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profile.isPublic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-lg font-semibold mb-2">Profile Private</p>
            <p className="text-muted-foreground">This trader's profile is private.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const StatCard = ({ icon: Icon, label, value, trend }: any) => (
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
            <div className={`p-3 rounded-lg ${trend === 'up' ? 'bg-green-100' : trend === 'down' ? 'bg-red-100' : 'bg-blue-100'}`}>
              <Icon className={`h-6 w-6 ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-blue-600'}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                  <span className="text-3xl font-bold">{profile.user.alias.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{profile.user.alias}</h1>
                  <p className="text-purple-100 text-sm">Member since {new Date(profile.user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="bg-white/20 border-white text-white hover:bg-white/30">
                <Heart className="h-4 w-4 mr-2" />
                Follow
              </Button>
              <Button variant="outline" className="bg-white/20 border-white text-white hover:bg-white/30">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <StatCard
              icon={Medal}
              label="Rank"
              value={`#${profile.stats.rank}`}
              trend="neutral"
            />
          </div>
          <StatCard
            icon={profile.stats.roi >= 0 ? TrendingUp : TrendingDown}
            label="Total ROI"
            value={`${profile.stats.roi >= 0 ? '+' : ''}${profile.stats.roi.toFixed(2)}%`}
            trend={profile.stats.roi >= 0 ? 'up' : 'down'}
          />
          <StatCard
            icon={Target}
            label="Win Rate"
            value={`${profile.stats.winRate.toFixed(1)}%`}
            trend={profile.stats.winRate > 50 ? 'up' : 'down'}
          />
          <StatCard
            icon={Trophy}
            label="Total P&L"
            value={`$${profile.stats.totalPnL.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            trend={profile.stats.totalPnL >= 0 ? 'up' : 'down'}
          />
        </motion.div>

        {/* Detailed Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Trading Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Trades:</span>
                <span className="font-semibold">{profile.stats.totalTrades}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Return:</span>
                <span className={`font-semibold ${profile.stats.averageReturnPerTrade >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {profile.stats.averageReturnPerTrade >= 0 ? '+' : ''}{profile.stats.averageReturnPerTrade.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Drawdown:</span>
                <span className="font-semibold text-orange-600">{profile.stats.maxDrawdown.toFixed(2)}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Win Rate</span>
                  <span className="font-semibold">{profile.stats.winRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${profile.stats.winRate}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Risk Score</span>
                  <span className="font-semibold">7.2/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: "72%" }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Badges & Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="secondary" className="block w-full text-center py-2">
                  ⭐ Rising Star
                </Badge>
                <Badge variant="secondary" className="block w-full text-center py-2">
                  🔥 Hot Streak
                </Badge>
                <Badge variant="secondary" className="block w-full text-center py-2">
                  📈 Trending Up
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Trades */}
        {profile.recentTrades && profile.recentTrades.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Trades</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Side</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>P&L</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profile.recentTrades.map((trade) => (
                      <TableRow key={trade.id}>
                        <TableCell className="font-medium">{trade.symbol}</TableCell>
                        <TableCell>
                          <Badge variant={trade.side === 'BUY' ? 'default' : 'destructive'}>
                            {trade.side}
                          </Badge>
                        </TableCell>
                        <TableCell>{trade.quantity.toFixed(6)}</TableCell>
                        <TableCell>${trade.price.toLocaleString()}</TableCell>
                        <TableCell className={trade.pnl >= 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                          {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)}%
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(trade.timestamp).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
