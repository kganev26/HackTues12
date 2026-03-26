'use client'

import Link from "next/link"
import { Leaf, Droplets, Recycle, Factory, ArrowLeft, CheckCircle } from "lucide-react"
import { Footer } from "@/components/footer"

const benefits = [
  "Consistent access to irrigation water even during drought periods.",
  "Reduced water costs — recycled water is supplied at a fraction of municipal rates.",
  "Mineral-balanced water that supports healthier root systems and higher yields.",
  "Full traceability: every litre delivered is logged and certified, so you always know what goes into your soil.",
  "Automated delivery schedules driven by Gaia's AI, so water is never wasted.",
  "Lower carbon footprint — repurposing existing water reduces the energy needed to source and treat fresh water.",
]

const steps = [
  {
    number: 1,
    title: "Collection",
    body: "Wastewater discharged by data centre cooling systems is captured at source before it can enter drainage or evaporate. Gaia partners directly with data centre operators to integrate collection infrastructure at their facilities.",
  },
  {
    number: 2,
    title: "Primary Filtration",
    body: "The collected water passes through a multi-stage physical filtration system that removes particulates, heavy metals, and chemical residues from coolant fluids, reducing turbidity and making the water safe for further processing.",
  },
  {
    number: 3,
    title: "Biological Treatment",
    body: "A bio-filtration stage uses naturally occurring beneficial microorganisms to break down organic contaminants. This mirrors the natural water cycle and produces water with a healthy mineral profile suited for irrigation.",
  },
  {
    number: 4,
    title: "Quality Certification & Delivery",
    body: "Every batch is tested against agricultural water quality standards before it is certified safe. Gaia's smart irrigation system then delivers the right amount of certified water to each crop zone based on real-time sensor data from the farm.",
  },
]

export default function SustainableGrowthPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100">
      {/* Back button */}
      <div className="px-6 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-medium transition-colors animate-fade-in"
          style={{ animationDelay: '0ms' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Hero */}
      <section className="py-20 px-6 md:px-12 text-center">
        <div className="max-w-3xl mx-auto">
          <span
            className="inline-block text-emerald-700 text-sm font-medium tracking-widest uppercase mb-4 animate-fade-in"
            style={{ animationDelay: '80ms' }}
          >
            Sustainability
          </span>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 mb-6 text-balance animate-fade-up"
            style={{ animationDelay: '180ms' }}
          >
            Sustainable Growth
          </h1>
          <div
            className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-amber-500 mx-auto rounded-full mb-8 animate-fade-in"
            style={{ animationDelay: '320ms' }}
          />
          <p
            className="text-xl text-stone-600 leading-relaxed animate-fade-in"
            style={{ animationDelay: '420ms' }}
          >
            How Gaia turns the wastewater from AI data centres into clean, usable irrigation water for your farm.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <div
            className="flex items-center gap-3 mb-6 animate-fade-up"
            style={{ animationDelay: '0ms' }}
          >
            <Factory className="w-7 h-7 text-amber-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900">The Problem: AI Data Centres Are Thirsty</h2>
          </div>
          <p
            className="text-lg text-stone-600 leading-relaxed mb-6 animate-fade-in"
            style={{ animationDelay: '100ms' }}
          >
            Modern AI data centres consume enormous amounts of water to cool their servers. A single large data
            centre can use millions of litres of water every day, most of which is expelled as hot, contaminated
            wastewater — a massive burden on local freshwater supplies and ecosystems.
          </p>
          <p
            className="text-lg text-stone-600 leading-relaxed animate-fade-in"
            style={{ animationDelay: '200ms' }}
          >
            At the same time, farmers across the world face increasingly severe water shortages driven by climate
            change and growing demand. These two crises — excess wastewater and agricultural water scarcity — are
            exactly what Gaia was built to bridge.
          </p>
        </div>
      </section>

      {/* Filtration Pipeline */}
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div
            className="flex items-center gap-3 mb-10 animate-fade-up"
            style={{ animationDelay: '0ms' }}
          >
            <Recycle className="w-7 h-7 text-emerald-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900">Our Solution: The Filtration Pipeline</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className="bg-white rounded-2xl shadow-md p-8 border border-stone-100 animate-fade-up"
                style={{ animationDelay: `${100 + i * 100}ms` }}
              >
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-stone-900 mb-3">{step.title}</h3>
                <p className="text-stone-600 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <div
            className="flex items-center gap-3 mb-10 animate-fade-up"
            style={{ animationDelay: '0ms' }}
          >
            <Droplets className="w-7 h-7 text-emerald-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900">What This Means for Your Farm</h2>
          </div>

          <ul className="space-y-5">
            {benefits.map((benefit, i) => (
              <li
                key={i}
                className="flex items-start gap-4 animate-fade-in"
                style={{ animationDelay: `${80 + i * 80}ms` }}
              >
                <CheckCircle className="w-6 h-6 text-emerald-600 mt-0.5 shrink-0" />
                <span className="text-lg text-stone-600 leading-relaxed">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Environmental Impact */}
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div
            className="flex items-center gap-3 mb-6 animate-fade-up"
            style={{ animationDelay: '0ms' }}
          >
            <Leaf className="w-7 h-7 text-emerald-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900">The Bigger Picture</h2>
          </div>
          <p
            className="text-lg text-stone-600 leading-relaxed mb-6 animate-fade-in"
            style={{ animationDelay: '100ms' }}
          >
            By closing the loop between AI infrastructure and agriculture, Gaia contributes to a circular water economy.
            Water that would have been wasted is given a second life, and the technology that consumes it pays back
            into the communities and ecosystems it depends on.
          </p>
          <p
            className="text-lg text-stone-600 leading-relaxed animate-fade-in"
            style={{ animationDelay: '200ms' }}
          >
            Our goal is a future where every data centre operating in an agricultural region is paired with a Gaia
            network — turning an environmental liability into a shared resource that makes both industries more
            resilient and sustainable.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
