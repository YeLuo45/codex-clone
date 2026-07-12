import { Header } from "../sections/Header";
import { Hero } from "../sections/Hero";
import { SurfacesSection } from "../sections/SurfacesSection";
import { FeaturesSection } from "../sections/FeaturesSection";
import { TestimonialsSection } from "../sections/TestimonialsSection";
import { FinalCTA } from "../sections/FinalCTA";
import { useDocumentHead } from "../lib/useDocumentHead";
import { metaFor, ROUTE_META } from "../lib/perPageMeta";

export function HomePage({ onSearchOpen }: { onSearchOpen?: () => void } = {}) {
  useDocumentHead(metaFor({ key: "home", ...ROUTE_META.home }));
  return (
    <>
      <Header onSearchOpen={onSearchOpen} />
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