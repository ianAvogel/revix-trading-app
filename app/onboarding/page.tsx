"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { CheckCircle2, TrendingUp, MessageSquare, Zap, ArrowRight, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [experience, setExperience] = useState("beginner")
  const [assets, setAssets] = useState<string[]>(["BTC", "ETH"])
  const [notifyEmail, setNotifyEmail] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const next = async () => {
    if (step === 2) {
      // Persist preferences
      setIsLoading(true)
      try {
        await fetch('/api/users/preferences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            experience,
            topAssets: assets,
            notificationPrefs: { email: notifyEmail }
          })
        })
      } catch (err) {
        // Continue anyway
      }
      setIsLoading(false)
    }
    if (step < 4) setStep(step + 1)
    else {
      setIsLoading(true)
      router.push('/dashboard')
    }
  }

  const prev = () => {
    if (step > 1) setStep(step - 1)
  }

  const FeatureBox = ({ icon: Icon, title, description }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-lg border border-gray-200 bg-white"
    >
      <div className="flex gap-3">
        <div className="p-2 bg-purple-100 rounded-lg h-fit">
          <Icon className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <div className="font-medium text-sm">{title}</div>
          <div className="text-xs text-muted-foreground mt-1">{description}</div>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Welcome to Revix! 🎉</CardTitle>
                <p className="text-purple-100 text-sm mt-1">Step {step} of 4 — Let's get you started</p>
              </div>
              <div className="text-4xl font-bold opacity-20">{step}</div>
            </div>
          </CardHeader>

          {/* Progress Bar */}
          <div className="h-1 bg-gray-200">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-purple-600 to-indigo-600"
            />
          </div>

          <CardContent className="pt-8">
            {/* Step 1: Welcome */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                    <h3 className="text-lg font-semibold">Account Created!</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your demo account is ready with $50,000 in virtual capital. This is your sandbox to practice crypto trading without any real risk.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-900 mb-2">What you can do:</p>
                  <ul className="space-y-2">
                    <li className="text-xs text-blue-800 flex gap-2">
                      <span>✓</span>
                      <span>Paper-trade BTC, ETH, and other crypto with real market data</span>
                    </li>
                    <li className="text-xs text-blue-800 flex gap-2">
                      <span>✓</span>
                      <span>Get personalized trading signals from our AI Mentor</span>
                    </li>
                    <li className="text-xs text-blue-800 flex gap-2">
                      <span>✓</span>
                      <span>Compete with other traders on live leaderboards</span>
                    </li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <FeatureBox
                    icon={TrendingUp}
                    title="Real-time Markets"
                    description="Live crypto prices and technical analysis"
                  />
                  <FeatureBox
                    icon={MessageSquare}
                    title="AI Mentor"
                    description="Learn trading concepts and get signal recommendations"
                  />
                  <FeatureBox
                    icon={Zap}
                    title="Instant Execution"
                    description="Place market or limit orders instantly"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2: Preferences */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold">Customize Your Experience</h3>

                <div>
                  <Label className="text-sm font-medium mb-3 block">Your Trading Experience</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'beginner', label: 'Beginner', desc: 'New to trading' },
                      { id: 'intermediate', label: 'Intermediate', desc: 'Some experience' },
                      { id: 'advanced', label: 'Advanced', desc: 'Experienced' }
                    ].map(level => (
                      <motion.button
                        key={level.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setExperience(level.id)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          experience === level.id
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium text-sm">{level.label}</div>
                        <div className="text-xs text-muted-foreground">{level.desc}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">Assets to Watch</Label>
                  <Input
                    value={assets.join(', ')}
                    onChange={e => setAssets(e.target.value.split(',').map(s => s.trim().toUpperCase()).filter(s => s))}
                    placeholder="BTC, ETH, SOL..."
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-2">Comma-separated crypto symbols you want to trade</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <Label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyEmail}
                      onChange={e => setNotifyEmail(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">Email me when my watchlist moves or new signals appear</span>
                  </Label>
                </div>
              </motion.div>
            )}

            {/* Step 3: Features Overview */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold">Here's How to Get Started</h3>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-600">
                      1
                    </div>
                    <div>
                      <div className="font-medium">Check the Dashboard</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        See your account balance, open positions, and recent activity at a glance.
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">
                      2
                    </div>
                    <div>
                      <div className="font-medium">Place Your First Trade</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Use the Quick Trade button to place a market or limit order. Try buying a small amount of BTC!
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center font-bold text-pink-600">
                      3
                    </div>
                    <div>
                      <div className="font-medium">Get Trading Signals</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Visit the Signals page to see AI-generated buy/sell recommendations for your assets.
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-600">
                      4
                    </div>
                    <div>
                      <div className="font-medium">Learn with the AI Mentor</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Open the chat at any time to ask trading questions or discuss strategies.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-green-900 mb-2">💡 Pro Tip:</p>
                  <p className="text-xs text-green-800">
                    Start by paper-trading small positions to get comfortable with the platform. There's no risk—even if you lose all $50K, you can always reset your account!
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 4: Ready to Go */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 text-center"
              >
                <div className="flex justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-5xl"
                  >
                    🚀
                  </motion.div>
                </div>
                <h3 className="text-2xl font-bold">You're All Set!</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  You're ready to start trading! Click below to go to your dashboard and place your first trade.
                </p>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-left">
                  <p className="text-sm font-medium text-purple-900 mb-2">Quick Reminders:</p>
                  <ul className="space-y-1 text-xs text-purple-800">
                    <li>✓ All trades use virtual money — zero real risk</li>
                    <li>✓ Check the AI Mentor chat for trading tips</li>
                    <li>✓ Your portfolio tracks all trades and P&L automatically</li>
                    <li>✓ Have fun and learn at your own pace!</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </CardContent>

          <CardFooter className="border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <div className="flex justify-between w-full">
              <Button
                variant="outline"
                onClick={prev}
                disabled={step === 1 || isLoading}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={next}
                disabled={isLoading}
                className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {isLoading ? 'Loading...' : step < 4 ? 'Next' : 'Go to Dashboard'}
                {!isLoading && step < 4 && <ArrowRight className="h-4 w-4" />}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
