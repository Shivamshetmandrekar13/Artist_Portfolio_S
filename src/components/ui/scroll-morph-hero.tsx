"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";
import { cn, proxiedImage } from "@/lib/utils";

// --- Types ---
export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";

interface FlipCardProps {
    src: string;
    index: number;
    total: number;
    phase: AnimationPhase;
    target: { x: number; y: number; rotation: number; scale: number; opacity: number };
    theme?: "dark" | "light";
}

// --- FlipCard Component ---
const IMG_WIDTH = 60;  // Reduced from 100
const IMG_HEIGHT = 85; // Reduced from 140

function FlipCard({
    src,
    index,
    total,
    phase,
    target,
    theme = "dark",
}: FlipCardProps) {
    const isDark = theme === "dark";

    return (
        <motion.div
            // Smoothly animate to the coordinates defined by the parent
            animate={{
                x: target.x,
                y: target.y,
                rotate: target.rotation,
                scale: target.scale,
                opacity: target.opacity,
            }}
            transition={{
                type: "spring",
                stiffness: 40,
                damping: 15,
            }}

            // Initial style
            style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: IMG_WIDTH,
                height: IMG_HEIGHT,
                marginLeft: -IMG_WIDTH / 2,
                marginTop: -IMG_HEIGHT / 2,
                transformStyle: "preserve-3d", // Essential for the 3D hover effect
                perspective: "1000px",
            }}
            className="cursor-pointer group select-none"
        >
            <motion.div
                className="relative h-full w-full"
                style={{ transformStyle: "preserve-3d" }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                whileHover={{ rotateY: 180 }}
            >
                {/* Front Face */}
                <div
                    className={cn(
                        "absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-xl transition-all duration-300",
                        isDark
                            ? "bg-[var(--color-surface-2)] border border-[var(--color-border)] shadow-[#78350F]/20 group-hover:border-[#c8a96e]/60"
                            : "bg-gray-200 border border-gray-300 group-hover:border-blue-400"
                    )}
                    style={{ backfaceVisibility: "hidden" }}
                >
                    <img
                        src={proxiedImage(src, 640)}
                        alt={`artwork-${index}`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                    <div
                        className={cn(
                            "absolute inset-0 transition-colors",
                            isDark
                                ? "bg-black/25 group-hover:bg-transparent"
                                : "bg-black/10 group-hover:bg-transparent"
                        )}
                    />
                </div>

                {/* Back Face */}
                <div
                    className={cn(
                        "absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-lg flex flex-col items-center justify-center p-2 text-center",
                        isDark
                            ? "bg-[var(--color-bg)] border border-[var(--color-gold)]/40 shadow-[#78350F]/25"
                            : "bg-gray-900 border border-gray-700"
                    )}
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                    <div>
                        <p className={cn("text-[8px] font-bold uppercase tracking-widest mb-1", isDark ? "text-[var(--color-gold)]" : "text-blue-400")}>
                            Artwork
                        </p>
                        <p className={cn("text-[10px] font-medium leading-tight", isDark ? "text-[var(--color-text)]" : "text-white")}>
                            #{index + 1}
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

// --- Main Hero Component ---
const TOTAL_IMAGES = 20;
const MAX_SCROLL = 3000; // Virtual scroll range
const TOUCH_MULTIPLIER = 3; // Virtual units per pixel of finger travel

// High-quality Fine Art / Painting Stock Images from Unsplash
const UNSPLASH_IMAGES = [
    "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1576769267415-9642010aa962?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1549887534-1541e9326642?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1579541814924-49fef17c5be5?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1580137189272-c9379f8864fd?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?w=600&auto=format&fit=crop&q=80",
];

// Helper for linear interpolation
const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

export interface ScrollMorphHeroProps {
    images?: string[];
    introTitle?: string;
    introSubtitle?: string;
    activeHeading?: string;
    activeDescription?: string;
    theme?: "dark" | "light";
    className?: string;
}

export default function IntroAnimation({
    images = UNSPLASH_IMAGES,
    introTitle = "Aryan Mehta — Fine Art",
    introSubtitle = "SCROLL TO EXPLORE THE ATELIER",
    activeHeading = "Explore The Collection",
    activeDescription = "Where classical tradition meets contemporary vision. Scroll through original oil, acrylic, and mixed-media masterpieces crafted by Aryan Mehta.",
    theme = "dark",
    className,
}: ScrollMorphHeroProps) {
    const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
    const [containerSize, setContainerSize] = useState({ width: 1200, height: 750 });
    const containerRef = useRef<HTMLDivElement>(null);

    const imageList = useMemo(() => {
        return images && images.length >= TOTAL_IMAGES ? images : UNSPLASH_IMAGES;
    }, [images]);

    // --- Container Size ---
    useEffect(() => {
        if (!containerRef.current) return;

        const handleResize = (entries: ResizeObserverEntry[]) => {
            for (const entry of entries) {
                setContainerSize({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                });
            }
        };

        const observer = new ResizeObserver(handleResize);
        observer.observe(containerRef.current);

        // Initial set
        setContainerSize({
            width: containerRef.current.offsetWidth,
            height: containerRef.current.offsetHeight,
        });

        return () => observer.disconnect();
    }, []);

    // --- Virtual Scroll Logic ---
    const virtualScroll = useMotionValue(0);
    const scrollRef = useRef(0); // Keep track of scroll value without re-renders

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            const current = scrollRef.current;
            const delta = e.deltaY;

            // If scrolling down and reached end, allow page scroll
            if (delta > 0 && current >= MAX_SCROLL) return;
            // If scrolling up and at start, allow page scroll
            if (delta < 0 && current <= 0) return;

            e.preventDefault();
            const newScroll = Math.min(Math.max(current + delta, 0), MAX_SCROLL);
            scrollRef.current = newScroll;
            virtualScroll.set(newScroll);
        };

        // Touch support. A finger moves far fewer pixels than a wheel reports,
        // so touch is amplified and keeps gliding after release; otherwise the
        // range takes many swipes on a phone.
        let touchStartY = 0;
        let lastMoveAt = 0;
        let velocity = 0; // virtual units per ms
        let glide = 0;
        const stopGlide = () => {
            cancelAnimationFrame(glide);
            glide = 0;
        };
        const handleTouchStart = (e: TouchEvent) => {
            stopGlide();
            touchStartY = e.touches[0].clientY;
            lastMoveAt = performance.now();
            velocity = 0;
        };
        const handleTouchMove = (e: TouchEvent) => {
            const touchY = e.touches[0].clientY;
            const deltaY = (touchStartY - touchY) * TOUCH_MULTIPLIER;
            const current = scrollRef.current;

            if (deltaY > 0 && current >= MAX_SCROLL) return;
            if (deltaY < 0 && current <= 0) return;

            if (e.cancelable) e.preventDefault();
            touchStartY = touchY;

            const now = performance.now();
            velocity = deltaY / Math.max(now - lastMoveAt, 1);
            lastMoveAt = now;

            const newScroll = Math.min(Math.max(current + deltaY, 0), MAX_SCROLL);
            scrollRef.current = newScroll;
            virtualScroll.set(newScroll);
        };
        const handleTouchEnd = () => {
            // Ignore a finger that stopped before lifting.
            if (performance.now() - lastMoveAt > 80) return;
            let v = velocity;
            let last = performance.now();
            const step = (now: number) => {
                const dt = now - last;
                last = now;
                v *= Math.pow(0.95, dt / 16);
                const next = Math.min(Math.max(scrollRef.current + v * dt, 0), MAX_SCROLL);
                scrollRef.current = next;
                virtualScroll.set(next);
                glide = Math.abs(v) > 0.02 && next > 0 && next < MAX_SCROLL ? requestAnimationFrame(step) : 0;
            };
            glide = requestAnimationFrame(step);
        };

        // Attach listeners to container instead of window for portability
        container.addEventListener("wheel", handleWheel, { passive: false });
        container.addEventListener("touchstart", handleTouchStart, { passive: false });
        container.addEventListener("touchmove", handleTouchMove, { passive: false });
        container.addEventListener("touchend", handleTouchEnd);

        return () => {
            stopGlide();
            container.removeEventListener("wheel", handleWheel);
            container.removeEventListener("touchstart", handleTouchStart);
            container.removeEventListener("touchmove", handleTouchMove);
            container.removeEventListener("touchend", handleTouchEnd);
        };
    }, [virtualScroll]);

    // 1. Morph Progress: 0 (Circle) -> 1 (Bottom Arc)
    // Happens between scroll 0 and 600
    const morphProgress = useTransform(virtualScroll, [0, 600], [0, 1]);
    const smoothMorph = useSpring(morphProgress, { stiffness: 40, damping: 20 });

    // 2. Scroll Rotation (Shuffling): Starts after morph (e.g., > 600)
    // Rotates the bottom arc as user continues scrolling
    const scrollRotate = useTransform(virtualScroll, [600, 3000], [0, 360]);
    const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 40, damping: 20 });

    // --- Mouse Parallax ---
    const mouseX = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const relativeX = e.clientX - rect.left;

            // Normalize -1 to 1
            const normalizedX = (relativeX / rect.width) * 2 - 1;
            // Move +/- 100px
            mouseX.set(normalizedX * 100);
        };
        container.addEventListener("mousemove", handleMouseMove);
        return () => container.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX]);

    // --- Intro Sequence ---
    useEffect(() => {
        const timer1 = setTimeout(() => setIntroPhase("line"), 500);
        const timer2 = setTimeout(() => setIntroPhase("circle"), 2500);
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    // --- Scatter Positions (deterministic for SSR & hydration stability) ---
    const scatterPositions = useMemo(() => {
        return imageList.map((_, i) => {
            // High-frequency sin/cos generates pseudo-random distribution between -0.5 and 0.5
            const pseudoX = (Math.sin(i * 92.173 + 1) * 10000) % 1;
            const pseudoY = (Math.cos(i * 54.321 + 2) * 10000) % 1;
            const pseudoRot = (Math.sin(i * 31.91 + 3) * 10000) % 1;
            return {
                x: pseudoX * 750,
                y: pseudoY * 500,
                rotation: pseudoRot * 90,
                scale: 0.6,
                opacity: 0,
            };
        });
    }, [imageList]);

    // --- Render Loop (Manual Calculation for Morph) ---
    const [morphValue, setMorphValue] = useState(0);
    const [rotateValue, setRotateValue] = useState(0);
    const [parallaxValue, setParallaxValue] = useState(0);

    useEffect(() => {
        const unsubscribeMorph = smoothMorph.on("change", setMorphValue);
        const unsubscribeRotate = smoothScrollRotate.on("change", setRotateValue);
        const unsubscribeParallax = smoothMouseX.on("change", setParallaxValue);
        return () => {
            unsubscribeMorph();
            unsubscribeRotate();
            unsubscribeParallax();
        };
    }, [smoothMorph, smoothScrollRotate, smoothMouseX]);

    // --- Content Opacity ---
    // Fade in content when arc is formed (morphValue > 0.8)
    const contentOpacity = useTransform(smoothMorph, [0.8, 1], [0, 1]);
    const contentY = useTransform(smoothMorph, [0.8, 1], [20, 0]);

    const isDark = theme === "dark";

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative w-full h-full overflow-hidden select-none transition-colors duration-500",
                isDark ? "bg-transparent text-[var(--color-text)]" : "bg-[#FAFAFA] text-gray-900",
                className
            )}
        >
            {/* Subtle ambient background glow */}
            {isDark && (
                <div
                    className="absolute inset-0 pointer-events-none opacity-30"
                    style={{
                        background:
                            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(200, 169, 110, 0.15), transparent 70%)",
                    }}
                />
            )}

            {/* Container */}
            <div className="flex h-full w-full flex-col items-center justify-center perspective-1000">

                {/* Intro Text (Fades out) */}
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                    className="z-20 flex flex-col items-center justify-center text-center pointer-events-none px-4 max-w-xl w-full"
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                        animate={
                            introPhase === "circle" && morphValue < 0.5
                                ? { opacity: 1 - morphValue * 2, y: 0, filter: "blur(0px)" }
                                : { opacity: 0, filter: "blur(10px)" }
                        }
                        transition={{ duration: 1 }}
                        className={cn(
                            "text-3xl md:text-5xl font-light tracking-tight font-display",
                            isDark ? "text-[var(--color-text)]" : "text-gray-800"
                        )}
                    >
                        {introTitle}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={
                            introPhase === "circle" && morphValue < 0.5
                                ? { opacity: 0.7 - morphValue }
                                : { opacity: 0 }
                        }
                        transition={{ duration: 1, delay: 0.2 }}
                        className={cn(
                            "mt-4 text-xs font-semibold tracking-[0.25em]",
                            isDark ? "text-[var(--color-gold)]" : "text-gray-500"
                        )}
                    >
                        {introSubtitle}
                    </motion.p>
                </div>

                {/* Arc Active Content (Fades in) */}
                <motion.div
                    style={{
                        left: "50%",
                        x: "-50%",
                        opacity: contentOpacity,
                        y: contentY,
                    }}
                    className="absolute top-[8%] md:top-[10%] z-10 flex flex-col items-center justify-center text-center pointer-events-none px-4 w-full max-w-2xl"
                >
                    <span
                        className={cn(
                            "text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] mb-2 px-3 py-1 rounded-full border",
                            isDark
                                ? "text-[var(--color-gold)] border-[#c8a96e]/30 bg-[#c8a96e]/10"
                                : "text-blue-600 border-blue-200 bg-blue-50"
                        )}
                    >
                        Featured Portfolio
                    </span>
                    <h2
                        className={cn(
                            "text-3xl md:text-5xl font-light tracking-tight mb-3 font-display",
                            isDark ? "text-[var(--color-text)]" : "text-gray-900"
                        )}
                    >
                        {activeHeading}
                    </h2>
                    <p
                        className={cn(
                            "text-xs md:text-sm max-w-lg leading-relaxed",
                            isDark ? "text-[var(--color-text-muted)]" : "text-gray-600"
                        )}
                    >
                        {activeDescription}
                    </p>
                </motion.div>

                {/* Main Container */}
                <div className="relative flex items-center justify-center w-full h-full">
                    {imageList.slice(0, TOTAL_IMAGES).map((src, i) => {
                        let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

                        // 1. Intro Phases (Scatter -> Line)
                        if (introPhase === "scatter") {
                            target = scatterPositions[i];
                        } else if (introPhase === "line") {
                            const lineSpacing = 70; // Adjusted for smaller images (60px width + 10px gap)
                            const lineTotalWidth = TOTAL_IMAGES * lineSpacing;
                            const lineX = i * lineSpacing - lineTotalWidth / 2;
                            target = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 };
                        } else {
                            // 2. Circle Phase & Morph Logic

                            // Responsive Calculations
                            const isMobile = containerSize.width < 768;
                            const minDimension = Math.min(containerSize.width, containerSize.height);

                            // A. Calculate Circle Position
                            const circleRadius = Math.min(minDimension * 0.35, 350);

                            const circleAngle = (i / TOTAL_IMAGES) * 360;
                            const circleRad = (circleAngle * Math.PI) / 180;
                            const circlePos = {
                                x: Math.cos(circleRad) * circleRadius,
                                y: Math.sin(circleRad) * circleRadius,
                                rotation: circleAngle + 90,
                            };

                            // B. Calculate Bottom Arc Position
                            // "Rainbow" Arch: Convex up. Center is highest point.

                            // Radius:
                            const baseRadius = Math.min(containerSize.width, containerSize.height * 1.5);
                            const arcRadius = baseRadius * (isMobile ? 1.4 : 1.1);

                            // Position relative to vertical center
                            const arcApexY_from_top = containerSize.height * (isMobile ? 0.35 : 0.28);
                            const arcCenterY = (arcApexY_from_top - containerSize.height / 2) + arcRadius;

                            // Spread angle:
                            const spreadAngle = isMobile ? 100 : 130;
                            const startAngle = -90 - (spreadAngle / 2);
                            const step = spreadAngle / (TOTAL_IMAGES - 1);

                            // Apply Scroll Rotation (Shuffle) with Bounds
                            const scrollProgress = Math.min(Math.max(rotateValue / 360, 0), 1);
                            const maxRotation = spreadAngle * 0.8;
                            const boundedRotation = -scrollProgress * maxRotation;

                            const currentArcAngle = startAngle + (i * step) + boundedRotation;
                            const arcRad = (currentArcAngle * Math.PI) / 180;

                            const arcPos = {
                                x: Math.cos(arcRad) * arcRadius + parallaxValue,
                                y: Math.sin(arcRad) * arcRadius + arcCenterY,
                                rotation: currentArcAngle + 90,
                                scale: isMobile ? 1.4 : 1.8, // Increased scale for active state
                            };

                            // C. Interpolate (Morph)
                            target = {
                                x: lerp(circlePos.x, arcPos.x, morphValue),
                                y: lerp(circlePos.y, arcPos.y, morphValue),
                                rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
                                scale: lerp(1, arcPos.scale, morphValue),
                                opacity: 1,
                            };
                        }

                        return (
                            <FlipCard
                                key={i}
                                src={src}
                                index={i}
                                total={TOTAL_IMAGES}
                                phase={introPhase} // Pass intro phase for initial animations
                                target={target}
                                theme={theme}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
