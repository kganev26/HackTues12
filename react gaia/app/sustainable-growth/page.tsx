'use client'

import Link from "next/link"
import { Leaf, Droplets, Factory, CheckCircle } from "lucide-react"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/language-context"
import type { TranslationKey } from "@/lib/translations"
import AuthGuard from "@/components/auth-guard"

const benefitKeys: TranslationKey[] = [
  "sg_benefit_1", "sg_benefit_2", "sg_benefit_3",
  "sg_benefit_6",
]

export default function SustainableGrowthPage() {
  const { t } = useLanguage()

  return (
    <AuthGuard>
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 dark:from-gray-950 dark:to-gray-900">

      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-8 py-5 flex items-center gap-4">
        <Link href="/" className="text-3xl font-black text-amber-500 tracking-widest hover:opacity-80 transition-opacity">GAIA</Link>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700" />
        <span className="text-gray-400 text-sm font-medium uppercase tracking-widest">
          {t("sg_heading")}
        </span>
      </div>

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
    </AuthGuard>
  )
}
