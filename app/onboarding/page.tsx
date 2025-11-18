"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [experience, setExperience] = useState("beginner")
  const [assets, setAssets] = useState<string[]>(["BTC", "ETH"])
  const [notifyEmail, setNotifyEmail] = useState(true)

  const next = async () => {
    if (step === 2) {
      // Persist preferences
      await fetch('/api/users/preferences', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ experience, topAssets: assets, notificationPrefs: { email: notifyEmail } }) })
    }
    if (step < 3) setStep(step + 1)
    else router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Onboarding</CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div>
              <div className="text-sm">Authentication is complete. We created a demo account for you automatically.</div>
              <div className="mt-4 text-xs text-muted-foreground">Note: Guest accounts won&apos;t be saved across devices.</div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label>Experience level</Label>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant={experience === 'beginner' ? 'default' : 'secondary'} onClick={() => setExperience('beginner')}>Beginner</Button>
                  <Button size="sm" variant={experience === 'intermediate' ? 'default' : 'outline'} onClick={() => setExperience('intermediate')}>Intermediate</Button>
                  <Button size="sm" variant={experience === 'advanced' ? 'default' : 'outline'} onClick={() => setExperience('advanced')}>Advanced</Button>
                </div>
              </div>
              <div>
                <Label>Top assets</Label>
                <div className="mt-2">
                  <input value={assets.join(', ')} onChange={e => setAssets(e.target.value.split(',').map(s => s.trim().toUpperCase()))} className="w-full p-2 rounded border bg-transparent" />
                </div>
              </div>
              <div>
                <Label>Notifications</Label>
                <div className="mt-2 flex gap-2 items-center">
                  <input type="checkbox" checked={notifyEmail} onChange={e => setNotifyEmail(e.target.checked)} />
                  <div className="text-sm text-muted-foreground">Email notifications</div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="text-sm">Quick Tour</div>
              <div className="mt-4 text-xs text-muted-foreground">1. Dashboard — Overview</div>
              <div className="mt-2 text-xs text-muted-foreground">2. Trade — Place simulated orders</div>
              <div className="mt-2 text-xs text-muted-foreground">3. Mentor — Ask questions & apply signals</div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={() => step > 1 ? setStep(step - 1) : router.push('/')}>Back</Button>
            <Button onClick={next}>{step < 3 ? 'Continue' : 'Go to Dashboard'}</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
