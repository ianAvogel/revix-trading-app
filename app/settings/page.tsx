import SettingsShell from "@/components/settings/SettingsShell"
import { Suspense } from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function getUserSettings() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return { isPublic: false }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { isPublic: true }
    })

    return {
        isPublic: user?.isPublic || false
    }
}

export default async function SettingsPage() {
  const { isPublic } = await getUserSettings()

  return (
    <Suspense fallback={<div className="p-6">Loading settings...</div>}>
      <SettingsShell isPublic={isPublic} />
    </Suspense>
  )
}
