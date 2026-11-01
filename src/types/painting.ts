export type PaintingCategory =
  | "Oil"
  | "Acrylic"
  | "Watercolor"
  | "Mixed Media"
  | "Digital"
  | "Charcoal"
  | "Pastel"
  | "Other";

export interface Painting {
  id: string;
  title: string;
  description: string;
  category: PaintingCategory;
  tags: string[];
  image_url: string;
  year?: number;
  dimensions?: string;
  is_available: boolean;
  price?: number;
  created_at: string;
  updated_at: string;
}

export type PaintingInsert = Omit<Painting, "id" | "created_at" | "updated_at">;
export type PaintingUpdate = Partial<PaintingInsert>;

export const CATEGORIES: PaintingCategory[] = [
  "Oil",
  "Acrylic",
  "Watercolor",
  "Mixed Media",
  "Digital",
  "Charcoal",
  "Pastel",
  "Other",
];
