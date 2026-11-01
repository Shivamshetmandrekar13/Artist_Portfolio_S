import type { Metadata } from "next";
import IntroAnimation from "@/components/ui/scroll-morph-hero";
import PortfolioHero from "@/components/ui/portfolio-hero";
import FeaturedCarousel from "@/components/home/FeaturedCarousel";
import type { FlexCarouselItem } from "@/components/ui/FlexCarousel";
import ArtistStatement from "@/components/home/ArtistStatement";
import Recognition from "@/components/home/Recognition";
import CallToAction from "@/components/home/CallToAction";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Aryan Mehta — Fine Art Portfolio",
  description: "Official portfolio of Aryan Mehta, a contemporary fine artist based in Mumbai.",
};

const ART = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`;

const FEATURED_WORKS: FlexCarouselItem[] = [
  { title: "Monsoon Bloom", alt: "Monsoon Bloom", src: ART("1579783902614-a3fb3927b6a5") },
  { title: "Saffron Tide", alt: "Saffron Tide", src: ART("1578301978693-85fa9c0320b9") },
  { title: "Quiet Fracture", alt: "Quiet Fracture", src: ART("1541961017774-22349e4a1262") },
  { title: "Ember Study", alt: "Ember Study", src: ART("1547891654-e66ed7ebb968") },
  { title: "Harbour Light", alt: "Harbour Light", src: ART("1518998053901-5348d3961a04") },
  { title: "Indigo Hours", alt: "Indigo Hours", src: ART("1574182245530-967d9b3831af") },
  { title: "Gilded Silence", alt: "Gilded Silence", src: ART("1536924940846-227afb31e2a5") },
  { title: "Rust & Reverie", alt: "Rust & Reverie", src: ART("1580136579312-94651dfd596d") },
  { title: "Marine Drive", alt: "Marine Drive", src: ART("1515405295579-ba7b45403062") },
];

export default function HomePage() {
  return (
    <div className={styles.page}>
      {/* Section 1: Hero — Scroll Morph Hero */}
      <section className="relative w-full h-[calc(100vh-var(--nav-h))] min-h-[720px] overflow-hidden border-b border-[var(--color-border-soft)]">
        <IntroAnimation
          introTitle="Aryan Mehta — Fine Art"
          introSubtitle="SCROLL TO EXPLORE THE ATELIER"
          activeHeading="Explore The Collection"
          activeDescription="Where classical craftsmanship meets contemporary vision. Scroll through original oil, acrylic, and mixed-media masterpieces."
          theme="dark"
        />
      </section>

      {/* Section 2: Artist Introduction */}
      <section id="introduction" className="relative w-full border-b border-[var(--color-border-soft)]">
        <PortfolioHero scrollTargetId="section-3" />
      </section>

      {/* Section 3: Featured Works — Flex Carousel */}
      <FeaturedCarousel id="section-3" items={FEATURED_WORKS} />

      {/* Section 4: Artist Statement */}
      <section id="section-4" className="relative w-full py-[clamp(5rem,10vw,9rem)]">
        <ArtistStatement />
      </section>

      {/* Section 5: Awards & Recognition */}
      <section
        id="section-5"
        className="relative w-full border-y border-[var(--color-border-soft)] bg-[var(--color-surface)] pt-[clamp(5rem,10vw,9rem)]"
      >
        <Recognition />
      </section>

      {/* Section 6: Call to Action */}
      <section id="section-6" className="relative w-full py-[clamp(5rem,10vw,9rem)]">
        <CallToAction />
      </section>
    </div>
  );
}
