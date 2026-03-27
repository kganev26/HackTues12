'use client'

import Link from "next/link"
import { Cpu, Droplets, Leaf, Settings, Users, Globe, Sprout } from "lucide-react"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/language-context"
import type { TranslationKey } from "@/lib/translations"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import AuthGuard from "@/components/auth-guard"

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
    <AuthGuard>
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 dark:from-gray-950 dark:to-gray-900 flex flex-col">

      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-8 py-5 flex items-center gap-4">
        <Link href="/" className="text-3xl font-black text-amber-500 tracking-widest hover:opacity-80 transition-opacity">GAIA</Link>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700" />
        <span className="text-gray-400 text-sm font-medium uppercase tracking-widest">
          {t("about_heading")}
        </span>
      </div>

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
    </AuthGuard>
  )
}
