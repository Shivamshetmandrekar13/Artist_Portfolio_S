"use client";

import { useState } from "react";
import type { Painting, PaintingCategory } from "@/types/painting";
import { CATEGORIES } from "@/types/painting";
import ParallaxUnfurlingGallery from "@/components/ui/3d-parallax-unfurling-gallery";
import { Gallery, GalleryGrid, GalleryImage } from "@/components/ui/shared-element-gallery";
import styles from "./Gallery.module.css";

interface Props {
  paintings: Painting[];
}

export default function GalleryClient({ paintings }: Props) {
  const [activeCategory, setActiveCategory] = useState<PaintingCategory | "All">("All");
  const [activeTag, setActiveTag] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Collect all unique tags
  const allTags = Array.from(
    new Set(paintings.flatMap((p) => p.tags ?? []))
  ).sort();

  // Filter paintings
  const filtered = paintings.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchTag = activeTag === "All" || (p.tags ?? []).includes(activeTag);
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.tags ?? []).some((t) => t.toLowerCase().includes(q));
    return matchCat && matchTag && matchSearch;
  });

  const usedCategories = Array.from(new Set(paintings.map((p) => p.category)));

  return (
    <div className={styles.page}>
      {/* 3D parallax hero */}
      <ParallaxUnfurlingGallery images={paintings.map((p) => p.image_url)} />

      {/* Header */}
      <div className={styles.header}>
        <p className={styles.eyebrow}>The Collection</p>
        <h1 className={styles.title}>Gallery</h1>
        <div className="gold-line" />
        <p className={styles.subtitle}>
          {paintings.length} original{paintings.length !== 1 ? " works" : " work"} spanning oil, acrylic, watercolor &amp; more
        </p>
      </div>

      {/* Controls */}
      <div className={`container ${styles.controls}`}>
        {/* Search */}
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            id="gallery-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search paintings…"
            className={styles.searchInput}
          />
          {searchQuery && (
            <button className={styles.searchClear} onClick={() => setSearchQuery("")} aria-label="Clear search">×</button>
          )}
        </div>

        {/* Category filter */}
        <div className={styles.filters} role="group" aria-label="Filter by category">
          <button
            className={`${styles.filterBtn} ${activeCategory === "All" ? styles.filterActive : ""}`}
            onClick={() => setActiveCategory("All")}
          >
            All
          </button>
          {(usedCategories.length > 0 ? usedCategories : CATEGORIES).map((cat) => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ""}`}
              onClick={() => setActiveCategory(cat as PaintingCategory)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tag filter */}
        {allTags.length > 0 && (
          <div className={styles.tags}>
            <button
              className={`tag ${activeTag === "All" ? "tag-gold" : "tag-muted"}`}
              onClick={() => setActiveTag("All")}
            >
              All Tags
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                className={`tag ${activeTag === tag ? "tag-gold" : "tag-muted"}`}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid */}
      <div className={`container ${styles.gridWrap}`}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: "var(--color-text-dim)", marginBottom: "1rem" }}>
              <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
            </svg>
            {paintings.length === 0 ? (
              <>
                <p className={styles.emptyTitle}>No paintings yet</p>
                <p className={styles.emptyText}>Add paintings from the admin panel to see them here.</p>
              </>
            ) : (
              <>
                <p className={styles.emptyTitle}>No results found</p>
                <p className={styles.emptyText}>Try adjusting your filters or search query.</p>
                <button className="btn btn-outline" style={{ marginTop: "1rem" }} onClick={() => { setActiveCategory("All"); setActiveTag("All"); setSearchQuery(""); }}>
                  Clear Filters
                </button>
              </>
            )}
          </div>
        ) : (
          <Gallery
            renderDetails={(image) => {
              const painting = paintings.find((p) => p.id === image.id);
              return painting ? <PaintingDetails painting={painting} /> : null;
            }}
          >
            <GalleryGrid className="lg:columns-3">
              {filtered.map((painting) => (
                <GalleryImage
                  key={painting.id}
                  id={painting.id}
                  src={painting.image_url}
                  alt={painting.title}
                >
                  <div className={styles.cardOverlayInner}>
                    <span className="tag tag-gold self-start">{painting.category}</span>
                    <h3 className={styles.cardTitle}>{painting.title}</h3>
                    {painting.year && <p className={styles.cardYear}>{painting.year}</p>}
                  </div>
                </GalleryImage>
              ))}
            </GalleryGrid>
          </Gallery>
        )}

        {filtered.length > 0 && (
          <p className={styles.resultCount}>
            Showing {filtered.length} of {paintings.length} works
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Painting details (shown beside the expanded image) ── */
function PaintingDetails({ painting }: { painting: Painting }) {
  return (
    <div className={styles.details}>
      <span className="tag tag-gold">{painting.category}</span>
      <h2 className={styles.detailsTitle}>{painting.title}</h2>
      {painting.year && <p className={styles.detailsMeta}>{painting.year}</p>}
      {painting.dimensions && <p className={styles.detailsMeta}>{painting.dimensions}</p>}
      <div className="gold-line" style={{ margin: "1rem 0" }} />
      <p className={styles.detailsDesc}>{painting.description}</p>

      {(painting.tags ?? []).length > 0 && (
        <div className={styles.detailsTags}>
          {painting.tags.map((tag) => (
            <span key={tag} className="tag tag-muted">{tag}</span>
          ))}
        </div>
      )}

      {painting.is_available && painting.price && (
        <div className={styles.price}>
          <span className={styles.priceLabel}>Price</span>
          <span className={styles.priceValue}>₹{painting.price.toLocaleString("en-IN")}</span>
        </div>
      )}

      {painting.is_available && (
        <a href="/contact" className="btn btn-primary" style={{ marginTop: "1.5rem", justifyContent: "center" }}>
          Enquire About This Work
        </a>
      )}
    </div>
  );
}
