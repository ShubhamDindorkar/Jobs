import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { JobListings } from "@/components/job-listings";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <JobListings />
      <Footer />
    </div>
  );
}
