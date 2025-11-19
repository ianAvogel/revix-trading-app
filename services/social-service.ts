/**
 * Social Service
 * Handles following, trader discovery, and social features
 */

import { prisma } from '@/lib/prisma'

export class SocialService {
  /**
   * Follow a trader
   */
  static async followTrader(followerId: string, followingId: string) {
    try {
      // Prevent self-following
      if (followerId === followingId) {
        return { success: false, error: 'Cannot follow yourself' }
      }

      // Check if already following
      const existing = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
      })

      if (existing) {
        return { success: false, error: 'Already following this trader' }
      }

      // Create follow
      const follow = await prisma.follow.create({
        data: {
          followerId,
          followingId,
        },
      })

      return { success: true, follow }
    } catch (error) {
      console.error('Error following trader:', error)
      return { success: false, error: 'Failed to follow trader' }
    }
  }

  /**
   * Unfollow a trader
   */
  static async unfollowTrader(followerId: string, followingId: string) {
    try {
      const result = await prisma.follow.deleteMany({
        where: {
          followerId,
          followingId,
        },
      })

      return { success: result.count > 0 }
    } catch (error) {
      console.error('Error unfollowing trader:', error)
      return { success: false, error: 'Failed to unfollow trader' }
    }
  }

  /**
   * Get follower count for a user
   */
  static async getFollowerCount(userId: string): Promise<number> {
    try {
      const count = await prisma.follow.count({
        where: { followingId: userId },
      })
      return count
    } catch (error) {
      console.error('Error getting follower count:', error)
      return 0
    }
  }

  /**
   * Get following count for a user
   */
  static async getFollowingCount(userId: string): Promise<number> {
    try {
      const count = await prisma.follow.count({
        where: { followerId: userId },
      })
      return count
    } catch (error) {
      console.error('Error getting following count:', error)
      return 0
    }
  }

  /**
   * Check if user is following another user
   */
  static async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    try {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
      })
      return !!follow
    } catch (error) {
      console.error('Error checking follow status:', error)
      return false
    }
  }

  /**
   * Get user's followers
   */
  static async getFollowers(userId: string, limit: number = 100) {
    try {
      const followers = await prisma.follow.findMany({
        where: { followingId: userId },
        include: { follower: true },
        take: limit,
        orderBy: { createdAt: 'desc' },
      })
      return followers.map(f => f.follower)
    } catch (error) {
      console.error('Error getting followers:', error)
      return []
    }
  }

  /**
   * Get user's following
   */
  static async getFollowing(userId: string, limit: number = 100) {
    try {
      const following = await prisma.follow.findMany({
        where: { followerId: userId },
        include: { following: true },
        take: limit,
        orderBy: { createdAt: 'desc' },
      })
      return following.map(f => f.following)
    } catch (error) {
      console.error('Error getting following:', error)
      return []
    }
  }

  /**
   * Get trending traders (most followed)
   */
  static async getTrendingTraders(limit: number = 10) {
    try {
      const traders = await prisma.user.findMany({
        take: limit,
        where: {
          isPublic: true,
        },
        include: {
          _count: {
            select: { followers: true },
          },
        },
        orderBy: {
          followers: {
            _count: 'desc',
          },
        },
      })

      return traders
    } catch (error) {
      console.error('Error getting trending traders:', error)
      return []
    }
  }

  /**
   * Get profile stats for trader
   */
  static async getTraderStats(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          accounts: {
            include: {
              trades: true,
            },
          },
          _count: {
            select: {
              followers: true,
              following: true,
            },
          },
        },
      })

      if (!user) return null

      // Calculate stats
      let totalTrades = 0
      let winningTrades = 0
      let totalROI = 0

      user.accounts.forEach(account => {
        totalTrades += account.trades.length
        account.trades.forEach(trade => {
          if (Number(trade.fee) < 0) winningTrades++
        })
      })

      const stats = {
        followerCount: user._count.followers,
        followingCount: user._count.following,
        totalTrades,
        winRate: totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0,
        verified: totalTrades >= 10 && (winningTrades / Math.max(totalTrades, 1)) > 0.5,
      }

      return stats
    } catch (error) {
      console.error('Error getting trader stats:', error)
      return null
    }
  }
}
