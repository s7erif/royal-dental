# إعادة تصميم "الخدمات والأسعار"

## 1) قاعدة البيانات (تعديل بسيط، بدون كسر)

- إضافة عمود `service_type` إلى جدول `services` بالقيم: `simple` (افتراضي) أو `grouped`.
- إنشاء جدول جديد `service_variants` للأنواع (يستخدم فقط للـ Grouped):
  - `service_id` (FK → services)
  - `name_ar`
  - `description_ar` (اختياري)
  - `pricing_type` (`fixed` / `range` / `starting_from`)
  - `fixed_price`, `min_price`, `max_price`, `starting_price`
  - `display_order`, `is_active`
- GRANTs + RLS: قراءة عامة للأنواع النشطة، كتابة للـ admin فقط.
- الحقول القديمة (`slug`, `meta_*`, `seo_keywords`, `gallery_images`, `button_*`, `features` ...) تبقى في DB (لا نكسر شيء) لكن نخفيها من الـ Admin UI.

## 2) الواجهة العامة (`/pricing` + الصفحة الرئيسية)

كارت لكل خدمة، الشكل يتغير حسب النوع:

- **Simple**: أيقونة، اسم، وصف قصير، **السعر بخط كبير**، زر «احجز الآن». لا يوجد زر تفاصيل.
- **Grouped**: أيقونة، اسم، وصف قصير، شارة «يبدأ من X» أو «عدة خيارات»، زر **«عرض التفاصيل →»**.
  - عند الضغط يفتح **Modal (Dialog)** فيه: نبذة + قائمة الأنواع (اسم/وصف/سعر) + زر «احجز الآن».

البحث + تبويبات التصنيفات كما هي.

## 3) لوحة التحكم (تبسيط كامل)

إعادة كتابة `ServiceForm` ليعرض فقط ما يحتاجه الطبيب:

**حقول مشتركة:**
- الاسم (عربي)
- التصنيف
- الأيقونة
- الوصف المختصر
- الصورة (اختياري)
- ترتيب العرض
- مفعّل / غير مفعّل
- **نوع الخدمة**: بسيطة / متعددة الأنواع (Switch أو Tabs)

**لو Simple:** حقل السعر فقط (نوع السعر + القيمة).

**لو Grouped:** جدول أنواع inline:
| اسم النوع | السعر | وصف (اختياري) | ↕ | 🗑 |

زر «+ إضافة نوع».

**يتم حذف من الواجهة:** Slug, Meta, SEO Keywords, Gallery, Button URL/Text, Features list, Description الطويل, name_en/desc_en, show_on_homepage, featured, price (نصي القديم), duration. (الحقول تبقى في DB بقيم افتراضية.)

الـ Slug يُولَّد تلقائياً من الاسم في الخلفية.

## 4) صفحات Admin

- `admin/services` : جدول مبسّط (اسم، تصنيف، النوع، السعر/عدد الأنواع، الحالة، ترتيب، إجراءات).
- `admin/services/new` و `admin/services/:id/edit` : الفورم الجديد المبسّط الذي يدير الأنواع في نفس الشاشة.

## 5) طبقة الخادم (Server Functions)

- تحديث `createService` / `updateService` لقبول مصفوفة `variants` وحفظها في `service_variants` بمعاملة واحدة.
- توليد `slug` تلقائياً + قيم افتراضية للحقول المخفية.
- `public-services.ts`: إرجاع `service_type` و `variants[]` مع كل خدمة نشطة.

## 6) توافق

- لا تغيير في الـ Routes أو الـ Theme.
- الخدمات الحالية تبقى `simple` بشكل افتراضي وتعمل كما هي.
- تحديث `types.ts` بعد الـ migration.

---

هل أبدأ التنفيذ بهذا الشكل؟
