"use client"

import { ChevronRight, Cpu, Leaf, Droplets } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import type { TranslationKey } from "@/lib/translations"

const features = [
  {
    titleKey: "feat_sensors_title" as TranslationKey,
    descKey: "feat_sensors_desc" as TranslationKey,
    image: "https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=600",
    icon: Droplets,
    href: "/sensors",
  },
  {
    titleKey: "feat_ai_title" as TranslationKey,
    descKey: "feat_ai_desc" as TranslationKey,
    image: "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=600",
    icon: Cpu,
    href: "/chat",
  },
  {
    titleKey: "feat_growth_title" as TranslationKey,
    descKey: "feat_growth_desc" as TranslationKey,
    image: "https://pepi.bg/wp-content/uploads/2025/07/kapkovo-napoqvane.webp",
    icon: Leaf,
    href: "/sustainable-growth",
  },
]

export function FeaturesSection() {
  const { t } = useLanguage()

  return (
    <section className="relative z-10 flex flex-wrap justify-center gap-8 px-[5%] py-24 -mt-28">
      {features.map((feature, index) => (
        <div
          key={index}
          className="group bg-card flex flex-col flex-1 min-w-[300px] max-w-[360px] shadow-xl rounded transition-transform duration-300 hover:-translate-y-2 overflow-hidden animate-fade-up"
          style={{ animationDelay: `${index * 120}ms` }}
        >
          <div className="p-10 min-h-[200px]">
            <div className="flex items-center gap-3 mb-4">
              <feature.icon className="w-6 h-6 text-green-700" />
              <h3 className="text-xl font-bold text-card-foreground">{t(feature.titleKey)}</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">{t(feature.descKey)}</p>
          </div>

          <div className="relative w-full h-60">
            {feature.href ? (
              <Link
                href={feature.href}
                className="absolute -top-6 left-6 z-10 w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center border-4 border-white shadow-lg group-hover:scale-110 transition-transform"
              >
                <ChevronRight className="w-5 h-5" />
              </Link>
            ) : (
              <div className="absolute -top-6 left-6 z-10 w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center border-4 border-white shadow-lg group-hover:scale-110 transition-transform">
                <ChevronRight className="w-5 h-5" />
              </div>
            )}
            <Image
              src={feature.image}
              alt={t(feature.titleKey)}
              fill
              className="object-cover"
            />
          </div>
        </div>
      ))}
    </section>
  )
}
