export function SocialProof() {
  const stats = [
    { label: "Active Traders", value: "5,000+" },
    { label: "Avg Monthly ROI", value: "24%" },
    { label: "Tournaments Completed", value: "1,200+" },
    { label: "Signals Generated", value: "50K+" },
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/50 border-y border-slate-700">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <p className="text-sm sm:text-base text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-12 border-t border-slate-700">
          <p className="text-slate-400 text-center mb-6 text-sm">Featured in</p>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-12 items-center opacity-60 hover:opacity-100 transition-opacity">
            <div className="text-slate-500 font-semibold">CryptoNews</div>
            <div className="text-slate-500 font-semibold">TradingView</div>
            <div className="text-slate-500 font-semibold">Coinbase Learn</div>
            <div className="text-slate-500 font-semibold">DeFi Times</div>
          </div>
        </div>
      </div>
    </section>
  )
}
