import React from "react"
import dynamicImport from "next/dynamic"

const SignalsPageShell = dynamicImport(() => import("@/components/signals/SignalsPageShell"))

export const dynamic = 'force-dynamic'

export default async function SignalsPage() {
  return <SignalsPageShell />
}
