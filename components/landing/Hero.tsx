import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, Users, Zap } from "lucide-react"

export function Hero() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Main Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
          Paper-trade crypto with{" "}
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            $50K + AI Mentor
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-xl sm:text-2xl text-slate-300 max-w-2xl mx-auto">
          Real-time markets, zero risk, learn with an AI coach. Master trading before putting real money at risk.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/auth/signup">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-lg h-12 px-8 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Start trading with $50K demo
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <button
            onClick={() => {
              const element = document.getElementById("tour-modal")
              if (element) element.click()
            }}
            className="px-8 h-12 rounded-lg border-2 border-slate-400 text-slate-200 hover:border-slate-200 hover:bg-slate-700/50 font-semibold transition-all duration-300"
          >
            Watch 30s tour
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="pt-8 text-slate-400 text-sm">
          <p className="mb-4">Trusted by traders worldwide</p>
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span>5,000+ users</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              <span>Avg 24% ROI</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              <span>AI-powered</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
