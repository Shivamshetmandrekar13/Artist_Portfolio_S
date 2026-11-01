import type { Metadata } from "next";
import Link from "next/link";
import ExpandPage, { ExpandHeading, SERIF } from "@/components/ExpandPage";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Aryan Mehta — his journey, inspirations, and artistic philosophy.",
};

const FACTS = [
  { value: "12+", label: "Years painting" },
  { value: "Mumbai", label: "Bandra studio" },
  { value: "Oil & mixed media", label: "Primary mediums" },
];

export default function AboutPage() {
  return (
    <ExpandPage
      src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=2400&q=80"
      alt="Paint brushes and canvases in the artist's studio"
      eyebrow="The Artist"
      title="About Me"
      scrollHint="Scroll to step into the studio"
    >
      <ExpandHeading eyebrow="Aryan Mehta · Contemporary Fine Artist">
        I paint what the light leaves behind.
      </ExpandHeading>

      <div className="mt-6 max-w-3xl space-y-4 text-[clamp(0.95rem,1.4vw,1.125rem)] leading-relaxed text-white/85">
        <p>
          I grew up in Mumbai, between the sea and the monsoon, and I have spent more than twelve years
          trying to hold on to the moments that pass too quickly. A wet window. A street just before it
          wakes. The gold of late afternoon on an old wall.
        </p>
        <p className="hidden sm:block">
          I work mostly in oil and mixed media from my studio in Bandra. I build each canvas slowly, layer
          over layer, until it feels less like a picture and more like a memory you can stand inside.
        </p>
      </div>

      <dl className="mt-10 grid w-full max-w-3xl grid-cols-3 gap-4 border-t border-white/20 pt-6">
        {FACTS.map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <dt className="order-2 text-[0.65rem] uppercase tracking-[0.2em] text-white/60">{label}</dt>
            <dd className="order-1 text-[clamp(1.1rem,2.4vw,1.75rem)] font-light" style={{ fontFamily: SERIF }}>
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link href="/gallery" className="btn btn-primary">
          View the Collection
        </Link>
        <Link href="/contact" className="btn btn-outline !border-white/50 !text-white hover:!border-white">
          Commission a Piece
        </Link>
      </div>
    </ExpandPage>
  );
}
