import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { Footer } from "@/components/footer";
import { FAQSection } from "@/components/faq";
import { TestimonialsSection } from "@/components/testimonials";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
