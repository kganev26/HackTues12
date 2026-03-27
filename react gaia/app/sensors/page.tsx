"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import type { TranslationKey } from "@/lib/translations"
import AuthGuard from "@/components/auth-guard"

const GRAFANA_BASE = "http://10.210.46.104:3000"
const DASHBOARD_UID = "gaia-sensors"
const DASHBOARD_SLUG = "gaia-sensor-dashboard"

const TIME_RANGES = [
  { label: "1 h",  value: "now-1h" },
  { label: "6 h",  value: "now-6h" },
  { label: "24 h", value: "now-24h" },
  { label: "7 d",  value: "now-7d" },
  { label: "30 d", value: "now-30d" },
]

const REFRESH_RATES = [
  { label: "Off",  value: "" },
  { label: "10 s", value: "10s" },
  { label: "30 s", value: "30s" },
  { label: "1 m",  value: "1m" },
  { label: "5 m",  value: "5m" },
]

const panels: { id: number; labelKey: TranslationKey; icon: string }[] = [
  { id: 1, labelKey: "sensors_temperature",  icon: "🌡️" },
  { id: 2, labelKey: "sensors_humidity",      icon: "💧" },
  { id: 3, labelKey: "sensors_soil_moisture", icon: "🌱" },
  { id: 4, labelKey: "sensors_water_events",  icon: "🚿" },
]

function SelectGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { label: string; value: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-400 dark:text-white/40 text-xs uppercase tracking-widest">{label}</span>
      <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-white/10">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              value === opt.value
                ? "bg-amber-400 text-black"
                : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function SensorsPage() {
  const { t } = useLanguage()
  const [from, setFrom] = useState("now-7d")
  const [refresh, setRefresh] = useState("30s")
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("currentUser")
    if (stored) {
      const user = JSON.parse(stored)
      setUserId(String(user.id))
    }
  }, [])

  function panelUrl(panelId: number) {
    const params = new URLSearchParams({
      orgId: "1",
      from,
      to: "now",
      timezone: "browser",
      __feature_dashboardScene: "true",
      panelId: `panel-${panelId}`,
    })
    if (refresh) params.set("refresh", refresh)
    if (userId) params.set("var-user_id", userId)
    // __feature.dashboardScene uses a dot which URLSearchParams encodes — set it raw
    return `${GRAFANA_BASE}/d-solo/${DASHBOARD_UID}/${DASHBOARD_SLUG}?${params.toString().replace("__feature_dashboardScene", "__feature.dashboardScene")}`
  }

  const selectedRange = TIME_RANGES.find((r) => r.value === from)?.label ?? ""

  return (
    <AuthGuard>
    <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-8 py-5 flex items-center gap-4">
        <Link href="/" className="text-3xl font-black text-amber-500 tracking-widest hover:opacity-80 transition-opacity">GAIA</Link>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700" />
        <span className="text-gray-400 text-sm font-medium uppercase tracking-widest">
          {t("sensors_label")}
        </span>
      </div>

      {/* Title + controls */}
      <div className="px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{t("sensors_title")}</h1>
          <p className="text-gray-500 dark:text-white/50 text-sm">
            {t("sensors_showing")} {selectedRange}
            {refresh ? ` · ${t("sensors_auto_refresh")} ${refresh}` : ` · ${t("sensors_auto_refresh_off")}`}.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <SelectGroup
            label={t("sensors_range")}
            options={TIME_RANGES}
            value={from}
            onChange={setFrom}
          />
          <SelectGroup
            label={t("sensors_refresh")}
            options={REFRESH_RATES}
            value={refresh}
            onChange={setRefresh}
          />
        </div>
      </div>

      {/* 2×2 panel grid */}
      <div className="px-8 pb-10 grid grid-cols-1 md:grid-cols-2 gap-5">
        {panels.map((panel) => (
          <div
            key={panel.id}
            className="rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-[#141414]"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-white/10">
              <span className="text-lg">{panel.icon}</span>
              <span className="text-sm font-semibold text-gray-700 dark:text-white/80">{t(panel.labelKey)}</span>
            </div>
            <iframe
              key={`${panel.id}-${from}-${refresh}`}
              src={panelUrl(panel.id)}
              width="100%"
              height="260"
              style={{ border: "none" }}
              title={t(panel.labelKey)}
              className="block"
            />
          </div>
        ))}
      </div>

      <div className="px-8 pb-8 text-center text-gray-400 dark:text-white/25 text-xs">
        {t("powered_by")}
      </div>
    </main>
    </AuthGuard>
  )
}
