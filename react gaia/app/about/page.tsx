import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-stone-50 flex flex-col">
      <div className="flex-1 max-w-3xl mx-auto px-6 py-16 w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-medium transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-stone-900 mb-10">About Gaia</h1>

        <div className="space-y-6 text-stone-700 text-lg leading-relaxed">
          <p>
            Gaia is a smart farming platform built around one core belief: technology and nature should work together,
            not against each other. It was created to give modern farmers the tools they need to grow more efficiently,
            use resources responsibly, and make informed decisions backed by real data.
          </p>

          <p>
            At its foundation, Gaia combines a network of IoT hardware sensors with an AI-powered analysis layer.
            Sensors placed across the farm continuously measure soil moisture, ambient temperature, water levels,
            and lighting conditions. This data is streamed in real time to the Gaia platform, where machine learning
            models process it and surface actionable recommendations — telling farmers exactly when to water, when
            to adjust conditions, and when something needs attention.
          </p>

          <p>
            One of Gaia's defining features is its approach to water. AI data centres consume vast amounts of water
            to cool their server infrastructure, and most of that water is discarded as waste. Gaia captures this
            wastewater, runs it through a multi-stage filtration process, and redirects it to partner farms as
            certified irrigation water. This turns a costly environmental problem into a shared agricultural resource,
            reducing pressure on freshwater supplies while lowering irrigation costs for farmers.
          </p>

          <p>
            The platform's automation layer means farmers spend less time reacting and more time planning. Irrigation
            schedules adjust automatically based on sensor readings and weather forecasts. Alerts notify farmers
            before problems escalate. Every action taken through Gaia is logged, giving farmers a full picture of
            their farm's history and making it easier to spot patterns, improve practices, and demonstrate
            responsible stewardship to buyers and regulators.
          </p>

          <p>
            Gaia was built by a team that believes small and mid-size farms should have access to the same quality
            of data and automation that large agricultural operations rely on. The hardware is designed to be
            straightforward to install and maintain. The software is built to be usable without specialist training.
            And the pricing model is structured so that the platform pays for itself through the savings it generates.
          </p>

          <p>
            The name Gaia comes from the ancient Greek personification of the Earth. It reflects the project's
            ambition: not just to make individual farms more productive, but to contribute to a broader balance
            between human activity and the natural systems we all depend on. Every litre of recycled water delivered,
            every unnecessary irrigation avoided, every crop grown with less waste — these are small steps toward
            that larger goal.
          </p>

          <p>
            Gaia is an ongoing project. The sensor hardware, filtration partnerships, and AI models are all actively
            developed and improved based on feedback from farmers in the field. If you are a farmer, researcher,
            or partner interested in what Gaia is building, we would like to hear from you.
          </p>
        </div>
      </div>

      <Footer />
    </main>
  )
}
