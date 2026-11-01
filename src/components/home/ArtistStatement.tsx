"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import SectionHeader from "./SectionHeader";

const QUOTE =
  "I paint the moments that slip between seconds — the light on a monsoon window, the hush before a city wakes. Every canvas is an attempt to hold still what refuses to stay.";

const MEDIUMS = ["Oil on canvas", "Acrylic", "Mixed media", "Charcoal", "Gold leaf"];

/** One word of the quote, brightening as the reader scrolls through its slice of the passage. */
function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block whitespace-pre">
      {children}
    </motion.span>
  );
}

export default function ArtistStatement() {
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress: quoteProgress } = useScroll({
    target: quoteRef,
    offset: ["start 0.85", "end 0.45"],
  });
  const { scrollYProgress: figureProgress } = useScroll({
    target: figureRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(figureProgress, [0, 1], reduced ? ["0%", "0%"] : ["-8%", "8%"]);

  const words = QUOTE.split(" ");

  return (
    <div className="container">
      <SectionHeader index="04" label="Artist Statement" />

      <blockquote
        ref={quoteRef}
        className="font-display mt-10 max-w-5xl text-[clamp(1.75rem,4.2vw,3.6rem)] font-light leading-[1.15] tracking-[-0.01em] text-[var(--color-text)]"
      >
        {reduced
          ? QUOTE
          : words.map((word, i) => (
              <Word
                key={i}
                progress={quoteProgress}
                range={[i / words.length, (i + 1) / words.length]}
              >
                {i < words.length - 1 ? `${word} ` : word}
              </Word>
            ))}
      </blockquote>

      <div className="mt-20 grid gap-12 md:grid-cols-12 md:gap-8">
        {/* Studio image with a gentle parallax */}
        <motion.figure
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-5"
        >
          <div
            ref={figureRef}
            className="relative aspect-[4/5] overflow-hidden rounded-[var(--r-lg)] border border-[var(--color-border-soft)]"
          >
            <motion.div style={{ y: imageY }} className="absolute -inset-y-[10%] inset-x-0">
              <Image
                src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1000&q=80"
                alt="Paint-laden palette and brushes in the studio"
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
          <figcaption className="mt-4 flex justify-between text-[0.75rem] uppercase tracking-[0.15em] text-[var(--color-text-dim)]">
            <span>The Studio</span>
            <span>Bandra, Mumbai</span>
          </figcaption>
        </motion.figure>

        {/* Statement body */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col justify-center md:col-span-6 md:col-start-7"
        >
          <h2 className="text-[clamp(2rem,3.5vw,2.75rem)] font-light">
            Between <em className="text-[var(--color-gold)]">memory</em> and material
          </h2>
          <div className="mt-6 space-y-5 text-[0.975rem] leading-relaxed text-[var(--color-text-muted)]">
            <p>
              My practice begins with observation — street corners, family rooms, the sea at dusk —
              and ends somewhere closer to feeling. I build each painting slowly, in thin glazes and
              heavy impasto, letting earlier layers show through like half-remembered conversations.
            </p>
            <p>
              Rooted in the Indian miniature tradition and shaped by European modernism, the work
              moves between figuration and abstraction. Gold leaf marks the moments I want to keep;
              raw canvas marks the ones I let go.
            </p>
          </div>

          <ul className="mt-8 flex flex-wrap gap-2">
            {MEDIUMS.map((m) => (
              <li key={m} className="tag tag-muted">
                {m}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-[var(--color-border-soft)] pt-6">
            <div>
              <p className="font-display text-3xl italic text-[var(--color-gold)]">Aryan Mehta</p>
              <p className="mt-1 text-[0.75rem] uppercase tracking-[0.15em] text-[var(--color-text-dim)]">
                Painter · Founder of Studio AM
              </p>
            </div>
            <Link href="/about" className="btn btn-ghost group">
              Read the full story
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
