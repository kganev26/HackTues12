import Link from "next/link"
import { ArrowLeft, Cpu, Droplets, Leaf, Settings, Users, Globe, Sprout } from "lucide-react"
import { Footer } from "@/components/footer"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const sections = [
  {
    id: "what-is-gaia",
    icon: Sprout,
    title: "What is Gaia?",
    content:
      "Gaia is a smart farming platform built around one core belief: technology and nature should work together, not against each other. It was created to give modern farmers the tools they need to grow more efficiently, use resources responsibly, and make informed decisions backed by real data.",
  },
  {
    id: "sensors-and-ai",
    icon: Cpu,
    title: "Sensors & AI",
    content:
      "At its foundation, Gaia combines a network of IoT hardware sensors with an AI-powered analysis layer. Sensors placed across the farm continuously measure soil moisture, ambient temperature, water levels, and lighting conditions. This data is streamed in real time to the Gaia platform, where machine learning models process it and surface actionable recommendations — telling farmers exactly when to water, when to adjust conditions, and when something needs attention.",
  },
  {
    id: "water-recycling",
    icon: Droplets,
    title: "Water Recycling",
    content:
      "One of Gaia's defining features is its approach to water. AI data centres consume vast amounts of water to cool their server infrastructure, and most of that water is discarded as waste. Gaia captures this wastewater, runs it through a multi-stage filtration process, and redirects it to partner farms as certified irrigation water. This turns a costly environmental problem into a shared agricultural resource, reducing pressure on freshwater supplies while lowering irrigation costs for farmers.",
  },
  {
    id: "automation",
    icon: Settings,
    title: "Automation",
    content:
      "The platform's automation layer means farmers spend less time reacting and more time planning. Irrigation schedules adjust automatically based on sensor readings and weather forecasts. Alerts notify farmers before problems escalate. Every action taken through Gaia is logged, giving farmers a full picture of their farm's history and making it easier to spot patterns, improve practices, and demonstrate responsible stewardship to buyers and regulators.",
  },
  {
    id: "accessibility",
    icon: Users,
    title: "Built for Every Farm",
    content:
      "Gaia was built by a team that believes small and mid-size farms should have access to the same quality of data and automation that large agricultural operations rely on. The hardware is designed to be straightforward to install and maintain. The software is built to be usable without specialist training. And the pricing model is structured so that the platform pays for itself through the savings it generates.",
  },
  {
    id: "sustainability",
    icon: Leaf,
    title: "Sustainability Goals",
    content:
      "Every litre of recycled water delivered, every unnecessary irrigation avoided, every crop grown with less waste — these are small steps toward a larger goal. Gaia contributes to a circular water economy by closing the loop between AI infrastructure and agriculture, making both industries more resilient and environmentally responsible.",
  },
  {
    id: "the-name",
    icon: Globe,
    title: "The Name",
    content:
      "The name Gaia comes from the ancient Greek personification of the Earth. It reflects the project's ambition: not just to make individual farms more productive, but to contribute to a broader balance between human activity and the natural systems we all depend on. Gaia is an ongoing project — the sensor hardware, filtration partnerships, and AI models are all actively developed and improved based on feedback from farmers in the field.",
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0a0f0c] px-6 py-24 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.12)_0%,_transparent_70%)]" />
        <div className="relative max-w-3xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white font-medium transition-colors mb-10 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="mb-4">
            <span className="inline-block text-emerald-400 text-sm font-medium tracking-widest uppercase">
              Our Mission
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">About Gaia</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-amber-400 mx-auto rounded-full mb-8" />
          <p className="text-white/60 text-lg leading-relaxed max-w-xl mx-auto">
            An intelligent farming ecosystem built on the belief that technology and nature should work together.
          </p>
        </div>
      </section>

      {/* Accordion */}
      <section className="flex-1 max-w-3xl mx-auto w-full px-6 py-20">
        <Accordion type="single" collapsible className="space-y-4">
          {sections.map(({ id, icon: Icon, title, content }) => (
            <AccordionItem
              key={id}
              value={id}
              className="bg-white rounded-xl shadow-sm border border-stone-200 px-6 overflow-hidden"
            >
              <AccordionTrigger className="text-base font-semibold text-stone-900 hover:no-underline py-5">
                <span className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </span>
                  {title}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-stone-600 leading-relaxed text-base pb-5">
                {content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <Footer />
    </main>
  )
}
