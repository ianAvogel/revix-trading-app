"use client"
import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type Message = { role: string; content: string }

export default function ChatDrawer({ accountId }: { accountId?: string }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input) return
    const clientMsg = { role: "user", content: input }
    setMessages((m) => [...m, clientMsg])
    setInput("")
    setLoading(true)
    try {
      const res = await fetch("/api/mentor/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      })
      const json = await res.json()
      if (json.error) {
        setMessages((m) => [...m, { role: "assistant", content: `Mentor error: ${json.error}` }])
      } else if (json.reply) {
        setMessages((m) => [...m, { role: "assistant", content: json.reply }])
      }
    } catch (err) {
      setMessages((m) => [...m, { role: "assistant", content: "Mentor offline — could not connect." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button size="lg" onClick={() => setOpen(!open)}>{open ? "Close Mentor" : "Open Mentor"}</Button>
      {open && (
        <div className="w-[360px] mt-2 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-3 border-b font-medium">AI Mentor</div>
          <div className="p-3 h-64 overflow-auto">
            {messages.map((m, i) => (
              <div key={i} className={`mb-2 ${m.role === "assistant" ? "text-left" : "text-right"}`}>
                <div className={`inline-block rounded px-3 py-2 ${m.role === "assistant" ? "bg-slate-100" : "bg-blue-100"}`}>{m.content}</div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t flex gap-2">
            <input className="flex-1 p-2 rounded border" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") sendMessage() }} />
            <Button onClick={sendMessage} size="sm" disabled={loading}>{loading ? "..." : "Send"}</Button>
          </div>
        </div>
      )}
    </div>
  )
}
