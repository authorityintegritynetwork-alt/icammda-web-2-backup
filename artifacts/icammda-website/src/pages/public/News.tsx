import { useState } from "react";
import { Link } from "wouter";
import { format } from "date-fns";
import { ArrowRight, Newspaper } from "lucide-react";
import { useListPosts } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";

const CATEGORIES = ["All", "News", "Recent Training", "Upcoming Training"];

export default function News() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: posts, isLoading } = useListPosts({ published: true });

  const filtered = posts?.filter((p) =>
    activeCategory === "All" ? true : p.category === activeCategory
  ) ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNav />

      <section className="bg-[hsl(222,47%,11%)] text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Updates</p>
          <h1 className="text-4xl font-bold font-serif mb-3" data-testid="news-page-title">News &amp; Updates</h1>
          <p className="text-slate-300">Stay informed about ICAMMDA's latest research, training events, and announcements.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8" data-testid="category-filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                activeCategory === cat
                  ? "bg-primary text-white border-primary"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
              data-testid={`filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground" data-testid="no-news-message">
            <Newspaper size={48} className="mx-auto mb-3 opacity-20" />
            <p className="text-lg font-medium">No posts in this category yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="posts-grid">
            {filtered.map((post) => (
              <article
                key={post.id}
                className="group bg-card border border-card-border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                data-testid={`news-card-${post.id}`}
              >
                {post.imageUrl && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                    {post.featured && <Badge className="text-xs bg-primary/10 text-primary">Featured</Badge>}
                  </div>
                  <h2 className="font-semibold text-foreground leading-snug group-hover:text-primary transition-colors mb-2" data-testid={`news-title-${post.id}`}>
                    <Link href={`/news/${post.slug}`}>{post.title}</Link>
                  </h2>
                  {post.excerpt && <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{format(new Date(post.createdAt), "MMM d, yyyy")}</span>
                    {post.authorName && <span>{post.authorName}</span>}
                  </div>
                  <Link href={`/news/${post.slug}`} className="mt-3 flex items-center gap-1 text-xs text-primary hover:underline" data-testid={`read-more-${post.id}`}>
                    Read more <ArrowRight size={12} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <PublicFooter />
    </div>
  );
}
