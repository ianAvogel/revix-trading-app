import { BarChart3, Brain, Trophy } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: <BarChart3 className="w-12 h-12 text-cyan-400" />,
      title: "Real-Time Market Data",
      description: "Trade with live crypto prices and real market conditions. Experience authentic trading without risk.",
    },
    {
      icon: <Brain className="w-12 h-12 text-cyan-400" />,
      title: "AI Mentor Guides You",
      description: "Get AI-powered trading signals, explanations, and personalized advice based on your portfolio.",
    },
    {
      icon: <Trophy className="w-12 h-12 text-cyan-400" />,
      title: "Compete & Learn",
      description: "Join tournaments, climb leaderboards, and prove your skills against traders worldwide.",
    },
  ]

  return (
    <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">How it works</h2>
          <p className="text-xl text-slate-300">Three simple steps to start your trading journey</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden sm:block absolute top-16 left-[60%] w-[40%] h-1 bg-gradient-to-r from-cyan-500 to-slate-700" />
              )}

              <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-8 hover:border-cyan-500/50 transition-all duration-300">
                <div className="mb-6 flex items-center justify-between">
                  <div>{step.icon}</div>
                  <span className="text-2xl font-bold text-slate-500">0{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-slate-600 rounded-lg p-8 text-center">
          <p className="text-slate-300 text-lg">
            Start with <span className="font-bold text-white">$50,000 in virtual capital</span> — no credit card required. Risk-free learning for all skill levels.
          </p>
        </div>
      </div>
    </section>
  )
}
