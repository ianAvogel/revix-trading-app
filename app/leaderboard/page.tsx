import LeaderboardShell from "@/components/leaderboard/LeaderboardShell"
import { Suspense } from "react"

export default function LeaderboardPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading leaderboard...</div>}>
      <LeaderboardShell />
    </Suspense>
  )
}
