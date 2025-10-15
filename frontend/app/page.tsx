import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { Footer } from "@/components/footer";
import { FAQSection } from "@/components/faq";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
