"use server";

import { updateTag } from "next/cache";
import { PAINTINGS_TAG } from "@/lib/paintings";

/** Expire the cached paintings so the gallery shows admin changes right away. */
export async function refreshGallery() {
  updateTag(PAINTINGS_TAG);
}
