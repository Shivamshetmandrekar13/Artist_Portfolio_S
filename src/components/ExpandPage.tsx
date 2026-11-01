import type { ReactNode } from "react";
import ScrollExpand from "@/components/ui/ScrollExpand";

export const SERIF = "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif";

interface ExpandPageProps {
  /** Full-bleed photo behind the page. */
  src: string;
  alt: string;
  /** Small caps line above the resting title. */
  eyebrow: string;
  /** Title held over the resting frame. */
  title: string;
  scrollHint: string;
  /** Content revealed once the photo fills the screen. */
  children: ReactNode;
}

/**
 * Single-section page: a framed photo that opens to full bleed as the page
 * scrolls, then reveals its content over it. Shared by About, Services and
 * Contact so they read as one set.
 */
export default function ExpandPage({ src, alt, eyebrow, title, scrollHint, children }: ExpandPageProps) {
  return (
    // Pulled up under the fixed glass navbar so the expanded image fills the whole viewport.
    <div className="-mt-[var(--nav-h)]">
      <ScrollExpand
        src={src}
        alt={alt}
        title={
          <span className="flex flex-col items-center gap-3" style={{ fontFamily: SERIF }}>
            <span className="font-sans text-[0.75rem] font-medium uppercase tracking-[0.3em] text-white/80">
              {eyebrow}
            </span>
            <span className="font-light tracking-normal">{title}</span>
          </span>
        }
        scrollHint={scrollHint}
        startWidth={42}
        startHeight={58}
        mediaZoom={1.35}
        scrollDistance={1.2}
        holdDistance={0.8}
        overlayScrim={0.7}
        useWindowScroll
      >
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center pt-[var(--nav-h)] text-white">
          {children}
        </div>
      </ScrollExpand>
    </div>
  );
}

/** Eyebrow + serif headline used at the top of each revealed block. */
export function ExpandHeading({ eyebrow, children }: { eyebrow: string; children: ReactNode }) {
  return (
    <>
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.3em] text-white/70">{eyebrow}</p>
      <h1
        className="mt-4 text-[clamp(2.25rem,5.5vw,4.25rem)] font-light leading-[1.05]"
        style={{ fontFamily: SERIF }}
      >
        {children}
      </h1>
    </>
  );
}
