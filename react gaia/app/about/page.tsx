'use client'

import Link from "next/link"
import { ArrowLeft, Cpu, Droplets, Leaf, Settings, Users, Globe, Sprout } from "lucide-react"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/language-context"
import type { TranslationKey } from "@/lib/translations"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const sections = [
  { id: "what-is-gaia", icon: Sprout, titleKey: "about_what_is_gaia_title" as TranslationKey, contentKey: "about_what_is_gaia" as TranslationKey },
  { id: "sensors-and-ai", icon: Cpu, titleKey: "about_sensors_ai_title" as TranslationKey, contentKey: "about_sensors_ai" as TranslationKey },
  { id: "water-recycling", icon: Droplets, titleKey: "about_water_title" as TranslationKey, contentKey: "about_water" as TranslationKey },
  { id: "automation", icon: Settings, titleKey: "about_automation_title" as TranslationKey, contentKey: "about_automation" as TranslationKey },
  { id: "accessibility", icon: Users, titleKey: "about_accessibility_title" as TranslationKey, contentKey: "about_accessibility" as TranslationKey },
  { id: "sustainability", icon: Leaf, titleKey: "about_sustainability_title" as TranslationKey, contentKey: "about_sustainability" as TranslationKey },
  { id: "the-name", icon: Globe, titleKey: "about_name_title" as TranslationKey, contentKey: "about_name" as TranslationKey },
]

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 dark:from-gray-950 dark:to-gray-900 flex flex-col">

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0a0f0c] px-6 pt-8 pb-24 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.12)_0%,_transparent_70%)]" />

        <Link
          href="/"
          className="absolute top-8 left-6 inline-flex items-center gap-2 text-white/50 hover:text-white font-medium transition-colors text-sm animate-fade-in"
          style={{ animationDelay: '0ms' }}
        >
          <ArrowLeft className="w-4 h-4" />
          {t("back_to_home")}
        </Link>

        <div className="relative max-w-3xl mx-auto">
          <div className="mb-4 animate-fade-up" style={{ animationDelay: '80ms' }}>
            <span className="inline-block text-emerald-400 text-sm font-medium tracking-widest uppercase">
              {t("about_label")}
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-up" style={{ animationDelay: '180ms' }}>
            {t("about_heading")}
          </h1>

          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-amber-400 mx-auto rounded-full mb-8 animate-fade-in" style={{ animationDelay: '320ms' }} />

          <p className="text-white/60 text-lg leading-relaxed max-w-xl mx-auto animate-fade-in" style={{ animationDelay: '420ms' }}>
            {t("about_page_subtitle")}
          </p>
        </div>
      </section>

      {/* Accordion */}
      <section className="flex-1 max-w-3xl mx-auto w-full px-6 py-20">
        <h2 className="text-2xl font-semibold text-stone-800 dark:text-stone-200 mb-8 animate-fade-up" style={{ animationDelay: '500ms' }}>
          {t("about_page_explore")}
        </h2>

        <Accordion type="single" collapsible className="space-y-4">
          {sections.map(({ id, icon: Icon, titleKey, contentKey }, index) => (
            <div key={id} className="animate-fade-up" style={{ animationDelay: `${560 + index * 60}ms` }}>
              <AccordionItem
                value={id}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-stone-200 dark:border-gray-800 px-6 overflow-hidden"
              >
                <AccordionTrigger className="text-base font-semibold text-stone-900 dark:text-stone-100 hover:no-underline py-5">
                  <span className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </span>
                    {t(titleKey)}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-stone-600 dark:text-stone-400 leading-relaxed text-base pb-5">
                  {t(contentKey)}
                </AccordionContent>
              </AccordionItem>
            </div>
          ))}
        </Accordion>
      </section>

      <Footer />
    </main>
  )
}
