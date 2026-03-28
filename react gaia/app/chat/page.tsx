"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Send, Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import AuthGuard from "@/components/auth-guard"

const API_URL = "/api"

interface Message {
  role: "user" | "ai"
  text: string
}

export default function ChatPage() {
  const { t } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: t("chat_greeting") }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    setInput("")
    setError("")
    setMessages((prev) => [...prev, { role: "user", text }])
    setLoading(true)

    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: text }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || "Something went wrong")
        return
      }
      setMessages((prev) => [...prev, { role: "ai", text: data.reply }])
    } catch {
      setError("Cannot connect to server")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <AuthGuard>
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-8 py-5 flex items-center gap-4 shrink-0">
        <Link href="/" className="text-3xl font-black text-amber-500 tracking-widest hover:opacity-80 transition-opacity">GAIA</Link>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700" />
        <span className="text-gray-400 text-sm font-medium uppercase tracking-widest">{t("chat_ai_assistant")}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "ai" && (
                <div className="w-7 h-7 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-xs font-black text-amber-400 mr-2 mt-1 shrink-0">
                  G
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-green-700 text-white rounded-br-sm"
                    : "bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white/90 rounded-bl-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="w-7 h-7 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-xs font-black text-amber-400 mr-2 mt-1 shrink-0">
                G
              </div>
              <div className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-2 text-gray-400 dark:text-white/40 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("chat_thinking")}
              </div>
            </div>
          )}

          {error && (
            <p className="text-center text-red-400 text-xs">{error}</p>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-white/10 bg-white dark:bg-transparent px-4 py-4 shrink-0">
        <div className="max-w-2xl mx-auto flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder={t("chat_placeholder")}
            className="flex-1 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 outline-none focus:border-amber-400/50 transition-colors resize-none"
            style={{ maxHeight: "120px", overflowY: "auto" }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="p-3 bg-green-700 hover:bg-green-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-center text-gray-400 dark:text-white/20 text-xs mt-2">{t("chat_hint")}</p>
      </div>
    </div>
    </AuthGuard>
  )
}
