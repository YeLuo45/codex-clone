import { Header } from "../sections/Header";
import { Hero } from "../sections/Hero";
import { SurfacesSection } from "../sections/SurfacesSection";
import { FeaturesSection } from "../sections/FeaturesSection";
import { TestimonialsSection } from "../sections/TestimonialsSection";
import { FinalCTA } from "../sections/FinalCTA";

export function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <SurfacesSection />
        <FeaturesSection />
        <TestimonialsSection />
      </main>
      <FinalCTA />
    </>
  );
}