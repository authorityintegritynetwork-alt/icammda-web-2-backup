import { useState } from "react";
import { Link } from "wouter";
import { format } from "date-fns";
import { ArrowUpRight } from "lucide-react";
import { useListPosts } from "@workspace/api-client-react";
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

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/section-bg.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07101e]/97 via-[#07101e]/92 to-[#07101e]/80" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
        <div
        />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <p className="text-cyan-400 text-xs font-bold tracking-widest uppercase mb-4">Updates</p>
          <h1 className="font-serif text-white text-5xl sm:text-6xl md:text-7xl leading-tight mb-4" data-testid="news-page-title">
            News &amp;<br /><em className="text-gradient">Updates</em>
          </h1>
          <p className="text-white/40 text-lg max-w-xl">
            Stay informed about research breakthroughs, training events, and announcements from ICAMMDA.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 py-16">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-12" data-testid="category-filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                activeCategory === cat
                  ? "bg-cyan-500 text-black border-cyan-500 font-semibold"
                  : "border-border text-muted-foreground hover:border-cyan-300 hover:text-cyan-700"
              }`}
              data-testid={`filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-72 rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground" data-testid="no-news-message">
            <p className="text-lg font-serif">No posts in this category yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="posts-grid">
            {filtered.map((post, idx) => (
              <Link key={post.id} href={`/news/${post.slug}`}>
                <article
                  className="group bg-card border border-card-border rounded-2xl overflow-hidden hover-lift cursor-pointer h-full flex flex-col"
                  data-testid={`news-card-${post.id}`}
                >
                  {/* Placeholder colored top */}
                  {!post.imageUrl && (
                    <div className={`h-2 ${idx % 3 === 0 ? "bg-gradient-to-r from-cyan-400 to-cyan-500" : idx % 3 === 1 ? "bg-gradient-to-r from-cyan-500 to-cyan-600" : "bg-gradient-to-r from-cyan-600 to-cyan-400"}`} />
                  )}
                  {post.imageUrl && (
                    <div className="aspect-video overflow-hidden">
                      <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-full w-fit mb-3">{post.category}</span>
                    <h2 className="font-serif text-foreground text-lg leading-snug group-hover:text-cyan-700 transition-colors mb-3 flex-1" data-testid={`news-title-${post.id}`}>
                      {post.title}
                    </h2>
                    {post.excerpt && <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/60 mt-auto">
                      <span>{format(new Date(post.createdAt), "MMM d, yyyy")}</span>
                      <span className="flex items-center gap-1 text-cyan-600 font-medium group-hover:gap-2 transition-all" data-testid={`read-more-${post.id}`}>
                        Read <ArrowUpRight size={11} />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>

      <PublicFooter />
    </div>
  );
}
