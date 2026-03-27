"use client"

import { useEffect, useState } from "react"
import { ArrowRight, User } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"

export function HeroSection() {
  const [loggedIn, setLoggedIn] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("currentUser"))
  }, [])

  return (
    <section className="relative w-full h-screen flex items-center justify-center text-center text-white overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url('https://assets.fcsamerica.com/transform/15a72fc9-c731-4716-ac1a-cd7916268d04/land-for-sale-how-to-find-farmland')`
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Content */}
      <div className="relative z-10 px-5 max-w-4xl">
        <h1
          className="text-6xl md:text-8xl font-black text-amber-400 tracking-widest mb-3 drop-shadow-2xl animate-fade-up"
          style={{ animationDelay: '0ms' }}
        >
          GAIA
        </h1>

        <div
          className="w-24 h-1 bg-amber-400 mx-auto mb-8 animate-fade-in"
          style={{ animationDelay: '200ms' }}
        />

        <p
          className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light text-gray-100 animate-fade-in"
          style={{ animationDelay: '350ms' }}
        >
          {t("hero_tagline")}
        </p>

        <div
          className="animate-fade-up"
          style={{ animationDelay: '500ms' }}
        >
          {loggedIn ? (
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 px-10 py-4 bg-green-700 hover:bg-green-800 text-white rounded-full font-bold text-lg transition-all duration-300 shadow-lg shadow-green-700/40 hover:-translate-y-1 hover:scale-105 hover:shadow-xl hover:shadow-green-700/50"
            >
              {t("hero_view_profile")}
              <User className="w-5 h-5" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-10 py-4 bg-green-700 hover:bg-green-800 text-white rounded-full font-bold text-lg transition-all duration-300 shadow-lg shadow-green-700/40 hover:-translate-y-1 hover:scale-105 hover:shadow-xl hover:shadow-green-700/50"
            >
              {t("hero_get_started")}
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
