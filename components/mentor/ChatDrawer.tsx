"use client"
import React, { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, Send, X, Sparkles, Copy, ThumbsUp, ThumbsDown, Loader } from "lucide-react"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  rating?: "helpful" | "unhelpful"
}

const MENTOR_SUGGESTIONS = [
  "What is technical analysis?",
  "How do I manage risk?",
  "What's a good entry strategy?",
  "Explain stop loss orders",
  "How do I read candlesticks?",
  "What is the RSI indicator?",
]

export default function ChatDrawer({ accountId }: { accountId?: string }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [suggestionsShown, setSuggestionsShown] = useState(true)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateId = () => `msg-${Date.now()}-${Math.random()}`

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || input
    if (!textToSend.trim()) return

    const userMsg: Message = {
      id: generateId(),
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    }

    setMessages((m) => [...m, userMsg])
    setInput("")
    setSuggestionsShown(false)
    setLoading(true)
    setIsTyping(true)

    try {
      const res = await fetch("/api/mentor/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          accountId,
          conversationContext: messages,
        }),
      })

      const json = await res.json()

      // Simulate typing effect
      await new Promise((resolve) => setTimeout(resolve, 500))

      const assistantMsg: Message = {
        id: generateId(),
        role: "assistant",
        content: json.error ? `I encountered an error: ${json.error}` : json.reply || "I didn't understand that. Can you rephrase?",
        timestamp: new Date(),
      }

      setMessages((m) => [...m, assistantMsg])
    } catch (err) {
      const errorMsg: Message = {
        id: generateId(),
        role: "assistant",
        content: "Sorry, I'm having trouble connecting right now. Please try again.",
        timestamp: new Date(),
      }
      setMessages((m) => [...m, errorMsg])
    } finally {
      setLoading(false)
      setIsTyping(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion)
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const rateMessage = (messageId: string, rating: "helpful" | "unhelpful") => {
    setMessages((msgs) =>
      msgs.map((m) => (m.id === messageId ? { ...m, rating } : m))
    )
  }

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Chat Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            onClick={() => setOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center group"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">!</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute bottom-20 right-0 w-96 h-[600px] flex flex-col rounded-xl shadow-2xl bg-white overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Trading Mentor</h3>
                  <p className="text-xs text-purple-100">Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 hover:bg-white/20 rounded transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-purple-50 to-white">
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="text-4xl mb-3">👋</div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Welcome to your Trading Mentor</p>
                  <p className="text-xs text-gray-500">Ask me anything about trading, strategies, or signals!</p>
                </motion.div>
              )}

              {messages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}
                >
                  <div className={`max-w-xs group`}>
                    <div
                      className={`rounded-lg px-4 py-3 text-sm ${
                        msg.role === "assistant"
                          ? "bg-gray-100 text-gray-900 rounded-br-none"
                          : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-bl-none"
                      }`}
                    >
                      <p className="leading-relaxed">{msg.content}</p>
                      <p className={`text-xs mt-1 ${
                        msg.role === "assistant" ? "text-gray-500" : "text-purple-100"
                      }`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>

                    {/* Message Actions */}
                    {msg.role === "assistant" && (
                      <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => copyMessage(msg.content)}
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Copy"
                        >
                          <Copy className="h-4 w-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => rateMessage(msg.id, "helpful")}
                          className={`p-1 rounded ${msg.rating === "helpful" ? "bg-green-100" : "hover:bg-gray-200"}`}
                          title="Helpful"
                        >
                          <ThumbsUp className={`h-4 w-4 ${msg.rating === "helpful" ? "text-green-600" : "text-gray-500"}`} />
                        </button>
                        <button
                          onClick={() => rateMessage(msg.id, "unhelpful")}
                          className={`p-1 rounded ${msg.rating === "unhelpful" ? "bg-red-100" : "hover:bg-gray-200"}`}
                          title="Unhelpful"
                        >
                          <ThumbsDown className={`h-4 w-4 ${msg.rating === "unhelpful" ? "text-red-600" : "text-gray-500"}`} />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2 items-center"
                >
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.4s" }} />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {suggestionsShown && messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-4 py-3 border-t border-gray-200 bg-gray-50 max-h-32 overflow-y-auto"
              >
                <p className="text-xs font-semibold text-gray-600 mb-2">Quick Tips:</p>
                <div className="grid grid-cols-1 gap-2">
                  {MENTOR_SUGGESTIONS.slice(0, 3).map((suggestion, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-left text-xs px-3 py-2 rounded bg-white border border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition truncate"
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !loading) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                  placeholder="Ask me anything..."
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-sm"
                  disabled={loading}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {loading ? (
                    <Loader className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </motion.button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
