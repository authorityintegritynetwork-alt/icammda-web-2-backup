import { useRoute, Link } from "wouter";
import { format } from "date-fns";
import { ArrowLeft, User, Calendar } from "lucide-react";
import { useListPosts } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import DOMPurify from "isomorphic-dompurify";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";

export default function NewsDetail() {
  const [, params] = useRoute("/news/:slug");
  const { data: posts, isLoading } = useListPosts({ published: true });
  const post = posts?.find((p) => p.slug === params?.slug);
  const related = posts?.filter((p) => p.slug !== params?.slug).slice(0, 2);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <PublicNav />
        <div className="max-w-3xl mx-auto px-5 py-32 w-full">
          <Skeleton className="h-5 w-24 mb-8" />
          <Skeleton className="h-14 w-3/4 mb-4" />
          <Skeleton className="h-4 w-48 mb-12" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-4 w-full" />)}
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <PublicNav />
        <div className="max-w-3xl mx-auto px-5 py-32 text-center" data-testid="post-not-found">
          <p className="font-serif text-2xl text-foreground mb-3">Post not found.</p>
          <Link href="/news" className="text-cyan-600 hover:underline text-sm">← Back to News</Link>
        </div>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNav />

      {/* Hero */}
      <section className="bg-[#07101e] pt-28 pb-16">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <Link href="/news" className="inline-flex items-center gap-2 text-white/40 hover:text-cyan-400 text-xs font-medium mb-8 transition-colors" data-testid="back-to-news">
            <ArrowLeft size={13} /> Back to News
          </Link>
          <span className="text-[10px] font-bold tracking-widest uppercase text-cyan-400 bg-cyan-400/10 px-2.5 py-1 rounded-full">{post.category}</span>
          <h1 className="font-serif text-white text-3xl sm:text-4xl md:text-5xl leading-tight mt-4 mb-6" data-testid="news-detail-title">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-5 text-white/35 text-xs">
            <span className="flex items-center gap-1.5">
              <Calendar size={12} className="text-cyan-400/60" />
              {format(new Date(post.createdAt), "MMMM d, yyyy")}
            </span>
            {post.authorName && (
              <span className="flex items-center gap-1.5">
                <User size={12} className="text-cyan-400/60" />
                {post.authorName}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-5 sm:px-8 py-14 w-full" data-testid="news-detail">
        {post.imageUrl && (
          <div className="rounded-2xl overflow-hidden mb-12 aspect-video">
            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" data-testid="news-detail-image" />
          </div>
        )}
        <div
          className="prose prose-slate prose-headings:font-serif prose-headings:font-normal prose-a:text-cyan-600 max-w-none"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
          data-testid="news-detail-content"
        />
      </article>

      {/* Related */}
      {related && related.length > 0 && (
        <section className="border-t border-border/60 bg-muted/30">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 py-14">
            <p className="text-cyan-600 text-xs font-bold tracking-widest uppercase mb-6">More Reading</p>
            <div className="grid sm:grid-cols-2 gap-5">
              {related.map((p) => (
                <Link key={p.id} href={`/news/${p.slug}`}>
                  <div className="group bg-card border border-card-border rounded-2xl p-5 hover-lift cursor-pointer">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-cyan-600 mb-2 block">{p.category}</span>
                    <p className="font-serif text-foreground text-sm leading-snug group-hover:text-cyan-700 transition-colors">{p.title}</p>
                    <p className="text-muted-foreground text-xs mt-2">{format(new Date(p.createdAt), "MMM d, yyyy")}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <PublicFooter />
    </div>
  );
}
