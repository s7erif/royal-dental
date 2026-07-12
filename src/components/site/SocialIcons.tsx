import { useQuery } from "@tanstack/react-query";
import { Facebook, Instagram, MessageCircle, Music2, Ghost, Twitter, Youtube, Linkedin, Phone, type LucideIcon } from "lucide-react";
import { fetchSocialLinks, fetchContact, type PublicSocialLink, type SocialPlatform } from "@/lib/public-cms";
import { cn } from "@/lib/utils";

const ICONS: Record<SocialPlatform, LucideIcon> = {
  facebook: Facebook,
  instagram: Instagram,
  whatsapp: MessageCircle,
  tiktok: Music2,
  snapchat: Ghost,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
};

const LABELS: Record<SocialPlatform, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  whatsapp: "WhatsApp",
  tiktok: "TikTok",
  snapchat: "Snapchat",
  twitter: "X (Twitter)",
  youtube: "YouTube",
  linkedin: "LinkedIn",
};

const ORDER: SocialPlatform[] = [
  "facebook", "instagram", "whatsapp", "tiktok", "snapchat", "twitter", "youtube", "linkedin",
];

export function resolveSocialHref(link: Pick<PublicSocialLink, "platform" | "url">): string {
  if (link.platform === "whatsapp") {
    const digits = link.url.replace(/[^\d]/g, "");
    if (digits) return `https://wa.me/${digits}`;
  }
  return link.url;
}

export function useSocialLinks() {
  return useQuery({ queryKey: ["public-social-links"], queryFn: fetchSocialLinks });
}

/**
 * Premium circular social icons — 42px, white bg, thin gold border, gold icon.
 * Hover fills gold with white icon and a 1.05 scale (0.3s transition).
 */
export function SocialIcons({
  className,
  filter,
}: {
  className?: string;
  filter?: SocialPlatform[];
}) {
  const { data: links = [] } = useSocialLinks();
  const source = filter ? links.filter((l) => filter.includes(l.platform)) : links;

  const byPlatform = new Map(source.map((l) => [l.platform, l] as const));
  const items = ORDER
    .map((p) => byPlatform.get(p))
    .filter((l): l is PublicSocialLink => !!l);

  if (items.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {items.map((l) => {
        const Icon = ICONS[l.platform];
        return (
          <a
            key={l.id}
            href={resolveSocialHref(l)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={LABELS[l.platform]}
            title={LABELS[l.platform]}
            className="grid h-[42px] w-[42px] place-items-center rounded-full border border-[color:var(--color-gold)] bg-white text-[color:var(--color-gold-dark)] transition-all duration-300 hover:scale-105 hover:border-transparent hover:bg-gradient-to-br hover:from-[color:var(--color-gold-light)] hover:to-[color:var(--color-gold-dark)] hover:text-white hover:shadow-[0_10px_25px_-8px_rgba(200,162,75,0.55)]"
          >
            <Icon className="h-[18px] w-[18px]" />
          </a>
        );
      })}
    </div>
  );
}

/**
 * Fixed vertical bar on the right side: WhatsApp, Phone, Facebook, Instagram.
 */
export function FloatingSocialBar() {
  const { data: links = [] } = useSocialLinks();
  const { data: contact } = useQuery({ queryKey: ["public-contact"], queryFn: fetchContact });

  const byPlatform = new Map(links.map((l) => [l.platform, l] as const));
  const phone = contact?.phones?.[0];

  type Item = { key: string; href: string; label: string; Icon: LucideIcon; isTel?: boolean };
  const items: Item[] = [];
  const wa = byPlatform.get("whatsapp");
  if (wa) items.push({ key: wa.id, href: resolveSocialHref(wa), label: "WhatsApp", Icon: MessageCircle });
  if (phone) items.push({ key: "phone", href: `tel:${phone}`, label: "الهاتف", Icon: Phone, isTel: true });
  const fb = byPlatform.get("facebook");
  if (fb) items.push({ key: fb.id, href: resolveSocialHref(fb), label: "Facebook", Icon: Facebook });
  const ig = byPlatform.get("instagram");
  if (ig) items.push({ key: ig.id, href: resolveSocialHref(ig), label: "Instagram", Icon: Instagram });

  if (items.length === 0) return null;

  return (
    <div className="fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2.5 sm:flex">
      {items.map((it) => (
        <a
          key={it.key}
          href={it.href}
          target={it.isTel ? undefined : "_blank"}
          rel={it.isTel ? undefined : "noopener noreferrer"}
          aria-label={it.label}
          title={it.label}
          className="grid h-[42px] w-[42px] place-items-center rounded-full border border-[color:var(--color-gold)] bg-white text-[color:var(--color-gold-dark)] shadow-[0_10px_25px_-12px_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-105 hover:border-transparent hover:bg-gradient-to-br hover:from-[color:var(--color-gold-light)] hover:to-[color:var(--color-gold-dark)] hover:text-white hover:shadow-[0_15px_35px_-10px_rgba(200,162,75,0.6)]"
        >
          <it.Icon className="h-[18px] w-[18px]" />
        </a>
      ))}
    </div>
  );
}

export const FloatingSocialIcons = FloatingSocialBar;
