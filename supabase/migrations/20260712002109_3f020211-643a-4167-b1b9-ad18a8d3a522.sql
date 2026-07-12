
-- ================= Roles =================
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'viewer');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE POLICY "users can view their own roles" ON public.user_roles FOR SELECT
TO authenticated USING (user_id = auth.uid());

-- Admin bootstrap: allow first admin to be created if none exists yet
CREATE OR REPLACE FUNCTION public.admin_count() RETURNS BIGINT
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT COUNT(*) FROM public.user_roles WHERE role = 'admin' $$;

GRANT EXECUTE ON FUNCTION public.admin_count() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, app_role) TO anon, authenticated;

-- ================= Categories =================
CREATE TABLE public.service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL,
  name_en TEXT,
  slug TEXT NOT NULL UNIQUE,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.service_categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.service_categories TO authenticated;
GRANT ALL ON public.service_categories TO service_role;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories are public" ON public.service_categories FOR SELECT
TO anon, authenticated USING (true);
CREATE POLICY "admins manage categories" ON public.service_categories FOR ALL
TO authenticated USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ================= Services =================
CREATE TYPE public.service_status AS ENUM ('active', 'hidden', 'draft');

CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL,
  name_en TEXT,
  short_desc_ar TEXT NOT NULL,
  short_desc_en TEXT,
  description_ar TEXT,
  description_en TEXT,
  icon TEXT NOT NULL DEFAULT 'Stethoscope',
  cover_image TEXT,
  gallery_images JSONB NOT NULL DEFAULT '[]'::jsonb,
  category_id UUID REFERENCES public.service_categories(id) ON DELETE SET NULL,
  price TEXT,
  duration TEXT,
  button_text TEXT,
  button_url TEXT,
  slug TEXT NOT NULL UNIQUE,
  meta_title TEXT,
  meta_description TEXT,
  seo_keywords TEXT,
  display_order INT NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  show_on_homepage BOOLEAN NOT NULL DEFAULT true,
  status service_status NOT NULL DEFAULT 'draft',
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX services_name_ar_uidx ON public.services (lower(name_ar));

GRANT SELECT ON public.services TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Public may only read active services
CREATE POLICY "public reads active services" ON public.services FOR SELECT
TO anon USING (status = 'active');
-- Authenticated admins/editors read everything
CREATE POLICY "staff read all services" ON public.services FOR SELECT
TO authenticated USING (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')
    OR status = 'active'
);
CREATE POLICY "admins manage services" ON public.services FOR ALL
TO authenticated USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_services_updated_at BEFORE UPDATE ON public.services
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_categories_updated_at BEFORE UPDATE ON public.service_categories
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed categories
INSERT INTO public.service_categories (name_ar, name_en, slug, display_order) VALUES
  ('طب أسنان عام', 'General Dentistry', 'general', 1),
  ('تجميل الأسنان', 'Cosmetic Dentistry', 'cosmetic', 2),
  ('زراعة الأسنان', 'Dental Implants', 'implants', 3),
  ('تقويم الأسنان', 'Orthodontics', 'orthodontics', 4),
  ('أسنان الأطفال', 'Pediatric Dentistry', 'pediatric', 5),
  ('علاج الجذور', 'Root Canal', 'root-canal', 6),
  ('حالات طارئة', 'Emergency', 'emergency', 7);
