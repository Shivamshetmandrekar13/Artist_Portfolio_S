import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Route a remote image through Next's optimizer so the browser loads it from
 * this site instead of the image host directly — some desktop blockers stop
 * images.unsplash.com. `width` must be one of the configured image sizes and
 * quality stays at 75, the only value Next 16 allows by default.
 */
export function proxiedImage(src: string, width = 1200) {
  if (!/^https?:\/\//.test(src)) return src;
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
}
