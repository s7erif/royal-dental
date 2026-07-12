
CREATE TABLE public.hero_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  singleton boolean NOT NULL DEFAULT true UNIQUE,
  badge_text text NOT NULL DEFAULT '',
  title_line1 text NOT NULL DEFAULT '',
  title_highlight text NOT NULL DEFAULT '',
  subtitle text NOT NULL DEFAULT '',
  primary_cta_label text NOT NULL DEFAULT '',
  primary_cta_url text NOT NULL DEFAULT '#book',
  secondary_cta_label text NOT NULL DEFAULT '',
  secondary_cta_url text NOT NULL DEFAULT '',
  image_url text,
  image_caption_eyebrow text NOT NULL DEFAULT '',
  image_caption_title text NOT NULL DEFAULT '',
  floating_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT hero_singleton_check CHECK (singleton = true)
);

GRANT SELECT ON public.hero_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.hero_content TO authenticated;
GRANT ALL ON public.hero_content TO service_role;

ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hero is public" ON public.hero_content
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "admins manage hero" ON public.hero_content
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER hero_content_set_updated_at
  BEFORE UPDATE ON public.hero_content
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.hero_content (
  badge_text, title_line1, title_highlight, subtitle,
  primary_cta_label, primary_cta_url, secondary_cta_label, secondary_cta_url,
  image_caption_eyebrow, image_caption_title, floating_items
) VALUES (
  'مركز رويال ديـنـتـال',
  'ابتسامتك تستحق',
  'رعاية ملكية',
  'طب أسنان متقدم بأحدث التقنيات ورعاية شخصية — مصمم ليجعل كل زيارة راقية بقدر الابتسامة التي تخرج بها.',
  'احجز موعدك', '#book',
  'اتصل الآن', 'tel:+201000000000',
  'الطبيب المؤسس', 'د. مصطفى بكر',
  '[
    {"icon":"Sparkles","label":"تجميل الأسنان"},
    {"icon":"Stethoscope","label":"زراعة الأسنان"},
    {"icon":"HeartPulse","label":"علاج الجذور"},
    {"icon":"Sparkle","label":"تبييض الأسنان"}
  ]'::jsonb
);
