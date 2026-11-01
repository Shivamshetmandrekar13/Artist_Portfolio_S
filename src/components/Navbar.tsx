"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import GlassSurface from "@/components/ui/GlassSurface";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`${styles.bar} container`}>
        <GlassSurface
          width="100%"
          height="100%"
          borderRadius={28}
          distortionScale={-180}
          displace={0.5}
          backgroundOpacity={scrolled ? 0.6 : 0.1}
          className={styles.glass}
        >
      <nav className={styles.nav}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoInitial}>AM</span>
          <span className={styles.logoText}>
            <span className={styles.logoName}>Aryan Mehta</span>
            <span className={styles.logoSub}>Fine Art</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className={styles.links}>
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`${styles.link} ${
                  pathname === href ? styles.active : ""
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className={styles.actions}>
          <Link href="/contact" className="btn btn-outline" style={{ fontSize: "0.75rem", padding: "0.5rem 1.25rem" }}>
            Commission Work
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>
        </GlassSurface>
      </div>

      {/* Mobile menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileOpen : ""}`}>
        <ul className={styles.mobileLinks}>
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`${styles.mobileLink} ${
                  pathname === href ? styles.active : ""
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/contact" className="btn btn-primary" style={{ marginTop: "0.5rem" }}>
              Commission Work
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
