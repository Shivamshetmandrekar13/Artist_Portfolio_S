"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionHeader from "./SectionHeader";

const STATS = [
  { value: 12, suffix: "+", label: "Years of practice" },
  { value: 24, suffix: "", label: "Solo & group exhibitions" },
  { value: 300, suffix: "+", label: "Works in private collections" },
  { value: 11, suffix: "", label: "Countries collected in" },
];

const AWARDS = [
  { year: "2025", title: "Contemporary Painter of the Year", org: "National Art Guild", place: "New Delhi" },
  { year: "2024", title: "Gold Medal — Figurative Painting", org: "Asia Pacific Art Biennial", place: "Singapore" },
  { year: "2022", title: "Artist Residency Fellowship", org: "Atelier Lumière", place: "Paris" },
  { year: "2020", title: "Emerging Artist Grant", org: "Arts Council of Maharashtra", place: "Mumbai" },
  { year: "2018", title: "Jury's Choice Award", org: "Annual Young Painters Salon", place: "Kolkata" },
];

const EXHIBITIONS = [
  "Monsoon Notebooks — Solo, Mumbai 2025",
  "Light & Ledger — Group, London 2024",
  "Quiet Cities — Solo, Singapore 2023",
  "The Gilded Hour — Paris 2022",
  "New Indian Figuration — Dubai 2021",
  "Salt & Saffron — Solo, Goa 2019",
];

const EASE = [0.16, 1, 0.3, 1] as const;

function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!inView || !node) return;
    if (reduced) {
      node.textContent = `${to}${suffix}`;
      return;
    }
    const controls = animate(0, to, {
      duration: 1.8,
      ease: EASE,
      onUpdate: (v) => {
        node.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduced, to, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

export default function Recognition() {
  return (
    <div>
      <div className="container">
        {/* Heading */}
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <SectionHeader index="05" label="Awards & Recognition" />
            <h2 className="mt-8 text-[clamp(2.5rem,6vw,4.75rem)] font-light leading-[1]">
              A decade of <em className="text-[var(--color-gold)]">recognition</em>
            </h2>
          </div>
          <p className="max-w-md text-[0.975rem] leading-relaxed text-[var(--color-text-muted)] md:col-span-5">
            From a first group show in a Kala Ghoda gallery to museum walls abroad — the work has
            found its way into homes, institutions, and collections across four continents.
          </p>
        </div>

        {/* Stats */}
        <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--r-lg)] border border-[var(--color-border-soft)] bg-[var(--color-border-soft)] md:grid-cols-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
              className="flex flex-col gap-2 bg-[var(--color-surface)] p-6 md:p-8"
            >
              <dt className="order-2 text-[0.75rem] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                {stat.label}
              </dt>
              <dd className="font-display order-1 text-[clamp(2.75rem,5vw,4rem)] font-light leading-none text-[var(--color-text)]">
                <CountUp to={stat.value} suffix={stat.suffix} />
              </dd>
            </motion.div>
          ))}
        </dl>

        {/* Awards list */}
        <ul className="mt-20 border-t border-[var(--color-border)]">
          {AWARDS.map((award, i) => (
            <motion.li
              key={award.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
              className="group relative overflow-hidden border-b border-[var(--color-border)]"
            >
              {/* Gold sweep on hover */}
              <span
                aria-hidden="true"
                className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[rgba(200,169,110,0.1)] to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100"
              />
              <div className="relative grid grid-cols-[4.5rem_1fr_auto] items-baseline gap-x-4 gap-y-1 py-6 md:grid-cols-12 md:gap-6 md:py-8">
                <span className="font-display text-lg text-[var(--color-gold)] md:col-span-2 md:text-xl">
                  {award.year}
                </span>
                <span className="font-display text-[clamp(1.35rem,2.6vw,2.1rem)] font-light leading-tight transition-transform duration-500 group-hover:translate-x-2 md:col-span-6">
                  {award.title}
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-5 self-center text-[var(--color-text-dim)] transition-all duration-500 group-hover:rotate-45 group-hover:text-[var(--color-gold)] md:order-last md:col-span-1 md:justify-self-end"
                />
                <span className="col-start-2 text-[0.8125rem] text-[var(--color-text-muted)] md:col-span-3 md:col-start-auto">
                  {award.org}
                  <span className="text-[var(--color-text-dim)]"> · {award.place}</span>
                </span>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Exhibitions ribbon */}
      <div className="mt-20 border-y border-[var(--color-border-soft)] py-6">
        <p className="container mb-4 text-[0.6875rem] uppercase tracking-[0.25em] text-[var(--color-text-dim)]">
          Selected exhibitions
        </p>
        <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-[marquee_45s_linear_infinite] hover:[animation-play-state:paused] motion-reduce:animate-none">
            {[...EXHIBITIONS, ...EXHIBITIONS].map((item, i) => (
              <span
                key={i}
                aria-hidden={i >= EXHIBITIONS.length}
                className="font-display flex items-center whitespace-nowrap px-8 text-[clamp(1.25rem,2.4vw,1.75rem)] font-light italic text-[var(--color-text-muted)]"
              >
                {item}
                <span className="ml-16 text-[var(--color-gold)] not-italic">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
