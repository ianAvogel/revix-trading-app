/**
 * Advanced Order Types Component
 * Provides UI for Limit, Stop-Loss, and Take-Profit orders
 */

'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { AlertCircle, Info } from 'lucide-react'

interface AdvancedOrdersProps {
  orderType: 'MARKET' | 'LIMIT' | 'STOP_LOSS' | 'TAKE_PROFIT'
  onOrderTypeChange: (type: 'MARKET' | 'LIMIT' | 'STOP_LOSS' | 'TAKE_PROFIT') => void
  limitPrice?: number
  onLimitPriceChange: (price: number) => void
  stopPrice?: number
  onStopPriceChange: (price: number) => void
  currentPrice: number
  currentSymbol: string
}

export function AdvancedOrders({
  orderType,
  onOrderTypeChange,
  limitPrice,
  onLimitPriceChange,
  stopPrice,
  onStopPriceChange,
  currentPrice,
  currentSymbol,
}: AdvancedOrdersProps) {
  const getLimitPriceBounds = () => {
    const tolerance = currentPrice * 0.1 // 10% tolerance
    return {
      min: currentPrice * 0.9,
      max: currentPrice * 1.1,
    }
  }

  const bounds = getLimitPriceBounds()
  const isLimitPriceValid =
    !limitPrice || (limitPrice >= bounds.min && limitPrice <= bounds.max)
  const isStopPriceValid = !stopPrice || stopPrice > 0

  return (
    <div className="space-y-4">
      {/* Order Type Selector */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { type: 'MARKET', label: 'Market', desc: 'Execute immediately' },
          { type: 'LIMIT', label: 'Limit', desc: 'Set price' },
          { type: 'STOP_LOSS', label: 'Stop Loss', desc: 'Sell on drop' },
          { type: 'TAKE_PROFIT', label: 'Take Profit', desc: 'Sell on rise' },
        ].map(option => (
          <button
            key={option.type}
            onClick={() => onOrderTypeChange(option.type as any)}
            className={`p-3 rounded-lg border-2 transition-all ${
              orderType === option.type
                ? 'border-cyan-500 bg-cyan-500/10 text-white'
                : 'border-slate-600 bg-slate-800/50 text-slate-300 hover:border-slate-500'
            }`}
          >
            <div className="font-semibold text-sm">{option.label}</div>
            <div className="text-xs opacity-75">{option.desc}</div>
          </button>
        ))}
      </div>

      {/* Conditional Price Inputs */}
      {orderType === 'LIMIT' && (
        <Card className="p-4 bg-slate-800/50 border-slate-600">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-2">
                Limit Price (USDT)
              </label>
              <input
                type="number"
                value={limitPrice || ''}
                onChange={e => onLimitPriceChange(parseFloat(e.target.value) || 0)}
                placeholder="Enter limit price"
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
              />
              <div className="text-xs text-slate-400 mt-2">
                Current price: ${currentPrice.toFixed(2)}
              </div>
            </div>

            {!isLimitPriceValid && limitPrice && (
              <div className="flex gap-2 items-start p-3 bg-yellow-500/10 border border-yellow-500/50 rounded">
                <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-200">
                  Price must be within 10% of current price (${bounds.min.toFixed(2)} - $
                  {bounds.max.toFixed(2)})
                </p>
              </div>
            )}

            <div className="text-xs text-slate-400 flex gap-2">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>Order will execute when {currentSymbol} reaches your limit price</span>
            </div>
          </div>
        </Card>
      )}

      {orderType === 'STOP_LOSS' && (
        <Card className="p-4 bg-slate-800/50 border-slate-600">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-2">
                Stop Price (USDT)
              </label>
              <input
                type="number"
                value={stopPrice || ''}
                onChange={e => onStopPriceChange(parseFloat(e.target.value) || 0)}
                placeholder="Enter stop price"
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
              />
              <div className="text-xs text-slate-400 mt-2">
                Current price: ${currentPrice.toFixed(2)}
              </div>
            </div>

            {stopPrice && stopPrice >= currentPrice && (
              <div className="flex gap-2 items-start p-3 bg-yellow-500/10 border border-yellow-500/50 rounded">
                <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-200">
                  Stop price should be below current price to protect your position
                </p>
              </div>
            )}

            <div className="text-xs text-slate-400 flex gap-2">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>Market order will execute when {currentSymbol} drops to this price</span>
            </div>
          </div>
        </Card>
      )}

      {orderType === 'TAKE_PROFIT' && (
        <Card className="p-4 bg-slate-800/50 border-slate-600">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-2">
                Take Profit Price (USDT)
              </label>
              <input
                type="number"
                value={stopPrice || ''}
                onChange={e => onStopPriceChange(parseFloat(e.target.value) || 0)}
                placeholder="Enter take profit price"
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
              />
              <div className="text-xs text-slate-400 mt-2">
                Current price: ${currentPrice.toFixed(2)}
              </div>
            </div>

            {stopPrice && stopPrice <= currentPrice && (
              <div className="flex gap-2 items-start p-3 bg-yellow-500/10 border border-yellow-500/50 rounded">
                <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-200">
                  Take profit price should be above current price to lock in gains
                </p>
              </div>
            )}

            <div className="text-xs text-slate-400 flex gap-2">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>Market order will execute when {currentSymbol} rises to this price</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
