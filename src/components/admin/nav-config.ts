import {
  LayoutDashboard,
  Image as ImageIcon,
  Settings,
  User,
  Home,
  Info,
  UserCog,
  Stethoscope,
  Tag,
  Sparkles,
  GalleryHorizontal,
  MessageSquareQuote,
  HelpCircle,
  Phone,
  Share2,
  type LucideIcon,
} from "lucide-react";

export type NavItem = { to: string; label: string; icon: LucideIcon };
export type NavGroup = { label?: string; items: NavItem[] };

export const navGroups: NavGroup[] = [
  {
    items: [{ to: "/admin", label: "الرئيسية", icon: LayoutDashboard }],
  },
  {
    label: "المحتوى",
    items: [
      { to: "/admin/hero", label: "الواجهة الرئيسية", icon: Home },
      { to: "/admin/about", label: "عن العيادة", icon: Info },
      { to: "/admin/doctor", label: "الطبيب", icon: UserCog },
      { to: "/admin/services", label: "الخدمات", icon: Stethoscope },
      { to: "/admin/offers", label: "العروض", icon: Tag },
      { to: "/admin/before-after", label: "قبل وبعد", icon: Sparkles },
      { to: "/admin/gallery", label: "المعرض", icon: GalleryHorizontal },
      { to: "/admin/testimonials", label: "آراء العملاء", icon: MessageSquareQuote },
      { to: "/admin/faq", label: "الأسئلة الشائعة", icon: HelpCircle },
      { to: "/admin/contact", label: "التواصل", icon: Phone },
      { to: "/admin/social", label: "وسائل التواصل الاجتماعي", icon: Share2 },
    ],
  },
  {
    label: "النظام",
    items: [
      { to: "/admin/media", label: "مكتبة الوسائط", icon: ImageIcon },
      { to: "/admin/settings", label: "الإعدادات", icon: Settings },
      { to: "/admin/profile", label: "الملف الشخصي", icon: User },
    ],
  },
];

export const allNavItems: NavItem[] = navGroups.flatMap((g) => g.items);
