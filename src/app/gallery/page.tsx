import type { Metadata } from "next";
import GalleryClient from "./GalleryClient";
import { getPaintings } from "@/lib/paintings";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse original paintings by Aryan Mehta — oil, acrylic, watercolor, and mixed media works.",
};

// Paintings come from a cached query, so the whole page is prerendered — no loading state.
export default async function GalleryPage() {
  const paintings = await getPaintings();
  return <GalleryClient paintings={paintings} />;
}
