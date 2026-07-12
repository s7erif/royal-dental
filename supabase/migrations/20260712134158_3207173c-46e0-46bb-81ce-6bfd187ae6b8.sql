
-- Pricing type enum
DO $$ BEGIN
  CREATE TYPE public.service_pricing_type AS ENUM ('fixed','range','starting_from','consultation');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS pricing_type public.service_pricing_type NOT NULL DEFAULT 'consultation',
  ADD COLUMN IF NOT EXISTS fixed_price numeric,
  ADD COLUMN IF NOT EXISTS min_price numeric,
  ADD COLUMN IF NOT EXISTS max_price numeric,
  ADD COLUMN IF NOT EXISTS starting_price numeric;
