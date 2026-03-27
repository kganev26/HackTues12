'use client'

import Link from "next/link"
import { Leaf, Droplets, Recycle, Factory, ArrowLeft, CheckCircle, FlaskConical, Truck } from "lucide-react"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/language-context"
import type { TranslationKey } from "@/lib/translations"

const stepKeys = [
  { icon: Factory, titleKey: "sg_step1_title" as TranslationKey, bodyKey: "sg_step1_body" as TranslationKey },
  { icon: FlaskConical, titleKey: "sg_step2_title" as TranslationKey, bodyKey: "sg_step2_body" as TranslationKey },
  { icon: Recycle, titleKey: "sg_step3_title" as TranslationKey, bodyKey: "sg_step3_body" as TranslationKey },
  { icon: Truck, titleKey: "sg_step4_title" as TranslationKey, bodyKey: "sg_step4_body" as TranslationKey },
]

const benefitKeys: TranslationKey[] = [
  "sg_benefit_1", "sg_benefit_2", "sg_benefit_3",
  "sg_benefit_4", "sg_benefit_5", "sg_benefit_6",
]

const statKeys: { value: string; labelKey: TranslationKey }[] = [
  { value: "4-stage", labelKey: "sg_stat_filtration" },
  { value: "100%", labelKey: "sg_stat_certified" },
  { value: "0 waste", labelKey: "sg_stat_waste" },
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

        {/* Stats strip */}
        <div className="relative max-w-2xl mx-auto mt-14 grid grid-cols-3 divide-x divide-white/10 animate-fade-up" style={{ animationDelay: '520ms' }}>
          {statKeys.map((s) => (
            <div key={s.labelKey} className="text-center px-6 py-4">
              <div className="text-2xl font-bold text-emerald-400 mb-1">{s.value}</div>
              <div className="text-white/40 text-xs uppercase tracking-widest">{t(s.labelKey)}</div>
            </div>
          ))}
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

      {/* Filtration Pipeline */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-12 animate-fade-up" style={{ animationDelay: '0ms' }}>
            <span className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Recycle className="w-5 h-5" />
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-white">
              {t("sg_pipeline_title")}
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-400 via-emerald-300 to-transparent" />

            <div className="space-y-10">
              {stepKeys.map((step, i) => {
                const Icon = step.icon
                return (
                  <div key={i} className="relative flex gap-8 animate-fade-up" style={{ animationDelay: `${80 + i * 120}ms` }}>
                    <div className="relative z-10 w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-600/30 border-4 border-stone-50 dark:border-gray-950">
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-stone-100 dark:border-gray-800 p-6 mb-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                          {t("sg_step")} {i + 1}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-stone-900 dark:text-white mb-2">{t(step.titleKey)}</h3>
                      <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-sm">{t(step.bodyKey)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
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
