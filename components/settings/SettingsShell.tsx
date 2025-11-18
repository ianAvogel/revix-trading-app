"use client"

import { useState, useTransition } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

async function updateProfilePrivacy(isPublic: boolean) {
    const response = await fetch('/api/users/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic }),
    });
    if (!response.ok) {
        throw new Error('Failed to update settings');
    }
    return response.json();
}

export default function SettingsShell({ isPublic: initialIsPublic }: { isPublic: boolean }) {
  const [isPublic, setIsPublic] = useState(initialIsPublic)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleToggle = (checked: boolean) => {
    setIsPublic(checked)
    startTransition(async () => {
      try {
        setError(null)
        setSuccess(null)
        await updateProfilePrivacy(checked)
        setSuccess("Your privacy settings have been updated.")
      } catch (e) {
        setError("Failed to update settings. Please try again.")
        // Revert state on failure
        setIsPublic(!checked)
      }
    })
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Manage your public profile and notification preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label htmlFor="privacy-toggle" className="font-medium">Public Profile</Label>
                <p className="text-sm text-muted-foreground">
                  Allow other users to see your trading performance and rank.
                </p>
              </div>
              <Switch
                id="privacy-toggle"
                checked={isPublic}
                onCheckedChange={handleToggle}
                disabled={isPending}
              />
            </div>
            {error && (
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Update Failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {success && (
                <Alert variant="default">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{success}</AlertDescription>
                </Alert>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
