import Link from "next/link";
import { ArrowRight, ArrowUpRight, Brush, Frame, Gem } from "lucide-react";
import SectionHeader from "./SectionHeader";

const OFFERINGS = [
  {
    icon: Frame,
    title: "Original Works",
    text: "Acquire a one-of-a-kind painting from the current collection, shipped worldwide with certificate of authenticity.",
  },
  {
    icon: Brush,
    title: "Commissions",
    text: "A painting made for your space — a portrait, a place, a memory — developed together from sketch to final varnish.",
  },
  {
    icon: Gem,
    title: "Limited Editions",
    text: "Signed, numbered giclée prints on archival cotton rag, in runs of fifty or fewer.",
  },
];

export default function CallToAction() {
  return (
    <div className="container">
      <div className="relative overflow-hidden rounded-[var(--r-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-16 sm:px-10 md:px-16 md:py-24">
        {/* Ambient gold light */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[780px] -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: "radial-gradient(ellipse, rgba(200,169,110,0.18), transparent 70%)" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(var(--color-border-soft)_1px,transparent_1px),linear-gradient(90deg,var(--color-border-soft)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
        />

        <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
          <SectionHeader index="06" label="Work Together" />

          <span className="mt-10 inline-flex items-center gap-2.5 rounded-full border border-[rgba(200,169,110,0.25)] bg-[rgba(200,169,110,0.08)] px-4 py-1.5 text-[0.6875rem] uppercase tracking-[0.18em] text-[var(--color-gold)]">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--color-gold)] opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-[var(--color-gold)]" />
            </span>
            Now accepting commissions · Spring 2027
          </span>

          <h2 className="mt-8 text-[clamp(2.75rem,7vw,5.5rem)] font-light leading-[0.95] tracking-[-0.01em]">
            Let&rsquo;s bring your <em className="text-[var(--color-gold)]">vision</em> to canvas.
          </h2>

          <p className="mt-6 max-w-xl text-[1rem] leading-relaxed text-[var(--color-text-muted)]">
            Whether you&rsquo;re a first-time collector, an interior designer, or a gallery looking for
            new work, every conversation begins with a simple hello.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link href="/contact" className="btn btn-primary group justify-center">
              Commission a painting
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/gallery" className="btn btn-outline justify-center">
              Explore the gallery
            </Link>
          </div>
        </div>

        {/* Offerings */}
        <ul className="relative mt-16 grid gap-4 md:mt-20 md:grid-cols-3">
          {OFFERINGS.map(({ icon: Icon, title, text }) => (
            <li key={title}>
              <Link
                href="/services"
                className="card group flex h-full flex-col gap-4 !bg-[var(--color-bg)]/60 p-6 backdrop-blur-sm md:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-gold)] transition-colors group-hover:border-[var(--color-gold-dim)]">
                    <Icon className="size-5" strokeWidth={1.5} />
                  </span>
                  <ArrowUpRight className="size-5 text-[var(--color-text-dim)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-gold)]" />
                </div>
                <h3 className="text-2xl font-normal">{title}</h3>
                <p className="text-[0.875rem] leading-relaxed text-[var(--color-text-muted)]">{text}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
