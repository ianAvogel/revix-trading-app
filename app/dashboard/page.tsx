import React from "react"
import dynamicImport from "next/dynamic"

const DashboardShell = dynamicImport(() => import("@/components/dashboard/DashboardShell"))

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  // server-side fetch placeholder account. Replace with real API or session data later.
  const accountStub = { id: "demo-account", name: "Demo Account", equity: 50000, balance: 50000, roi: 0 }

  return <DashboardShell initialAccount={accountStub} />
}
