import { useRoute, Link } from "wouter";
import { format } from "date-fns";
import { ArrowLeft, User, Tag } from "lucide-react";
import { useListPosts } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";

export default function NewsDetail() {
  const [, params] = useRoute("/news/:slug");
  const { data: posts, isLoading } = useListPosts({ published: true });
  const post = posts?.find((p) => p.slug === params?.slug);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <PublicNav />
        <div className="max-w-3xl mx-auto px-4 py-12 w-full">
          <Skeleton className="h-8 w-24 mb-6" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-4 w-48 mb-8" />
          <Skeleton className="h-64 w-full mb-6" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
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
        <div className="max-w-3xl mx-auto px-4 py-20 text-center text-muted-foreground" data-testid="post-not-found">
          <p className="text-lg font-medium">Post not found.</p>
          <Link href="/news" className="text-primary hover:underline mt-3 inline-block">Back to News</Link>
        </div>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNav />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 w-full" data-testid="news-detail">
        <Link href="/news" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors" data-testid="back-to-news">
          <ArrowLeft size={14} /> Back to News
        </Link>

        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary">{post.category}</Badge>
          {post.featured && <Badge className="bg-primary/10 text-primary">Featured</Badge>}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold font-serif text-foreground leading-tight mb-4" data-testid="news-detail-title">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b border-border">
          <span>{format(new Date(post.createdAt), "MMMM d, yyyy")}</span>
          {post.authorName && (
            <span className="flex items-center gap-1">
              <User size={13} /> {post.authorName}
            </span>
          )}
        </div>

        {post.imageUrl && (
          <div className="rounded-xl overflow-hidden mb-8 aspect-video">
            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" data-testid="news-detail-image" />
          </div>
        )}

        <div
          className="prose prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
          data-testid="news-detail-content"
        />
      </article>

      <PublicFooter />
    </div>
  );
}
