import type { Metadata } from "next";
import Link from "next/link";
import ExpandPage, { ExpandHeading, SERIF } from "@/components/ExpandPage";

export const metadata: Metadata = {
  title: "Services",
  description: "Commission original artwork, workshops, prints, and art consulting with Aryan Mehta.",
};

const SERVICES = [
  {
    title: "Custom Commissions",
    body: "An original painting made for your space, from first sketch to finished canvas.",
  },
  {
    title: "Workshops & Classes",
    body: "Small-group and one-to-one sessions in oil, acrylic and mixed media at the studio.",
  },
  {
    title: "Prints & Reproductions",
    body: "Signed, limited-edition fine-art prints of selected works from the collection.",
  },
  {
    title: "Art Consulting",
    body: "Help choosing, placing and lighting artwork for homes, offices and hotels.",
  },
];

export default function ServicesPage() {
  return (
    <ExpandPage
      src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=2400&q=80"
      alt="Paint brushes laying colour onto a canvas"
      eyebrow="What I Offer"
      title="Services"
      scrollHint="Scroll to see what we can make together"
    >
      <ExpandHeading eyebrow="Commissions · Workshops · Prints">
        Art, made with you in mind.
      </ExpandHeading>

      <p className="mt-6 max-w-2xl text-[clamp(0.95rem,1.4vw,1.125rem)] leading-relaxed text-white/85">
        Whether you want a painting for a single wall or a whole collection, every project starts with a
        conversation about the light, the room and the feeling you want to live with.
      </p>

      <ul className="mt-10 grid w-full grid-cols-2 gap-px overflow-hidden rounded-[var(--r-lg)] border border-white/20 bg-white/20 text-left lg:grid-cols-4">
        {SERVICES.map(({ title, body }, i) => (
          <li key={title} className="flex flex-col gap-2 bg-black/30 p-4 backdrop-blur-sm sm:p-6">
            <span className="text-[0.65rem] tracking-[0.2em] text-white/50">0{i + 1}</span>
            <h2 className="text-[clamp(1.1rem,1.8vw,1.4rem)] font-light leading-tight" style={{ fontFamily: SERIF }}>
              {title}
            </h2>
            <p className="hidden text-sm leading-relaxed text-white/75 sm:block">{body}</p>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link href="/contact" className="btn btn-primary">
          Start a Commission
        </Link>
        <Link href="/gallery" className="btn btn-outline !border-white/50 !text-white hover:!border-white">
          See Past Work
        </Link>
      </div>
    </ExpandPage>
  );
}
