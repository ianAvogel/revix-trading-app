"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    alias: "",
    investmentGoal: "",
    experienceLevel: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})


  const validateStep = (stepNum: number) => {
    const errors: Record<string, string> = {}
    
    if (stepNum === 1) {
      if (!formData.email) errors.email = "Email is required"
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Invalid email"
      
      if (!formData.password) errors.password = "Password is required"
      else if (formData.password.length < 8) errors.password = "Password must be at least 8 characters"
      
      if (!formData.confirmPassword) errors.confirmPassword = "Confirm password is required"
      else if (formData.password !== formData.confirmPassword) errors.confirmPassword = "Passwords do not match"
    } 
    
    if (stepNum === 2) {
      if (!formData.alias) errors.alias = "Username is required"
      else if (formData.alias.length < 3) errors.alias = "Username must be at least 3 characters"
      else if (!/^[a-zA-Z0-9_]+$/.test(formData.alias)) errors.alias = "Only letters, numbers, and underscores"
    }

    if (stepNum === 3) {
      if (!formData.investmentGoal) errors.investmentGoal = "Please select an investment goal"
      if (!formData.experienceLevel) errors.experienceLevel = "Please select your experience level"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1)
      setError("")
    }
  }

  const handlePrevStep = () => {
    setStep(step - 1)
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep(3)) {
      return
    }

    setLoading(true)
    setError("")

    try {
      // Register user
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          alias: formData.alias,
          investmentGoal: formData.investmentGoal,
          experienceLevel: formData.experienceLevel,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Something went wrong")
        return
      }

      // Auto sign in after registration
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Account created but login failed. Please try logging in.")
      } else {
        router.push("/onboarding")
        router.refresh()
      }
    } catch (error) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleGuest = async () => {
    try {
      const res = await fetch('/api/auth/guest', { method: 'POST' })
      const json = await res.json()
      if (json.success) {
        router.push('/onboarding?guest=true')
      } else {
        setError('Failed to create guest')
      }
    } catch (err) {
      setError('Failed to create guest')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-2xl font-bold">Join Revix</CardTitle>
            <span className="text-xs text-muted-foreground">Step {step} of 3</span>
          </div>
          <CardDescription>
            {step === 1 && "Create your secure account"}
            {step === 2 && "Choose your trading profile"}
            {step === 3 && "Tell us about your investing style"}
          </CardDescription>
        </CardHeader>

        {/* Step Progress Indicator */}
        <div className="px-6 pt-2 pb-4">
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-all ${
                  s <= step ? "bg-purple-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            {/* Step 1: Email & Password */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                  {validationErrors.email && (
                    <p className="text-xs text-destructive">{validationErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    minLength={8}
                    required
                  />
                  {validationErrors.password && (
                    <p className="text-xs text-destructive">{validationErrors.password}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    At least 8 characters for security
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    required
                  />
                  {validationErrors.confirmPassword && (
                    <p className="text-xs text-destructive">{validationErrors.confirmPassword}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Username & Profile */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="space-y-2">
                  <Label htmlFor="alias">Trading Handle</Label>
                  <Input
                    id="alias"
                    type="text"
                    placeholder="trader_pro_2024"
                    value={formData.alias}
                    onChange={(e) =>
                      setFormData({ ...formData, alias: e.target.value })
                    }
                    minLength={3}
                    maxLength={20}
                    required
                  />
                  {validationErrors.alias && (
                    <p className="text-xs text-destructive">{validationErrors.alias}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    This is how other traders will see you on leaderboards
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <p className="text-sm font-medium text-blue-900">
                    ✨ Getting Started with $50K
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    You'll receive $50,000 in virtual trading capital to practice trading crypto risk-free.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Investment Goals & Experience */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="space-y-2">
                  <Label>What's your investing goal?</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {["Learn trading", "Test strategies", "Build skills", "Other"].map(
                      (goal) => (
                        <button
                          key={goal}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, investmentGoal: goal })
                          }
                          className={`px-4 py-3 rounded-md border-2 transition-all text-sm font-medium ${
                            formData.investmentGoal === goal
                              ? "border-purple-600 bg-purple-50 text-purple-900"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          {goal}
                        </button>
                      )
                    )}
                  </div>
                  {validationErrors.investmentGoal && (
                    <p className="text-xs text-destructive">{validationErrors.investmentGoal}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Trading Experience</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {["Complete beginner", "Some experience", "Very experienced"].map(
                      (level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, experienceLevel: level })
                          }
                          className={`px-4 py-3 rounded-md border-2 transition-all text-sm font-medium ${
                            formData.experienceLevel === level
                              ? "border-purple-600 bg-purple-50 text-purple-900"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          {level}
                        </button>
                      )
                    )}
                  </div>
                  {validationErrors.experienceLevel && (
                    <p className="text-xs text-destructive">{validationErrors.experienceLevel}</p>
                  )}
                </div>

                <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-4">
                  <p className="text-xs text-green-700">
                    <CheckCircle2 className="inline h-4 w-4 mr-2" />
                    All information will be kept private and secure
                  </p>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-3">
            <div className="flex gap-2 w-full">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              {step < 3 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Creating account..." : "Create account"}
                </Button>
              )}
            </div>

            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>

            <button
              type="button"
              onClick={handleGuest}
              className="text-xs text-muted-foreground hover:underline w-full text-center"
            >
              Continue as guest
            </button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
