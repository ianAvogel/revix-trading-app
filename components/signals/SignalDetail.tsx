/**
 * Signal Detail Drawer Component
 * Shows full signal details, rationale, and past analogs
 */

'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface PastAnalog {
  date: string
  outcome: 'WIN' | 'LOSS'
  roi: number
  description: string
}

interface SignalDetailProps {
  open: boolean
  onClose: () => void
  signal: {
    id: string
    symbol: string
    direction: 'BUY' | 'SELL'
    confidence: number
    rationale: string[]
    indicators: {
      name: string
      value: number
      importance: number // 0-1
    }[]
    pastAnalogs: PastAnalog[]
    suggestedQty: number
    stopLoss: number
    takeProfit: number
  }
  onApply: (signal: any) => void
}

export function SignalDetail({ open, onClose, signal, onApply }: SignalDetailProps) {
  const [currentAnalogIndex, setCurrentAnalogIndex] = useState(0)

  if (!open) return null

  const currentAnalog = signal.pastAnalogs[currentAnalogIndex]
  const confidenceColor =
    signal.confidence >= 80
      ? 'text-green-400'
      : signal.confidence >= 60
        ? 'text-yellow-400'
        : 'text-red-400'

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40"
        />

        {/* Drawer */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="ml-auto w-full max-w-md bg-slate-900 border-l border-slate-700 overflow-y-auto shadow-xl"
        >
          {/* Header */}
          <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={signal.direction === 'BUY' ? 'text-green-400' : 'text-red-400'}>
                {signal.direction === 'BUY' ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
              </div>
              <div>
                <h2 className="font-bold text-white">{signal.symbol}</h2>
                <p className="text-xs text-slate-400">{signal.direction} Signal</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-800 rounded transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-6">
            {/* Confidence Badge */}
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <span className="text-sm font-medium text-slate-300">Confidence</span>
              <div className={`text-2xl font-bold ${confidenceColor}`}>
                {signal.confidence}%
              </div>
            </div>

            {/* Rationale */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Why this signal?</h3>
              <ul className="space-y-2">
                {signal.rationale.map((point, idx) => (
                  <li key={idx} className="flex gap-2 text-sm text-slate-300">
                    <span className="text-cyan-400 flex-shrink-0">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Indicators */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Technical Indicators</h3>
              <div className="space-y-2">
                {signal.indicators.map((ind, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-slate-800/30 rounded">
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-300">{ind.name}</p>
                      <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full"
                          style={{ width: `${ind.importance * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 ml-2">{ind.value.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Past Analogs Carousel */}
            {signal.pastAnalogs.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Historical Performance</h3>
                <Card className="p-4 bg-slate-800/50 border-slate-700">
                  <div className="space-y-3">
                    {/* Analog Card */}
                    <div className={`p-3 rounded border-2 ${
                      currentAnalog.outcome === 'WIN'
                        ? 'border-green-500/50 bg-green-500/10'
                        : 'border-red-500/50 bg-red-500/10'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-300">
                          {currentAnalog.date}
                        </span>
                        <span className={
                          currentAnalog.outcome === 'WIN'
                            ? 'text-green-400 font-bold'
                            : 'text-red-400 font-bold'
                        }>
                          {currentAnalog.roi > 0 ? '+' : ''}{currentAnalog.roi.toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">{currentAnalog.description}</p>
                    </div>

                    {/* Navigation */}
                    {signal.pastAnalogs.length > 1 && (
                      <div className="flex items-center justify-between pt-2">
                        <button
                          onClick={() =>
                            setCurrentAnalogIndex(
                              (currentAnalogIndex - 1 + signal.pastAnalogs.length) %
                              signal.pastAnalogs.length
                            )
                          }
                          className="p-1 hover:bg-slate-700 rounded transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-xs text-slate-400">
                          {currentAnalogIndex + 1} / {signal.pastAnalogs.length}
                        </span>
                        <button
                          onClick={() =>
                            setCurrentAnalogIndex(
                              (currentAnalogIndex + 1) % signal.pastAnalogs.length
                            )
                          }
                          className="p-1 hover:bg-slate-700 rounded transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )}

            {/* Suggested Trade */}
            <Card className="p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/50">
              <h4 className="font-semibold text-white mb-2">Suggested Trade</h4>
              <div className="space-y-1 text-sm text-slate-300">
                <p>• Quantity: {signal.suggestedQty} {signal.symbol}</p>
                <p>• Stop Loss: ${signal.stopLoss.toFixed(2)}</p>
                <p>• Take Profit: ${signal.takeProfit.toFixed(2)}</p>
              </div>
            </Card>

            {/* CTA */}
            <Button
              onClick={() => {
                onApply(signal)
                onClose()
              }}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3"
            >
              Apply Signal to Trade
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
