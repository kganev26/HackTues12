"use client"

const GRAFANA_BASE = "http://localhost:3000"
const DASHBOARD_UID = "gaia-sensors"
const TIME_RANGE = "from=now-7d&to=now"
const REFRESH = "refresh=30s"
const THEME = "theme=dark"

function panelUrl(panelId: number) {
  return `${GRAFANA_BASE}/d-solo/${DASHBOARD_UID}/gaia-sensor-dashboard?orgId=1&panelId=${panelId}&${TIME_RANGE}&${REFRESH}&${THEME}`
}

const panels = [
  { id: 1, label: "Temperature", icon: "🌡️" },
  { id: 2, label: "Humidity",    icon: "💧" },
  { id: 3, label: "Soil Moisture", icon: "🌱" },
  { id: 4, label: "Water Events",  icon: "🚿" },
]

export default function SensorsPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-8 py-5 flex items-center gap-4">
        <span className="text-3xl font-black text-amber-400 tracking-widest">GAIA</span>
        <div className="w-px h-6 bg-white/20" />
        <span className="text-white/60 text-sm font-medium uppercase tracking-widest">
          Sensor Dashboard
        </span>
      </div>

      {/* Description */}
      <div className="px-8 py-6">
        <h1 className="text-2xl font-bold text-white mb-1">Live Sensor Data</h1>
        <p className="text-white/50 text-sm">
          Real-time readings from field sensors — last 7 days, refreshed every 30 s.
        </p>
      </div>

      {/* 2×2 panel grid */}
      <div className="px-8 pb-10 grid grid-cols-1 md:grid-cols-2 gap-5">
        {panels.map((panel) => (
          <div
            key={panel.id}
            className="rounded-xl overflow-hidden border border-white/10 bg-[#141414]"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
              <span className="text-lg">{panel.icon}</span>
              <span className="text-sm font-semibold text-white/80">{panel.label}</span>
            </div>
            <iframe
              src={panelUrl(panel.id)}
              width="100%"
              height="260"
              frameBorder="0"
              title={panel.label}
              className="block"
            />
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="px-8 pb-8 text-center text-white/25 text-xs">
        Powered by Grafana · TimescaleDB · GAIA Smart Farm
      </div>
    </main>
  )
}
