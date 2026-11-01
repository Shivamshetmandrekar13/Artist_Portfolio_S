import { cacheLife, cacheTag } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import type { Painting } from "@/types/painting";

export const PAINTINGS_TAG = "paintings";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "placeholder-key";

/**
 * Public paintings list, cached so the gallery is prerendered and served
 * instantly. Uses a cookie-less client (the data is public) so it can run
 * inside "use cache". Admin edits expire it via `refreshGallery`.
 */
export async function getPaintings(): Promise<Painting[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(PAINTINGS_TAG);

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false },
    });
    const { data, error } = await supabase
      .from("paintings")
      .select("*")
      .order("created_at", { ascending: false });

    return !error && data ? (data as Painting[]) : [];
  } catch {
    // Supabase not configured yet
    return [];
  }
}
