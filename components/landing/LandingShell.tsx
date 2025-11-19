'use client'

import { Hero } from '@/components/landing/Hero'
import { SocialProof } from '@/components/landing/SocialProof'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { LandingFooter } from '@/components/landing/LandingFooter'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function LandingShell() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="bg-slate-900 min-h-screen">
      {/* Navigation */}
      <nav className="bg-slate-900/80 backdrop-blur border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Revix
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden sm:flex items-center gap-8">
            <Link href="#features" className="text-slate-300 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="/auth/login" className="text-slate-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/auth/signup" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-2 rounded-lg font-semibold transition-all">
              Start Trading
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-slate-800 border-t border-slate-700 p-4 space-y-3">
            <Link href="#features" className="block text-slate-300 hover:text-white py-2">
              Features
            </Link>
            <Link href="/auth/login" className="block text-slate-300 hover:text-white py-2">
              Sign In
            </Link>
            <Link href="/auth/signup" className="block bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded font-semibold text-center">
              Start Trading
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <Hero />

      {/* Social Proof */}
      <SocialProof />

      {/* How It Works */}
      <section id="features">
        <HowItWorks />
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            Ready to master crypto trading?
          </h2>
          <p className="text-xl text-slate-300">
            Join thousands of traders learning with zero risk. Start your $50K demo today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105">
                Get Started Free
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <LandingFooter />
    </div>
  )
}
