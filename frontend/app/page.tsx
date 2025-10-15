import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { Footer } from "@/components/footer";
import { FAQSection } from "@/components/faq";
import { TestimonialsSection } from "@/components/testimonials";
import { MissionSection } from "@/components/mission";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <MissionSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
