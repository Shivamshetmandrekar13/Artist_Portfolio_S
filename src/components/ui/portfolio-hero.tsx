"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// --- BlurText animation component ---
interface BlurTextProps {
  text: string;
  delay?: number;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  className?: string;
  style?: React.CSSProperties;
}

const BlurText: React.FC<BlurTextProps> = ({
  text,
  delay = 50,
  animateBy = "words",
  direction = "top",
  className = "",
  style,
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const segments = useMemo(
    () => (animateBy === "words" ? text.split(" ") : text.split("")),
    [text, animateBy]
  );

  return (
    <p ref={ref} aria-label={text} className={cn("inline-flex flex-wrap", className)} style={style}>
      {segments.map((segment, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="motion-reduce:!transition-none"
          style={{
            display: "inline-block",
            filter: inView ? "blur(0px)" : "blur(10px)",
            opacity: inView ? 1 : 0,
            transform: inView
              ? "translateY(0)"
              : `translateY(${direction === "top" ? "-20px" : "20px"})`,
            transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${i * delay}ms`,
          }}
        >
          {segment}
          {animateBy === "words" && i < segments.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
};

// --- Artist Introduction Hero ---
export interface PortfolioHeroProps {
  eyebrow?: string;
  firstName?: string;
  lastName?: string;
  tagline?: string;
  location?: string;
  portraitSrc?: string;
  portraitAlt?: string;
  /** id of the element the scroll indicator should scroll to */
  scrollTargetId?: string;
  className?: string;
}

const NAME_CLASS =
  "font-light text-[78px] sm:text-[120px] md:text-[160px] lg:text-[200px] leading-[0.8] tracking-[-0.02em] uppercase justify-center whitespace-nowrap";
const NAME_STYLE: React.CSSProperties = {
  color: "var(--color-gold)",
  fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif",
};

export default function PortfolioHero({
  eyebrow = "Meet the Artist",
  firstName = "Aryan",
  lastName = "Mehta",
  tagline = "Painting light, memory, and the quiet poetry of everyday life.",
  location = "Contemporary Fine Artist · Mumbai",
  portraitSrc = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
  portraitAlt = "Portrait of the artist",
  scrollTargetId,
  className,
}: PortfolioHeroProps) {
  const handleScroll = () => {
    if (!scrollTargetId) return;
    document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={cn(
        "relative w-full h-[calc(100vh-var(--nav-h))] min-h-[640px] overflow-hidden bg-transparent text-[var(--color-text)]",
        className
      )}
    >
      {/* Soft gold glow behind the portrait */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(200,169,110,0.14), transparent 65%)" }}
      />

      {/* Eyebrow */}
      <div className="absolute left-1/2 top-12 md:top-16 -translate-x-1/2 w-full px-6 text-center">
        <p className="text-[0.75rem] uppercase tracking-[0.3em] text-[var(--color-gold)]">
          {eyebrow}
        </p>
        <div className="gold-line" />
      </div>

      {/* Centered name with portrait */}
      <div className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 px-4">
        <div className="relative text-center">
          <h2 className="sr-only">
            {firstName} {lastName}
          </h2>
          <div>
            <BlurText text={firstName} delay={100} animateBy="letters" className={NAME_CLASS} style={NAME_STYLE} />
          </div>
          <div>
            <BlurText text={lastName} delay={100} animateBy="letters" className={NAME_CLASS} style={NAME_STYLE} />
          </div>

          {/* Portrait */}
          <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <div className="relative h-[120px] w-[72px] sm:h-[170px] sm:w-[100px] md:h-[210px] md:w-[124px] lg:h-[250px] lg:w-[148px] overflow-hidden rounded-full border border-[var(--color-gold-dim)] shadow-[0_20px_60px_rgba(0,0,0,0.6)] transition-transform duration-500 hover:scale-105">
              <Image
                src={portraitSrc}
                alt={portraitAlt}
                fill
                sizes="(min-width: 1024px) 148px, (min-width: 768px) 124px, (min-width: 640px) 100px, 72px"
                className="object-cover grayscale-[30%] transition-[filter] duration-500 hover:grayscale-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tagline */}
      <div className="absolute bottom-20 sm:bottom-24 lg:bottom-28 left-1/2 w-full -translate-x-1/2 px-6">
        <div className="flex flex-col items-center gap-3">
          <BlurText
            text={tagline}
            delay={120}
            animateBy="words"
            className="justify-center text-center text-[18px] sm:text-[22px] md:text-[26px] italic font-light text-[var(--color-text)]"
            style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif" }}
          />
          <p className="text-[0.6875rem] sm:text-[0.75rem] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            {location}
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        type="button"
        onClick={handleScroll}
        className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 text-[var(--color-text-dim)] transition-colors duration-300 hover:text-[var(--color-gold)]"
        aria-label="Scroll to next section"
      >
        <ChevronDown className="h-6 w-6 md:h-7 md:w-7 animate-bounce motion-reduce:animate-none" strokeWidth={1.5} />
      </button>
    </div>
  );
}
