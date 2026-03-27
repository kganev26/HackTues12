'use client'

import Link from "next/link"
import { Leaf, Droplets, Factory, ArrowLeft, CheckCircle } from "lucide-react"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/language-context"
import type { TranslationKey } from "@/lib/translations"

const benefitKeys: TranslationKey[] = [
  "sg_benefit_1", "sg_benefit_2", "sg_benefit_3",
  "sg_benefit_6",
]

export default function SustainableGrowthPage() {
  const { t } = useLanguage()

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 dark:from-gray-950 dark:to-gray-900">

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0a0f0c] px-6 pt-8 pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.15)_0%,_transparent_65%)]" />

        <Link
          href="/"
          className="absolute top-8 left-6 inline-flex items-center gap-2 text-white/50 hover:text-white font-medium transition-colors text-sm animate-fade-in"
          style={{ animationDelay: '0ms' }}
        >
          <ArrowLeft className="w-4 h-4" />
          {t("back_to_home")}
        </Link>

        <div className="relative max-w-3xl mx-auto text-center">
          <span className="inline-block text-emerald-400 text-sm font-medium tracking-widest uppercase mb-4 animate-fade-in" style={{ animationDelay: '80ms' }}>
            {t("sg_label")}
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-up" style={{ animationDelay: '180ms' }}>
            {t("sg_heading")}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-amber-400 mx-auto rounded-full mb-8 animate-fade-in" style={{ animationDelay: '300ms' }} />
          <p className="text-white/60 text-lg leading-relaxed max-w-xl mx-auto animate-fade-in" style={{ animationDelay: '400ms' }}>
            {t("sg_subtitle")}
          </p>
        </div>

      </section>

      {/* The Problem */}
      <section className="py-20 px-6 md:px-12 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8 animate-fade-up" style={{ animationDelay: '0ms' }}>
            <span className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Factory className="w-5 h-5" />
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-white">
              {t("sg_problem_title")}
            </h2>
          </div>

          <div className="pl-[52px] space-y-5">
            <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed animate-fade-in" style={{ animationDelay: '100ms' }}>
              {t("sg_problem_p1")}
            </p>
            <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed animate-fade-in" style={{ animationDelay: '200ms' }}>
              {t("sg_problem_p2")}
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6 md:px-12 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-10 animate-fade-up" style={{ animationDelay: '0ms' }}>
            <span className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Droplets className="w-5 h-5" />
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-white">
              {t("sg_benefits_title")}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {benefitKeys.map((key, i) => (
              <div
                key={key}
                className="flex items-start gap-3 bg-stone-50 dark:bg-gray-800 rounded-xl p-4 border border-stone-100 dark:border-gray-700 animate-fade-in"
                style={{ animationDelay: `${80 + i * 70}ms` }}
              >
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <span className="text-stone-600 dark:text-stone-400 leading-relaxed text-sm">{t(key)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Bigger Picture */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8 animate-fade-up" style={{ animationDelay: '0ms' }}>
            <span className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5" />
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-white">{t("sg_bigger_title")}</h2>
          </div>

          <div className="pl-[52px] border-l-2 border-emerald-200 dark:border-emerald-800 space-y-5">
            <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed animate-fade-in" style={{ animationDelay: '100ms' }}>
              {t("sg_bigger_p1")}
            </p>
            <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed animate-fade-in" style={{ animationDelay: '200ms' }}>
              {t("sg_bigger_p2")}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
