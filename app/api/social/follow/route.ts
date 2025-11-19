import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { SocialService } from '@/services/social-service'

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { followingId } = await request.json()

    if (!followingId) {
      return NextResponse.json({ error: 'followingId required' }, { status: 400 })
    }

    const result = await SocialService.followTrader(session.user.id, followingId)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in follow endpoint:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const followingId = searchParams.get('followingId')

    if (!followingId) {
      return NextResponse.json({ error: 'followingId required' }, { status: 400 })
    }

    const result = await SocialService.unfollowTrader(session.user.id, followingId)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in unfollow endpoint:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
