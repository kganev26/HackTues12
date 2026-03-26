import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { AboutSection } from "@/components/about-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-w-full overflow-x-hidden">
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <Footer />
    </main>
  )
}
