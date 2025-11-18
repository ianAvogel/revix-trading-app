"use client"
import React, { useState } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"

const TourModal = dynamic(() => import("@/components/landing/TourModal"))

export default function LandingShell() {
  const [open, setOpen] = useState(false)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-purple-600 to-indigo-700">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-white">Revix</h1>
        <p className="text-2xl text-purple-100">Paper-trade crypto with $50K + an AI Mentor</p>
        <div className="flex gap-4 justify-center mt-8">
          <Link href="/signup" className="px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition">Start Trading with $50K Demo</Link>
          <button onClick={() => setOpen(true)} className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition">Watch 30s Tour</button>
          <TourModal open={open} onClose={() => setOpen(false)} />
        </div>
        <div className="mt-12 text-purple-200 text-sm">Real-time markets • Zero risk • Learn with AI coach</div>
      </div>
    </main>
  )
}
