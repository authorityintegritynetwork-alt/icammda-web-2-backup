import { Link } from "wouter";
import { ArrowRight, BookOpen, Users, TrendingUp, Cpu, Calendar, Newspaper } from "lucide-react";
import { format } from "date-fns";
import { useGetRecentPosts, useGetUpcomingEvents, useListPartners } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";

const activities = [
  { icon: BookOpen, title: "Book Reading", desc: "Collaborative reading of key texts in mathematical modelling and epidemiology." },
  { icon: Users, title: "Journal Club", desc: "Weekly discussions of recent publications in data science and public health." },
  { icon: TrendingUp, title: "Progress Reports", desc: "Regular research updates and milestone reviews across all ongoing projects." },
  { icon: Cpu, title: "Software Hub", desc: "Hands-on training in modelling tools: R, Python, NetLogo, and more." },
];

function PostCard({ post }: { post: { id: number; title: string; slug: string; category: string; excerpt: string | null; createdAt: string; imageUrl: string | null } }) {
  return (
    <article className="group bg-card border border-card-border rounded-xl overflow-hidden hover:shadow-md transition-shadow" data-testid={`post-card-${post.id}`}>
      {post.imageUrl && (
        <div className="aspect-video overflow-hidden">
          <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      )}
      <div className="p-5">
        <Badge variant="secondary" className="mb-2 text-xs">{post.category}</Badge>
        <h3 className="font-semibold text-foreground leading-snug group-hover:text-primary transition-colors mb-2" data-testid={`post-title-${post.id}`}>
          <Link href={`/news/${post.slug}`}>{post.title}</Link>
        </h3>
        {post.excerpt && <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{format(new Date(post.createdAt), "MMM d, yyyy")}</span>
          <Link href={`/news/${post.slug}`} className="text-primary hover:underline flex items-center gap-1">
            Read more <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function EventCard({ event }: { event: { id: number; title: string; slug: string; eventType: string; location: string | null; startDate: string | null; description: string } }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-card border border-card-border rounded-xl hover:shadow-sm transition-shadow group" data-testid={`event-card-${event.id}`}>
      <div className="shrink-0 w-12 h-12 rounded-lg bg-primary/10 text-primary flex flex-col items-center justify-center text-center">
        {event.startDate ? (
          <>
            <span className="text-xs font-bold leading-none">{format(new Date(event.startDate), "MMM")}</span>
            <span className="text-lg font-bold leading-none">{format(new Date(event.startDate), "d")}</span>
          </>
        ) : (
          <Calendar size={18} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <Badge variant="outline" className="text-xs mb-1">{event.eventType}</Badge>
        <h4 className="font-medium text-sm leading-snug group-hover:text-primary transition-colors" data-testid={`event-title-${event.id}`}>
          <Link href={`/events/${event.slug}`}>{event.title}</Link>
        </h4>
        {event.location && <p className="text-xs text-muted-foreground mt-0.5">{event.location}</p>}
      </div>
    </div>
  );
}

export default function Home() {
  const { data: recentPosts, isLoading: postsLoading } = useGetRecentPosts();
  const { data: upcomingEvents, isLoading: eventsLoading } = useGetUpcomingEvents();
  const { data: partners } = useListPartners();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNav />

      {/* Hero */}
      <section className="relative bg-[hsl(222,47%,11%)] text-white overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "30px 30px" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-3 py-1 text-xs font-medium text-primary mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Member of WAMCAD — West Africa Mathematical Modelling Capacity Development
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight font-serif mb-4" data-testid="hero-title">
              Science with Purpose.<br />
              <span className="text-primary">Data with Power.</span><br />
              Impact with Vision.
            </h1>
            <p className="text-lg text-slate-300 mb-3 leading-relaxed">
              International Centre for Applied Mathematical Modelling and Data Analytics
            </p>
            <p className="text-slate-400 mb-8 max-w-xl">
              Federal University Oye-Ekiti, Ekiti State, Nigeria — building Africa's next generation of modelling scientists to tackle real public health challenges.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/about">
                <button className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors" data-testid="hero-about-btn">
                  Learn About Us <ArrowRight size={16} />
                </button>
              </Link>
              <Link href="/events">
                <button className="inline-flex items-center gap-2 border border-white/30 hover:border-white/60 hover:bg-white/10 text-white px-6 py-3 rounded-lg font-medium transition-colors" data-testid="hero-events-btn">
                  View Events
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ICAMMDA acronym banner */}
      <div className="bg-primary text-white overflow-hidden py-3">
        <div className="animate-marquee whitespace-nowrap">
          {["INNOVATION", "COLLABORATION", "ANALYTICS", "MODELLING", "MENTORSHIP", "DISCOVERY", "ADVANCEMENT"].map((word, i) => (
            <span key={i} className="mx-6 text-sm font-bold tracking-widest">
              {word[0]}-{word.slice(1)}
            </span>
          ))}
          {["INNOVATION", "COLLABORATION", "ANALYTICS", "MODELLING", "MENTORSHIP", "DISCOVERY", "ADVANCEMENT"].map((word, i) => (
            <span key={`r-${i}`} className="mx-6 text-sm font-bold tracking-widest">
              {word[0]}-{word.slice(1)}
            </span>
          ))}
        </div>
      </div>

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" data-testid="mission-section">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">Our Mission</p>
            <h2 className="text-3xl font-bold font-serif text-foreground mb-4 leading-tight">
              Training a Critical Mass of Modelling Scientists in West Africa
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Our long-term goal is to train researchers who are retained within the West African region, training the next generation of modellers, and working closely with National Malaria Elimination Programs and other health bodies to provide operational support.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We aim to build scientists who are competitive in obtaining grants from international funding agencies and closely networked with partners across West Africa and globally.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "10+", label: "Active Researchers" },
              { value: "5+", label: "Partner Institutions" },
              { value: "3+", label: "Countries Represented" },
              { value: "20+", label: "Events & Trainings" },
            ].map((stat) => (
              <div key={stat.label} className="bg-card border border-card-border rounded-xl p-5 text-center" data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Activities */}
      <section className="bg-muted/50 py-16" data-testid="activities-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">What We Do</p>
            <h2 className="text-3xl font-bold font-serif text-foreground">Core Activities</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activities.map((act) => (
              <div key={act.title} className="bg-card border border-card-border rounded-xl p-6 hover:shadow-md transition-shadow" data-testid={`activity-${act.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <act.icon size={20} />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{act.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{act.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News & Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Recent News */}
          <div className="lg:col-span-2" data-testid="recent-news-section">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-1">Updates</p>
                <h2 className="text-2xl font-bold font-serif text-foreground">Latest News</h2>
              </div>
              <Link href="/news" className="text-sm text-primary hover:underline flex items-center gap-1" data-testid="view-all-news">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            {postsLoading ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {[1, 2].map((i) => <Skeleton key={i} className="h-52 rounded-xl" />)}
              </div>
            ) : recentPosts && recentPosts.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {recentPosts.slice(0, 4).map((post) => <PostCard key={post.id} post={post} />)}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground text-sm border border-dashed rounded-xl" data-testid="no-posts-message">
                <Newspaper size={32} className="mx-auto mb-2 opacity-30" />
                No news published yet.
              </div>
            )}
          </div>

          {/* Upcoming Events */}
          <div data-testid="upcoming-events-section">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-1">Schedule</p>
                <h2 className="text-2xl font-bold font-serif text-foreground">Upcoming Events</h2>
              </div>
              <Link href="/events" className="text-sm text-primary hover:underline flex items-center gap-1" data-testid="view-all-events">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            {eventsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
              </div>
            ) : upcomingEvents && upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map((event) => <EventCard key={event.id} event={event} />)}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground text-sm border border-dashed rounded-xl" data-testid="no-events-message">
                <Calendar size={32} className="mx-auto mb-2 opacity-30" />
                No upcoming events.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Partners */}
      {partners && partners.length > 0 && (
        <section className="bg-muted/50 py-14" data-testid="partners-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-1">Collaborations</p>
              <h2 className="text-2xl font-bold font-serif text-foreground">Our Esteemed Partners</h2>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-6">
              {partners.map((p) => (
                <div key={p.id} className="flex items-center gap-2 bg-card border border-card-border rounded-lg px-5 py-3" data-testid={`partner-${p.id}`}>
                  {p.logoUrl ? (
                    <img src={p.logoUrl} alt={p.name} className="h-8 object-contain" />
                  ) : (
                    <span className="font-semibold text-sm text-foreground">{p.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <PublicFooter />
    </div>
  );
}
