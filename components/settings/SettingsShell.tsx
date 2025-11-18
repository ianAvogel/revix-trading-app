"use client"

import { useState, useTransition } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Bell, Lock, Eye, EyeOff, Save, LogOut, DollarSign, Zap } from "lucide-react"
import { signOut } from "next-auth/react"

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

async function updateNotificationSettings(settings: any) {
    const response = await fetch('/api/users/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
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
  const [activeTab, setActiveTab] = useState("profile")
  
  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailOnSignal: true,
    emailOnTrade: false,
    emailOnLeaderboard: true,
    pushNotifications: true,
  })

  // Trading preferences
  const [trading, setTrading] = useState({
    defaultOrderType: "market",
    defaultSlippage: 0.5,
    confirmBeforeTrade: true,
    showAdvancedOptions: false,
  })

  const handleToggle = (checked: boolean) => {
    setIsPublic(checked)
    startTransition(async () => {
      try {
        setError(null)
        setSuccess(null)
        await updateProfilePrivacy(checked)
        setSuccess("Privacy settings updated.")
      } catch (e) {
        setError("Failed to update settings. Please try again.")
        setIsPublic(!checked)
      }
    })
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    const updated = { ...notifications, [key]: value }
    setNotifications(updated)
    
    startTransition(async () => {
      try {
        setError(null)
        setSuccess(null)
        await updateNotificationSettings({ notificationPrefs: updated })
        setSuccess("Notification settings updated.")
      } catch (e) {
        setError("Failed to update settings.")
      }
    })
  }

  const SettingCard = ({ icon: Icon, title, description, children }: any) => (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Icon className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and trading settings</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-200">
        {[
          { id: "profile", label: "Profile", icon: Eye },
          { id: "notifications", label: "Notifications", icon: Bell },
          { id: "trading", label: "Trading", icon: Zap },
          { id: "security", label: "Security", icon: Lock },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <AlertTitle className="text-green-900">Success</AlertTitle>
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <SettingCard
              icon={Eye}
              title="Public Profile"
              description="Control how other traders see you on leaderboards"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <Label className="font-medium">Make Profile Public</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Allow other users to view your trading performance and rank on leaderboards
                    </p>
                  </div>
                  <Switch
                    checked={isPublic}
                    onCheckedChange={handleToggle}
                    disabled={isPending}
                  />
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                  💡 <strong>Tip:</strong> {isPublic ? "Your profile is visible to all traders" : "Only you can see your profile details"}
                </div>
              </div>
            </SettingCard>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <SettingCard
              icon={Bell}
              title="Notification Preferences"
              description="Choose how and when you want to be notified"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <Label className="font-medium text-sm">Trading Signals</Label>
                    <p className="text-xs text-muted-foreground mt-1">Get notified when new trading signals are available</p>
                  </div>
                  <Switch
                    checked={notifications.emailOnSignal}
                    onCheckedChange={(v) => handleNotificationChange("emailOnSignal", v)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <Label className="font-medium text-sm">Trade Confirmations</Label>
                    <p className="text-xs text-muted-foreground mt-1">Email confirmation when you execute a trade</p>
                  </div>
                  <Switch
                    checked={notifications.emailOnTrade}
                    onCheckedChange={(v) => handleNotificationChange("emailOnTrade", v)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <Label className="font-medium text-sm">Leaderboard Updates</Label>
                    <p className="text-xs text-muted-foreground mt-1">Notify when your rank changes significantly</p>
                  </div>
                  <Switch
                    checked={notifications.emailOnLeaderboard}
                    onCheckedChange={(v) => handleNotificationChange("emailOnLeaderboard", v)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <Label className="font-medium text-sm">Push Notifications</Label>
                    <p className="text-xs text-muted-foreground mt-1">Instant alerts in-app</p>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(v) => handleNotificationChange("pushNotifications", v)}
                  />
                </div>
              </div>
            </SettingCard>
          </div>
        )}

        {/* Trading Tab */}
        {activeTab === "trading" && (
          <div className="space-y-6">
            <SettingCard
              icon={DollarSign}
              title="Default Trading Settings"
              description="Set your preferred defaults for new trades"
            >
              <div className="space-y-4">
                <div>
                  <Label className="font-medium text-sm mb-2 block">Default Order Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "market", label: "Market" },
                      { id: "limit", label: "Limit" },
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setTrading({ ...trading, defaultOrderType: type.id })}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          trading.defaultOrderType === type.id
                            ? "border-purple-600 bg-purple-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="font-medium text-sm mb-2 block">Default Slippage: {trading.defaultSlippage.toFixed(1)}%</Label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.1"
                    value={trading.defaultSlippage}
                    onChange={(e) => setTrading({ ...trading, defaultSlippage: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <Label className="font-medium text-sm">Confirm Before Trading</Label>
                    <p className="text-xs text-muted-foreground mt-1">Show preview before executing trades</p>
                  </div>
                  <Switch
                    checked={trading.confirmBeforeTrade}
                    onCheckedChange={(v) => setTrading({ ...trading, confirmBeforeTrade: v })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <Label className="font-medium text-sm">Show Advanced Options</Label>
                    <p className="text-xs text-muted-foreground mt-1">Advanced order types and settings</p>
                  </div>
                  <Switch
                    checked={trading.showAdvancedOptions}
                    onCheckedChange={(v) => setTrading({ ...trading, showAdvancedOptions: v })}
                  />
                </div>

                <Button className="w-full" onClick={() => setSuccess("Trading settings saved.")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Trading Settings
                </Button>
              </div>
            </SettingCard>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <SettingCard
              icon={Lock}
              title="Account Security"
              description="Manage your password and account access"
            >
              <div className="space-y-4">
                <div>
                  <Label className="font-medium text-sm mb-2 block">Current Password</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>

                <div>
                  <Label className="font-medium text-sm mb-2 block">New Password</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>

                <div>
                  <Label className="font-medium text-sm mb-2 block">Confirm New Password</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>

                <Button className="w-full">Change Password</Button>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-medium mb-3">Sessions</h4>
                  <p className="text-sm text-muted-foreground mb-3">Sign out all other sessions</p>
                  <Button variant="outline" className="w-full">Sign Out Other Sessions</Button>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-medium mb-3 text-red-600">Danger Zone</h4>
                  <p className="text-sm text-muted-foreground mb-3">Reset or delete your account</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline">Reset Account</Button>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </div>
            </SettingCard>
          </div>
        )}
      </motion.div>

      {/* Sign Out */}
      <div className="mt-12 border-t border-gray-200 pt-6">
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
