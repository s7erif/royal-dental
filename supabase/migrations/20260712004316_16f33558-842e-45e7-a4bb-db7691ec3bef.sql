
-- helper: singleton check
-- Use singleton boolean UNIQUE pattern already used by hero_content.

-- ============ ABOUT ============
CREATE TABLE public.about_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  singleton boolean NOT NULL DEFAULT true UNIQUE,
  eyebrow text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  highlight text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  image_url text,
  badge_title text NOT NULL DEFAULT '',
  badge_subtitle text NOT NULL DEFAULT '',
  bullets jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT about_singleton_check CHECK (singleton = true)
);
GRANT SELECT ON public.about_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.about_content TO authenticated;
GRANT ALL ON public.about_content TO service_role;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "about is public" ON public.about_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage about" ON public.about_content FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER about_content_set_updated_at BEFORE UPDATE ON public.about_content FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.about_advantages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon text NOT NULL DEFAULT 'Check',
  title text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.about_advantages TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.about_advantages TO authenticated;
GRANT ALL ON public.about_advantages TO service_role;
ALTER TABLE public.about_advantages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "about_advantages public" ON public.about_advantages FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage about_advantages" ON public.about_advantages FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER about_advantages_set_updated_at BEFORE UPDATE ON public.about_advantages FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.about_timeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year text NOT NULL,
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.about_timeline TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.about_timeline TO authenticated;
GRANT ALL ON public.about_timeline TO service_role;
ALTER TABLE public.about_timeline ENABLE ROW LEVEL SECURITY;
CREATE POLICY "about_timeline public" ON public.about_timeline FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage about_timeline" ON public.about_timeline FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER about_timeline_set_updated_at BEFORE UPDATE ON public.about_timeline FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ DOCTOR ============
CREATE TABLE public.doctor_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  singleton boolean NOT NULL DEFAULT true UNIQUE,
  eyebrow text NOT NULL DEFAULT '',
  name text NOT NULL DEFAULT '',
  job_title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT doctor_singleton_check CHECK (singleton = true)
);
GRANT SELECT ON public.doctor_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.doctor_content TO authenticated;
GRANT ALL ON public.doctor_content TO service_role;
ALTER TABLE public.doctor_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "doctor is public" ON public.doctor_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage doctor" ON public.doctor_content FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER doctor_content_set_updated_at BEFORE UPDATE ON public.doctor_content FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.doctor_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon text NOT NULL DEFAULT 'Award',
  title text NOT NULL,
  value text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.doctor_stats TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.doctor_stats TO authenticated;
GRANT ALL ON public.doctor_stats TO service_role;
ALTER TABLE public.doctor_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "doctor_stats public" ON public.doctor_stats FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage doctor_stats" ON public.doctor_stats FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER doctor_stats_set_updated_at BEFORE UPDATE ON public.doctor_stats FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ OFFERS ============
CREATE TABLE public.offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  discount text NOT NULL DEFAULT '',
  old_price text NOT NULL DEFAULT '',
  new_price text NOT NULL DEFAULT '',
  badge text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'Percent',
  image_url text,
  start_date date,
  end_date date,
  button_text text NOT NULL DEFAULT 'احجز الآن',
  button_url text NOT NULL DEFAULT '#book',
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.offers TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.offers TO authenticated;
GRANT ALL ON public.offers TO service_role;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "offers public active" ON public.offers FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "offers auth all" ON public.offers FOR SELECT TO authenticated USING (true);
CREATE POLICY "admins manage offers" ON public.offers FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER offers_set_updated_at BEFORE UPDATE ON public.offers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ BEFORE / AFTER ============
CREATE TABLE public.before_after_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name text,
  treatment_type text NOT NULL,
  description text NOT NULL DEFAULT '',
  before_image text,
  after_image text,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.before_after_cases TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.before_after_cases TO authenticated;
GRANT ALL ON public.before_after_cases TO service_role;
ALTER TABLE public.before_after_cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "before_after public active" ON public.before_after_cases FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "before_after auth all" ON public.before_after_cases FOR SELECT TO authenticated USING (true);
CREATE POLICY "admins manage before_after" ON public.before_after_cases FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER before_after_set_updated_at BEFORE UPDATE ON public.before_after_cases FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ GALLERY ============
CREATE TABLE public.gallery_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.gallery_categories TO authenticated;
GRANT ALL ON public.gallery_categories TO service_role;
ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gallery_cats public" ON public.gallery_categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage gallery_cats" ON public.gallery_categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER gallery_cats_set_updated_at BEFORE UPDATE ON public.gallery_categories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES public.gallery_categories(id) ON DELETE SET NULL,
  image_url text NOT NULL,
  caption text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.gallery_images TO authenticated;
GRANT ALL ON public.gallery_images TO service_role;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gallery public active" ON public.gallery_images FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "gallery auth all" ON public.gallery_images FOR SELECT TO authenticated USING (true);
CREATE POLICY "admins manage gallery" ON public.gallery_images FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER gallery_images_set_updated_at BEFORE UPDATE ON public.gallery_images FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ TESTIMONIALS ============
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name text NOT NULL,
  rating integer NOT NULL DEFAULT 5,
  review text NOT NULL,
  patient_image text,
  date_label text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "testimonials public active" ON public.testimonials FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "testimonials auth all" ON public.testimonials FOR SELECT TO authenticated USING (true);
CREATE POLICY "admins manage testimonials" ON public.testimonials FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER testimonials_set_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.testimonials_summary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  singleton boolean NOT NULL DEFAULT true UNIQUE,
  google_rating numeric(2,1) NOT NULL DEFAULT 5.0,
  google_reviews_count integer NOT NULL DEFAULT 0,
  google_button_url text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT tsummary_singleton_check CHECK (singleton = true)
);
GRANT SELECT ON public.testimonials_summary TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.testimonials_summary TO authenticated;
GRANT ALL ON public.testimonials_summary TO service_role;
ALTER TABLE public.testimonials_summary ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tsummary public" ON public.testimonials_summary FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage tsummary" ON public.testimonials_summary FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER tsummary_set_updated_at BEFORE UPDATE ON public.testimonials_summary FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ FAQ ============
CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faqs TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.faqs TO authenticated;
GRANT ALL ON public.faqs TO service_role;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "faqs public active" ON public.faqs FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "faqs auth all" ON public.faqs FOR SELECT TO authenticated USING (true);
CREATE POLICY "admins manage faqs" ON public.faqs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER faqs_set_updated_at BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ CONTACT ============
CREATE TABLE public.contact_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  singleton boolean NOT NULL DEFAULT true UNIQUE,
  phones jsonb NOT NULL DEFAULT '[]'::jsonb,
  whatsapp text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  working_hours text NOT NULL DEFAULT '',
  google_maps_embed_url text NOT NULL DEFAULT '',
  facebook_url text NOT NULL DEFAULT '',
  instagram_url text NOT NULL DEFAULT '',
  tiktok_url text NOT NULL DEFAULT '',
  snapchat_url text NOT NULL DEFAULT '',
  youtube_url text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT contact_singleton_check CHECK (singleton = true)
);
GRANT SELECT ON public.contact_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.contact_content TO authenticated;
GRANT ALL ON public.contact_content TO service_role;
ALTER TABLE public.contact_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contact public" ON public.contact_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage contact" ON public.contact_content FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER contact_set_updated_at BEFORE UPDATE ON public.contact_content FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ SEED ============
INSERT INTO public.about_content (eyebrow, title, highlight, description, image_url, badge_title, badge_subtitle, bullets) VALUES (
  'عن العيادة',
  'ملاذ خاص لطب الأسنان',
  'الراقي',
  'في مركز رويال ديـنـتـال، ندمج بين التميز الطبي وهدوء المنتجعات الفاخرة. كل تفصيلة — من بروتوكولات التعقيم إلى التشخيص الرقمي — مصممة حول راحتك وصحتك الفموية على المدى الطويل.',
  'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
  'تميز معتمد', 'منذ 2017',
  '["أجهزة رقمية حديثة وتصوير متقدم","راحة وخصوصية المريض أولاً","أعلى معايير التعقيم والنظافة"]'::jsonb
);

INSERT INTO public.about_advantages (icon, title, display_order) VALUES
  ('Microscope', 'أجهزة رقمية حديثة وتصوير متقدم', 1),
  ('HeartPulse', 'راحة وخصوصية المريض أولاً', 2),
  ('ShieldCheck', 'أعلى معايير التعقيم والنظافة', 3);

INSERT INTO public.about_timeline (year, title, description, display_order) VALUES
  ('2017', 'التأسيس', 'تأسست العيادة برؤية طب أسنان فاخر.', 1),
  ('2020', 'التوسع الرقمي', 'التوسع في تصميم الابتسامة الرقمي المتقدم.', 2),
  ('2023', 'أحدث التقنيات', 'إدخال أحدث تقنيات زراعة الأسنان.', 3),
  ('2026', '1000+ ابتسامة', 'أكثر من 1000 ابتسامة تم تحويلها والعدد يزداد.', 4);

INSERT INTO public.doctor_content (eyebrow, name, job_title, description) VALUES (
  'تعرف على طبيبك',
  'د. مصطفى بكر',
  'المؤسس والطبيب الأول — مركز رويال ديـنـتـال',
  'بخبرة تزيد عن 8 سنوات من الممارسة المتخصصة، يتخصص د. بكر في تجميل الأسنان والزراعة وتصميم الابتسامة الكاملة. فلسفته: الدقة والصبر ونتائج تبدو طبيعية تماماً.'
);

INSERT INTO public.doctor_stats (icon, title, value, display_order) VALUES
  ('Award', 'التخصصات', 'زراعة · تصميم ابتسامة · علاج جذور', 1),
  ('GraduationCap', 'الخبرة', 'أكثر من 8 سنوات من التميز', 2),
  ('ShieldCheck', 'الشهادات', 'المجلس الدولي لطب الأسنان', 3),
  ('Users', 'المرضى', 'أكثر من 1000 ابتسامة تم تحويلها', 4);

INSERT INTO public.offers (title, description, discount, icon, button_text, button_url, display_order) VALUES
  ('🦷 خصم 20% على تنظيف الأسنان', 'احصل على تنظيف احترافي مع إزالة الجير وتلميع الأسنان بسعر مميز.', '20%', 'Calendar', 'احجز الآن', '#book', 1),
  ('✨ تبييض الأسنان', 'خصم خاص لفترة محدودة للحصول على ابتسامة أكثر إشراقًا.', '15%', 'Percent', 'احجز الآن', '#book', 2),
  ('👨‍👩‍👧 فحص لجميع أفراد الأسرة', 'عروض خاصة عند حجز أكثر من فرد في نفس الموعد.', '', 'Users', 'احجز الآن', '#book', 3);

INSERT INTO public.testimonials (patient_name, rating, review, date_label, display_order) VALUES
  ('سارة أحمد', 5, 'أفضل تجربة علاج أسنان مررت بها. الدكتور مصطفى محترف جداً والفريق راقٍ ومتعاون.', 'منذ أسبوعين', 1),
  ('أحمد محمد', 5, 'غيّر ابتسامتي تماماً بعد جلسات الفينير. النتيجة طبيعية جداً وفوق التوقعات.', 'منذ شهر', 2),
  ('ليلى حسن', 5, 'عيادة عصرية وأجهزة حديثة ونظافة عالية. أنصح بها كل من يبحث عن جودة حقيقية.', 'منذ شهرين', 3),
  ('عمر كريم', 5, 'زراعة بدون ألم إطلاقاً ومتابعة ممتازة بعد الجلسة. تستحق كل جنيه.', 'منذ 3 أشهر', 4),
  ('منى إبراهيم', 5, 'تعامل راقي من الاستقبال حتى نهاية العلاج. الأسعار مناسبة والخدمة ملكية بحق.', 'منذ شهر', 5),
  ('خالد سمير', 5, 'تبييض الأسنان أعطاني نتيجة رائعة في جلسة واحدة، بدون أي حساسية. شكراً للفريق.', 'منذ 4 أشهر', 6),
  ('نور الدين', 5, 'أحسن دكتور تعاملت معاه. شرح الحالة بالتفصيل واختار الأنسب لي. تجربة مميزة.', 'منذ أسبوع', 7);

INSERT INTO public.testimonials_summary (google_rating, google_reviews_count, google_button_url) VALUES (4.9, 250, 'https://g.page/r/');

INSERT INTO public.faqs (question, answer, display_order) VALUES
  ('كيف يمكنني حجز موعد؟', 'عبر نموذج الحجز أدناه أو الاتصال بنا مباشرة أو مراسلتنا على واتساب.', 1),
  ('هل توفرون رعاية للحالات الطارئة؟', 'نعم، نوفر مواعيد طارئة في نفس اليوم كلما أمكن.', 2),
  ('هل العلاجات بدون ألم؟', 'نستخدم تخديراً حديثاً وتقنيات لطيفة لضمان راحتك التامة.', 3),
  ('هل تقبلون التأمين الصحي؟', 'نتعامل مع معظم شركات التأمين الكبرى. تواصل معنا للتأكد من خطتك.', 4),
  ('كم يستغرق تصميم الابتسامة؟', 'بحسب الخطة، عادةً بين 2 إلى 6 زيارات.', 5);

INSERT INTO public.contact_content (phones, whatsapp, email, address, working_hours, google_maps_embed_url) VALUES (
  '["+20 100 000 0000"]'::jsonb,
  '+20 100 000 0000',
  'info@royaldental.com',
  'وسط البلد - القاهرة',
  'السبت – الخميس · 10:00 – 22:00',
  'https://www.google.com/maps?q=Cairo&output=embed'
);

INSERT INTO public.gallery_categories (name, slug, display_order) VALUES
  ('العيادة', 'clinic', 1),
  ('الفريق', 'team', 2),
  ('المعدات', 'equipment', 3);
