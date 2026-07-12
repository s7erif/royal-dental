import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { PageShell, Container } from "@/components/site/PageShell";
import { blogPosts } from "@/data/clinic";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = blogPosts.find(p => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => ({ meta: loaderData ? [
    { title: `${loaderData.post.title} — رويال ديـنـتـال` },
    { name: "description", content: loaderData.post.excerpt },
    { property: "og:title", content: loaderData.post.title },
    { property: "og:description", content: loaderData.post.excerpt },
    { property: "og:type", content: "article" },
  ] : [{ title: "غير موجود" }, { name: "robots", content: "noindex" }]}),
  notFoundComponent: () => <PageShell heroTitle="المقال غير موجود" heroSubtitle="ربما تم حذفه أو تغيير رابطه."><div className="pb-24 text-center"><Link to="/blog" className="text-[color:var(--color-gold-dark)] underline">العودة للمدونة</Link></div></PageShell>,
  errorComponent: () => <PageShell heroTitle="حدث خطأ"><div /></PageShell>,
  component: PostPage,
});

function PostPage() {
  const { post } = Route.useLoaderData();
  return (
    <PageShell heroKicker={post.category} heroTitle={post.title}>
      <article className="pb-20"><Container>
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-center gap-6 text-sm text-[color:var(--color-charcoal)]/60">
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{post.date}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{post.read}</span>
          </div>
          <div className="mt-8 rounded-[28px] border border-white/60 bg-white/70 p-8 backdrop-blur-xl">
            <p className="lead text-lg leading-relaxed text-[color:var(--color-charcoal)]/80">{post.excerpt}</p>
            <div className="mt-6 space-y-4 leading-loose text-[color:var(--color-charcoal)]/75">
              {post.content.map((p: string, i: number) => <p key={i}>{p}</p>)}
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link to="/blog" className="inline-flex items-center gap-2 text-[color:var(--color-gold-dark)] font-semibold hover:underline">
              <ArrowRight className="h-4 w-4" /> جميع المقالات
            </Link>
          </div>
        </div>
      </Container></article>
    </PageShell>
  );
}
