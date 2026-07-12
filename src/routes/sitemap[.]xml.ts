import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { blogPosts } from "@/data/clinic";

const BASE = "https://glow-forge-charm.lovable.app";
const routes = ["/", "/about", "/services", "/doctors", "/pricing", "/booking", "/consultations", "/blog", "/faq", "/contact", "/privacy", "/terms"];

export const Route = createFileRoute("/sitemap.xml")({
  server: { handlers: { GET: async () => {
    const urls = [
      ...routes.map(p => `  <url><loc>${BASE}${p}</loc><changefreq>weekly</changefreq></url>`),
      ...blogPosts.map(p => `  <url><loc>${BASE}/blog/${p.slug}</loc><changefreq>monthly</changefreq></url>`),
    ].join("\n");
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
    return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" }});
  }}},
});
