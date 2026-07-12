
ALTER TABLE public.gallery_images
  ADD COLUMN IF NOT EXISTS title_ar text,
  ADD COLUMN IF NOT EXISTS title_en text;

-- Backfill title_ar from existing caption values
UPDATE public.gallery_images SET title_ar = caption WHERE title_ar IS NULL AND caption IS NOT NULL;

-- Make legacy caption nullable so new inserts don't require it
ALTER TABLE public.gallery_images ALTER COLUMN caption DROP NOT NULL;
ALTER TABLE public.gallery_images ALTER COLUMN caption SET DEFAULT '';
