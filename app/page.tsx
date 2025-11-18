import dynamic from "next/dynamic"

const LandingShell = dynamic(() => import("@/components/landing/LandingShell"))

export default function Home() {
  return <LandingShell />
}
