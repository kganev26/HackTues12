"use client"

import Link from "next/link"

export function AboutSection() {
  return (
    <section className="py-32 px-6 md:px-12 bg-gradient-to-b from-stone-50 to-stone-100">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span
            className="inline-block text-emerald-700 text-sm font-medium tracking-widest uppercase mb-4 animate-fade-in"
            style={{ animationDelay: '0ms' }}
          >
            Our Mission
          </span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 mb-6 text-balance animate-fade-up"
            style={{ animationDelay: '100ms' }}
          >
            About Gaia
          </h2>
          <div
            className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-amber-500 mx-auto rounded-full animate-fade-in"
            style={{ animationDelay: '250ms' }}
          />
        </div>

        {/* Text Content */}
        <div className="space-y-8 text-center">
          <p
            className="text-xl md:text-2xl text-stone-700 leading-relaxed font-light animate-fade-in"
            style={{ animationDelay: '350ms' }}
          >
            Gaia is an intelligent, sustainable ecosystem created for the needs of the modern farmer,
            combining advanced hardware sensors with powerful artificial intelligence to optimize every aspect of plant care.
          </p>

          <p
            className="text-lg text-stone-600 leading-relaxed animate-fade-in"
            style={{ animationDelay: '450ms' }}
          >
            What truly sets Gaia apart is its innovative approach to sustainability. It repurposes recycled water
            generated from cooling AI servers and redirects it for irrigation, turning technological waste into
            a valuable agricultural resource.
          </p>

          <p
            className="text-lg text-stone-600 leading-relaxed animate-fade-in"
            style={{ animationDelay: '550ms' }}
          >
            With Gaia, farming becomes more efficient, cost-effective, and environmentally responsible.
            It empowers farmers to care not only for their crops, but also for the planet—creating a balance
            between technological progress and ecological preservation.
          </p>

          <div
            className="animate-fade-up"
            style={{ animationDelay: '650ms' }}
          >
            <Link
              href="/about"
              className="inline-block mt-4 text-emerald-700 font-medium hover:text-emerald-900 transition-colors border-b border-emerald-700 hover:border-emerald-900 pb-0.5"
            >
              Read More
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
