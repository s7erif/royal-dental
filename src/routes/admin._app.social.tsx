import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/primitives";
import { CollectionManager } from "@/components/admin/CollectionManager";

export const Route = createFileRoute("/admin/_app/social")({
  component: SocialAdminPage,
});

const PLATFORM_OPTIONS = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "tiktok", label: "TikTok" },
  { value: "snapchat", label: "Snapchat" },
  { value: "twitter", label: "X (Twitter)" },
  { value: "youtube", label: "YouTube" },
  { value: "linkedin", label: "LinkedIn" },
];

function SocialAdminPage() {
  return (
    <>
      <PageHeader
        title="وسائل التواصل الاجتماعي"
        description="إدارة أيقونات وروابط منصات التواصل الظاهرة في الفوتر وصفحة التواصل."
        breadcrumbs={[{ label: "الرئيسية", to: "/admin" }, { label: "المحتوى" }, { label: "وسائل التواصل" }]}
      />
      <CollectionManager
        table="social_links"
        queryKey="admin-social-links"
        publicQueryKey="public-social-links"
        titleField="platform"
        toggleField="is_active"
        fields={[
          { key: "platform", label: "المنصة", type: "select", required: true, options: PLATFORM_OPTIONS },
          { key: "url", label: "الرابط أو رقم واتساب", type: "text", required: true },
          { key: "open_in_new_tab", label: "فتح في تبويب جديد", type: "boolean", hideInTable: true },
          { key: "is_active", label: "مفعّل", type: "boolean", hideInTable: true },
          { key: "display_order", label: "الترتيب", type: "number", hideInTable: true },
        ]}
        createDefaults={{ is_active: true, open_in_new_tab: true, display_order: 99, url: "" }}
      />
    </>
  );
}
