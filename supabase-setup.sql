-- ══════════════════════════════════════════════════════════════════
--  Supabase Setup Script — Artist Portfolio Gallery
--  Run this in: Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════════════════════════

-- 1. Create paintings table
CREATE TABLE IF NOT EXISTS public.paintings (
  id            uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  title         text          NOT NULL,
  description   text          NOT NULL DEFAULT '',
  category      text          NOT NULL,
  tags          text[]        NOT NULL DEFAULT '{}',
  image_url     text          NOT NULL,
  year          integer,
  dimensions    text,
  is_available  boolean       NOT NULL DEFAULT true,
  price         numeric(12,2),
  created_at    timestamptz   NOT NULL DEFAULT now(),
  updated_at    timestamptz   NOT NULL DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE public.paintings ENABLE ROW LEVEL SECURITY;

-- 3. Public read policy (anyone can view paintings)
DROP POLICY IF EXISTS "Public can read paintings" ON public.paintings;
CREATE POLICY "Public can read paintings"
  ON public.paintings
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 4. Policies for paintings management (insert, update, delete)
DROP POLICY IF EXISTS "Allow insert paintings" ON public.paintings;
CREATE POLICY "Allow insert paintings"
  ON public.paintings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update paintings" ON public.paintings;
CREATE POLICY "Allow update paintings"
  ON public.paintings
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow delete paintings" ON public.paintings;
CREATE POLICY "Allow delete paintings"
  ON public.paintings
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- 5. Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS paintings_updated_at ON public.paintings;
CREATE TRIGGER paintings_updated_at
  BEFORE UPDATE ON public.paintings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ══════════════════════════════════════════════════════════════════
--  Storage Bucket Setup
--  Dashboard → Storage → New Bucket: "paintings"
--  Set to Public, max file size 5MB, allowed MIME: image/*
-- ══════════════════════════════════════════════════════════════════

-- Storage policies (run after creating the bucket)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'paintings',
  'paintings',
  true,
  5242880,   -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public to read images
DROP POLICY IF EXISTS "Public read paintings storage" ON storage.objects;
CREATE POLICY "Public read paintings storage"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'paintings');

-- Allow anon to upload
DROP POLICY IF EXISTS "Anon can upload paintings" ON storage.objects;
CREATE POLICY "Anon can upload paintings"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'paintings');

DROP POLICY IF EXISTS "Anon can delete paintings" ON storage.objects;
CREATE POLICY "Anon can delete paintings"
  ON storage.objects
  FOR DELETE
  TO anon, authenticated
  USING (bucket_id = 'paintings');

-- ══════════════════════════════════════════════════════════════════
--  Sample data (optional — remove in production)
-- ══════════════════════════════════════════════════════════════════
-- INSERT INTO public.paintings (title, description, category, tags, image_url, year, dimensions, is_available, price)
-- VALUES (
--   'Monsoon in Goa',
--   'A vibrant oil study of the lush coastline during the monsoon season. Rain-soaked palms and the silver shimmer of the Arabian Sea.',
--   'Oil',
--   ARRAY['landscape', 'nature', 'monsoon', 'coastal'],
--   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
--   2024,
--   '24 × 36 in',
--   true,
--   45000
-- );
