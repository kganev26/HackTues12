"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { translations, type Lang, type TranslationKey } from "./translations"

interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("bg")

  useEffect(() => {
    const stored = localStorage.getItem("gaia-lang") as Lang | null
    if (stored && (stored === "en" || stored === "bg")) {
      setLangState(stored)
    }
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem("gaia-lang", l)
  }

  const t = (key: TranslationKey) => translations[lang][key]

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider")
  return ctx
}
