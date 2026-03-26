import { ChevronRight, Cpu, Leaf, Droplets } from "lucide-react"
import Image from "next/image"

const features = [
  {
    title: "Smart Sensors",
    description: "Track soil moisture, temperature, water levels, and lighting in real-time with our high-precision IoT hardware.",
    image: "https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=600",
    icon: Droplets,
  },
  {
    title: "AI Analysis",
    description: "Artificial Intelligence analyzes your farm data to provide actionable insights and maximize efficiency.",
    image: "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=600",
    icon: Cpu,
  },
  {
    title: "Sustainable Growth",
    description: "Personalized advice and automation triggers to ensure your plants grow healthy and strong, using recycled water.",
    image: "https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=600",
    icon: Leaf,
  },
]

export function FeaturesSection() {
  return (
    <section className="relative z-10 flex flex-wrap justify-center gap-8 px-[5%] py-24 -mt-28">
      {features.map((feature, index) => (
        <div
          key={index}
          className="group bg-card flex flex-col flex-1 min-w-[300px] max-w-[360px] shadow-xl rounded transition-transform duration-300 hover:-translate-y-2 overflow-hidden"
        >
          <div className="p-10 min-h-[200px]">
            <div className="flex items-center gap-3 mb-4">
              <feature.icon className="w-6 h-6 text-green-700" />
              <h3 className="text-xl font-bold text-card-foreground">{feature.title}</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
          </div>
          
          <div className="relative w-full h-60">
            <div className="absolute -top-6 left-6 z-10 w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center border-4 border-white shadow-lg group-hover:scale-110 transition-transform">
              <ChevronRight className="w-5 h-5" />
            </div>
            <Image
              src={feature.image}
              alt={feature.title}
              fill
              className="object-cover"
            />
          </div>
        </div>
      ))}
    </section>
  )
}
