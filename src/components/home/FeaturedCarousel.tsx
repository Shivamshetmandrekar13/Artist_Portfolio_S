"use client";

import { useEffect, useRef, useState } from "react";
import FlexCarousel, { type FlexCarouselItem } from "@/components/ui/FlexCarousel";

/** Scroll distance (in vh) spent on each card before the next one slides in. */
const SCROLL_PER_ITEM = 60;
/** Card height as a fraction of the stage on wide screens. */
const CARD_HEIGHT = 0.5;
/** Widest card aspect (landscape art) that must still fit a narrow screen. */
const MAX_CARD_ASPECT = 1.5;

interface FeaturedCarouselProps {
  id?: string;
  items: FlexCarouselItem[];
}

/**
 * Pins the carousel to the viewport while the section scrolls past, stepping
 * one card per SCROLL_PER_ITEM vh. After the last card the pin releases and
 * the page carries on to the next section.
 */
export default function FeaturedCarousel({ id, items }: FeaturedCarouselProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [cardHeight, setCardHeight] = useState(CARD_HEIGHT);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 0;
      const distance = section.offsetHeight - (window.innerHeight - nav);
      const progress = distance > 0 ? Math.min(Math.max((nav - rect.top) / distance, 0), 1) : 0;
      setIndex(Math.min(items.length - 1, Math.floor(progress * items.length)));
      // On portrait phones a half-height card is wider than the screen; shrink it so the widest card fits.
      const stageH = window.innerHeight - nav;
      setCardHeight(Math.min(CARD_HEIGHT, (window.innerWidth * 0.88) / (MAX_CARD_ASPECT * stageH)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items.length]);

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative w-full border-b border-[var(--color-border-soft)]"
      style={{ height: `calc(100svh - var(--nav-h) + ${items.length * SCROLL_PER_ITEM}svh)` }}
    >
      <div className="sticky top-[var(--nav-h)] h-[calc(100svh-var(--nav-h))] w-full">
        {/* Overlaid at the top so the carousel keeps the full stage for its layout. */}
        <div className="container pointer-events-none absolute inset-x-0 top-[clamp(1.5rem,5vh,3rem)] z-10">
          <h2 className="text-[clamp(1.125rem,2.2vw,1.75rem)] uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
            Featured Artworks
          </h2>
        </div>
        {/* Scroll is the only control: pointer events pass through so swipes
            and wheels scroll the page, and overscroll-behavior is reset so the
            carousel's overflow box doesn't swallow the scroll chain. */}
        <FlexCarousel
          items={items}
          index={index}
          preset="liquid"
          intro="rise"
          cardHeight={cardHeight}
          gap={12}
          squeeze={0.2}
          captureWheel={false}
          focusOnClick={false}
          captions
          className="pointer-events-none [overscroll-behavior:auto]"
        />
      </div>
    </section>
  );
}
