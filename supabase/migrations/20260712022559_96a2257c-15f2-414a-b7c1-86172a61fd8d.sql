-- google_reviews
CREATE TABLE public.google_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  google_review_id text UNIQUE NOT NULL,
  author_name text NOT NULL,
  author_photo text,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text text,
  review_time timestamptz NOT NULL,
  is_verified boolean NOT NULL DEFAULT true,
  profile_url text,
  language text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.google_reviews TO anon, authenticated;
GRANT ALL ON public.google_reviews TO service_role;

ALTER TABLE public.google_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read google reviews"
  ON public.google_reviews FOR SELECT
  USING (true);

CREATE POLICY "Admins manage google reviews"
  ON public.google_reviews FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_google_reviews_updated
  BEFORE UPDATE ON public.google_reviews
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- google_business (singleton)
CREATE TABLE public.google_business (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  singleton boolean NOT NULL DEFAULT true UNIQUE,
  rating numeric(3,2) NOT NULL DEFAULT 0,
  reviews_count integer NOT NULL DEFAULT 0,
  google_maps_url text NOT NULL DEFAULT '',
  place_id text,
  last_sync timestamptz,
  last_sync_status text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (singleton = true)
);

GRANT SELECT ON public.google_business TO anon, authenticated;
GRANT ALL ON public.google_business TO service_role;

ALTER TABLE public.google_business ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read google business"
  ON public.google_business FOR SELECT
  USING (true);

CREATE POLICY "Admins manage google business"
  ON public.google_business FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_google_business_updated
  BEFORE UPDATE ON public.google_business
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- seed singleton row
INSERT INTO public.google_business (singleton, google_maps_url)
VALUES (true, '')
ON CONFLICT DO NOTHING;
