"use client"
import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Props = {
  account?: {
    name?: string
    equity?: number
    balance?: number
    roi?: number
  }
}

export default function VirtualAccountCard({ account }: Props) {
  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>{account?.name || "Demo Account"}</CardTitle>
        <div className="text-sm text-muted-foreground">Virtual account</div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-muted-foreground">Equity</div>
            <div className="text-lg font-semibold">${(account?.equity ?? 0).toFixed(2)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Cash</div>
            <div className="text-lg font-semibold">${(account?.balance ?? 0).toFixed(2)}</div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">ROI</div>
          <div className="text-sm font-medium text-green-400">{(account?.roi ?? 0).toFixed(2)}%</div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <Button variant="default" size="sm">Create new virtual account</Button>
          <Button variant="outline" size="sm">Deposit</Button>
        </div>
      </CardContent>
    </Card>
  )
}
