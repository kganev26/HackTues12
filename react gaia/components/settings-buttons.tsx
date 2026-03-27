"use client"

import { Languages } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useEffect, useState } from "react"

export function SettingsButtons() {
  const { lang, setLang } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setLang(lang === "en" ? "bg" : "en")}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg text-sm font-bold text-gray-700 dark:text-gray-200 hover:scale-105 transition-all duration-200"
        aria-label="Toggle language"
      >
        <Languages className="w-4 h-4" />
        {lang === "en" ? "BG" : "EN"}
      </button>
    </div>
  )
}
