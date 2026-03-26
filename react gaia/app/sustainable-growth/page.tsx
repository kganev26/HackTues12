'use client'

import Link from "next/link"
import { Leaf, Droplets, Recycle, Factory, ArrowLeft, CheckCircle, FlaskConical, Truck } from "lucide-react"
import { Footer } from "@/components/footer"

const steps = [
  {
    number: 1,
    icon: Factory,
    title: "Collection",
    body: "Wastewater discharged by data centre cooling systems is captured at source before it can enter drainage or evaporate. Gaia partners directly with data centre operators to integrate collection infrastructure at their facilities.",
  },
  {
    number: 2,
    icon: FlaskConical,
    title: "Primary Filtration",
    body: "The collected water passes through a multi-stage physical filtration system that removes particulates, heavy metals, and chemical residues from coolant fluids, reducing turbidity and making the water safe for further processing.",
  },
  {
    number: 3,
    icon: Recycle,
    title: "Biological Treatment",
    body: "A bio-filtration stage uses naturally occurring beneficial microorganisms to break down organic contaminants. This mirrors the natural water cycle and produces water with a healthy mineral profile suited for irrigation.",
  },
  {
    number: 4,
    icon: Truck,
    title: "Quality Certification & Delivery",
    body: "Every batch is tested against agricultural water quality standards before it is certified safe. Gaia's smart irrigation system then delivers the right amount of certified water to each crop zone based on real-time sensor data from the farm.",
  },
]

const benefits = [
  "Consistent access to irrigation water even during drought periods.",
  "Reduced water costs — recycled water is supplied at a fraction of municipal rates.",
  "Mineral-balanced water that supports healthier root systems and higher yields.",
  "Full traceability: every litre delivered is logged and certified.",
  "Automated delivery schedules driven by Gaia's AI, so water is never wasted.",
  "Lower carbon footprint — repurposing existing water reduces treatment energy.",
]

const stats = [
  { value: "4-stage", label: "filtration process" },
  { value: "100%", label: "quality certified" },
  { value: "0 waste", label: "circular water loop" },
]

export default function SustainableGrowthPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100">

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0a0f0c] px-6 pt-8 pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.15)_0%,_transparent_65%)]" />

        {/* Back button — top left */}
        <Link
          href="/"
          className="absolute top-8 left-6 inline-flex items-center gap-2 text-white/50 hover:text-white font-medium transition-colors text-sm animate-fade-in"
          style={{ animationDelay: '0ms' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Hero text — centred */}
        <div className="relative max-w-3xl mx-auto text-center">
          <span
            className="inline-block text-emerald-400 text-sm font-medium tracking-widest uppercase mb-4 animate-fade-in"
            style={{ animationDelay: '80ms' }}
          >
            Sustainability
          </span>
          <h1
            className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-up"
            style={{ animationDelay: '180ms' }}
          >
            Sustainable Growth
          </h1>
          <div
            className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-amber-400 mx-auto rounded-full mb-8 animate-fade-in"
            style={{ animationDelay: '300ms' }}
          />
          <p
            className="text-white/60 text-lg leading-relaxed max-w-xl mx-auto animate-fade-in"
            style={{ animationDelay: '400ms' }}
          >
            How Gaia turns the wastewater from AI data centres into clean, certified irrigation water for your farm.
          </p>
        </div>

        {/* Stats strip */}
        <div
          className="relative max-w-2xl mx-auto mt-14 grid grid-cols-3 divide-x divide-white/10 animate-fade-up"
          style={{ animationDelay: '520ms' }}
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center px-6 py-4">
              <div className="text-2xl font-bold text-emerald-400 mb-1">{s.value}</div>
              <div className="text-white/40 text-xs uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* The Problem */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <div
            className="flex items-center gap-3 mb-8 animate-fade-up"
            style={{ animationDelay: '0ms' }}
          >
            <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Factory className="w-5 h-5" />
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900">
              The Problem: AI Data Centres Are Thirsty
            </h2>
          </div>

          <div className="pl-[52px] space-y-5">
            <p
              className="text-lg text-stone-600 leading-relaxed animate-fade-in"
              style={{ animationDelay: '100ms' }}
            >
              Modern AI data centres consume enormous amounts of water to cool their servers. A single large
              facility can use millions of litres per day — most of which is expelled as hot, contaminated
              wastewater and becomes a burden on local freshwater supplies and ecosystems.
            </p>
            <p
              className="text-lg text-stone-600 leading-relaxed animate-fade-in"
              style={{ animationDelay: '200ms' }}
            >
              At the same time, farmers face increasingly severe water shortages driven by climate change and
              growing demand. These two crises — excess industrial wastewater and agricultural scarcity — are
              exactly what Gaia was built to bridge.
            </p>
          </div>
        </div>
      </section>

      {/* Filtration Pipeline — vertical timeline */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <div
            className="flex items-center gap-3 mb-12 animate-fade-up"
            style={{ animationDelay: '0ms' }}
          >
            <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Recycle className="w-5 h-5" />
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900">
              The Filtration Pipeline
            </h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-400 via-emerald-300 to-transparent" />

            <div className="space-y-10">
              {steps.map((step, i) => {
                const Icon = step.icon
                return (
                  <div
                    key={step.number}
                    className="relative flex gap-8 animate-fade-up"
                    style={{ animationDelay: `${80 + i * 120}ms` }}
                  >
                    {/* Circle on timeline */}
                    <div className="relative z-10 w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-600/30 border-4 border-stone-50">
                      <Icon className="w-4 h-4" />
                    </div>

                    {/* Card */}
                    <div className="flex-1 bg-white rounded-2xl shadow-sm border border-stone-100 p-6 mb-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                          Step {step.number}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-stone-900 mb-2">{step.title}</h3>
                      <p className="text-stone-600 leading-relaxed text-sm">{step.body}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <div
            className="flex items-center gap-3 mb-10 animate-fade-up"
            style={{ animationDelay: '0ms' }}
          >
            <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Droplets className="w-5 h-5" />
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900">
              What This Means for Your Farm
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {benefits.map((benefit, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-stone-50 rounded-xl p-4 border border-stone-100 animate-fade-in"
                style={{ animationDelay: `${80 + i * 70}ms` }}
              >
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <span className="text-stone-600 leading-relaxed text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Bigger Picture */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div
            className="flex items-center gap-3 mb-8 animate-fade-up"
            style={{ animationDelay: '0ms' }}
          >
            <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5" />
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900">The Bigger Picture</h2>
          </div>

          <div className="pl-[52px] border-l-2 border-emerald-200 space-y-5">
            <p
              className="text-lg text-stone-600 leading-relaxed animate-fade-in"
              style={{ animationDelay: '100ms' }}
            >
              By closing the loop between AI infrastructure and agriculture, Gaia contributes to a circular
              water economy. Water that would have been wasted is given a second life, and the technology
              that consumes it pays back into the communities and ecosystems it depends on.
            </p>
            <p
              className="text-lg text-stone-600 leading-relaxed animate-fade-in"
              style={{ animationDelay: '200ms' }}
            >
              Our goal is a future where every data centre operating in an agricultural region is paired
              with a Gaia network — turning an environmental liability into a shared resource that makes
              both industries more resilient and sustainable.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
