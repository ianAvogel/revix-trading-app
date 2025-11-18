import PortfolioShell from "@/components/portfolio/PortfolioShell"
import { Suspense } from "react"

export default function PortfolioPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading portfolio...</div>}>
      <PortfolioShell />
    </Suspense>
  )
}
