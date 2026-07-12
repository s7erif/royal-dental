
-- Add service_type to services
DO $$ BEGIN
  CREATE TYPE public.service_type AS ENUM ('simple','grouped');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS service_type public.service_type NOT NULL DEFAULT 'simple';

-- Make slug nullable / auto-generated to simplify admin (keep column, drop NOT NULL)
ALTER TABLE public.services ALTER COLUMN slug DROP NOT NULL;
ALTER TABLE public.services ALTER COLUMN short_desc_ar DROP NOT NULL;

-- service_variants table
CREATE TABLE IF NOT EXISTS public.service_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  name_ar text NOT NULL,
  description_ar text,
  pricing_type public.service_pricing_type NOT NULL DEFAULT 'fixed',
  fixed_price numeric,
  min_price numeric,
  max_price numeric,
  starting_price numeric,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_service_variants_service ON public.service_variants(service_id, display_order);

GRANT SELECT ON public.service_variants TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_variants TO authenticated;
GRANT ALL ON public.service_variants TO service_role;

ALTER TABLE public.service_variants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active variants" ON public.service_variants;
CREATE POLICY "Public can view active variants" ON public.service_variants
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins manage variants" ON public.service_variants;
CREATE POLICY "Admins manage variants" ON public.service_variants
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

DROP TRIGGER IF EXISTS trg_service_variants_updated_at ON public.service_variants;
CREATE TRIGGER trg_service_variants_updated_at
  BEFORE UPDATE ON public.service_variants
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
