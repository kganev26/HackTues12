"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/language-context"

export function AboutSection() {
  const { t } = useLanguage()

  return (
    <section className="py-32 px-6 md:px-12 bg-gradient-to-b from-stone-50 to-stone-100 dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span
            className="inline-block text-emerald-700 dark:text-emerald-400 text-sm font-medium tracking-widest uppercase mb-4 animate-fade-in"
            style={{ animationDelay: '0ms' }}
          >
            {t("about_label")}
          </span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 dark:text-white mb-6 text-balance animate-fade-up"
            style={{ animationDelay: '100ms' }}
          >
            {t("about_heading")}
          </h2>
          <div
            className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-amber-500 mx-auto rounded-full animate-fade-in"
            style={{ animationDelay: '250ms' }}
          />
        </div>

        {/* Text Content */}
        <div className="space-y-8 text-center">
          <p
            className="text-xl md:text-2xl text-stone-700 dark:text-stone-300 leading-relaxed font-light animate-fade-in"
            style={{ animationDelay: '350ms' }}
          >
            {t("about_p1")}
          </p>

          <p
            className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed animate-fade-in"
            style={{ animationDelay: '450ms' }}
          >
            {t("about_p2")}
          </p>

          <p
            className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed animate-fade-in"
            style={{ animationDelay: '550ms' }}
          >
            {t("about_p3")}
          </p>

          <div
            className="animate-fade-up"
            style={{ animationDelay: '650ms' }}
          >
            <Link
              href="/about"
              className="inline-block mt-4 text-emerald-700 dark:text-emerald-400 font-medium hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors border-b border-emerald-700 dark:border-emerald-400 hover:border-emerald-900 dark:hover:border-emerald-300 pb-0.5"
            >
              {t("about_read_more")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
