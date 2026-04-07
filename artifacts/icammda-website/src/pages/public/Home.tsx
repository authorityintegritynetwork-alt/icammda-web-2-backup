import { Link } from "wouter";
import { ArrowUpRight, BookOpen, Users, BarChart3, Cpu, Calendar, ChevronRight, Microscope, Globe, Database } from "lucide-react";
import { format } from "date-fns";
import { useGetRecentPosts, useGetUpcomingEvents, useListPartners } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";

const activities = [
  { icon: BookOpen, title: "Book Reading", desc: "Collaborative reading of key texts in mathematical modelling and epidemiology." },
  { icon: Users, title: "Journal Club", desc: "Weekly discussions of cutting-edge publications across data science and public health." },
  { icon: BarChart3, title: "Progress Reports", desc: "Regular research updates and milestone reviews across all active projects." },
  { icon: Cpu, title: "Software Hub", desc: "Hands-on mastery in R, Python, NetLogo, and other modelling environments." },
];

const statsData = [
  { value: "10+", label: "Active Researchers", icon: Microscope },
  { value: "5+", label: "Partner Institutions", icon: Globe },
  { value: "3+", label: "Countries Engaged", icon: Database },
  { value: "20+", label: "Events & Trainings", icon: Calendar },
];

export default function Home() {
  const { data: recentPosts, isLoading: postsLoading } = useGetRecentPosts();
  const { data: upcomingEvents, isLoading: eventsLoading } = useGetUpcomingEvents();
  const { data: partners } = useListPartners();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNav />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative bg-[#0a0c14] overflow-hidden min-h-screen flex items-center" data-testid="hero-section">
        {/* Gradient blobs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-600/8 rounded-full blur-[100px] pointer-events-none" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }}
        />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-24 pb-20 w-full">
          <div className="max-w-4xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-8">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400/60 animate-pulse" style={{ animationDelay: "0.2s" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400/30 animate-pulse" style={{ animationDelay: "0.4s" }} />
              </div>
              <span className="text-teal-400 text-xs font-semibold tracking-widest uppercase">WAMCAD Member — West Africa</span>
            </div>

            <h1 className="font-serif text-white text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight mb-8" data-testid="hero-title">
              Where African<br />
              <em className="not-italic text-gradient">Science</em> Meets<br />
              World-Class<br />
              Analytics.
            </h1>

            <p className="text-white/50 text-lg sm:text-xl max-w-2xl leading-relaxed mb-10">
              International Centre for Applied Mathematical Modelling and Data Analytics — Federal University Oye-Ekiti. Building the next generation of modelling scientists to solve Africa's health challenges.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/about">
                <button className="group flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-black font-semibold px-7 py-3.5 rounded-xl text-sm transition-all duration-200" data-testid="hero-about-btn">
                  Discover ICAMMDA
                  <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </Link>
              <Link href="/events">
                <button className="flex items-center gap-2 border border-white/15 hover:border-white/30 text-white/70 hover:text-white px-7 py-3.5 rounded-xl text-sm font-medium transition-all duration-200" data-testid="hero-events-btn">
                  View Events
                </button>
              </Link>
            </div>
          </div>

          {/* Floating stat cards */}
          <div className="hidden lg:block absolute right-10 top-1/2 -translate-y-1/2 space-y-3 animate-float">
            {statsData.map((stat, i) => (
              <div
                key={stat.label}
                className="glass-dark rounded-2xl px-5 py-4 flex items-center gap-4 w-52"
                style={{ animationDelay: `${i * 0.15}s` }}
                data-testid={`hero-stat-${i}`}
              >
                <div className="w-9 h-9 rounded-xl bg-teal-500/15 flex items-center justify-center shrink-0">
                  <stat.icon size={16} className="text-teal-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-xl leading-none">{stat.value}</p>
                  <p className="text-white/40 text-xs mt-0.5">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/25">
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </section>

      {/* ═══════════ TICKER ═══════════ */}
      <div className="bg-teal-500 py-3 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap text-black">
          {["Mathematical Modelling", "Epidemiology", "Data Analytics", "Capacity Building", "West Africa", "Public Health", "R & Python", "Optimal Control", "Machine Learning", "WAMCAD"].map((word, i) => (
            <span key={i} className="mx-6 text-xs font-bold tracking-widest uppercase">{word} ·</span>
          ))}
          {["Mathematical Modelling", "Epidemiology", "Data Analytics", "Capacity Building", "West Africa", "Public Health", "R & Python", "Optimal Control", "Machine Learning", "WAMCAD"].map((word, i) => (
            <span key={`r-${i}`} className="mx-6 text-xs font-bold tracking-widest uppercase">{word} ·</span>
          ))}
        </div>
      </div>

      {/* ═══════════ MISSION ═══════════ */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-24 md:py-32" data-testid="mission-section">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-teal-600 text-xs font-bold tracking-widest uppercase mb-4">Our Mission</p>
            <h2 className="font-serif text-foreground text-4xl md:text-5xl leading-tight mb-6">
              Training a Critical Mass of<br />Modelling Scientists<br />
              <em className="text-teal-600">in West Africa.</em>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-5">
              Our long-term goal is to train researchers who are retained within the West African region — building the next generation of modellers who work closely with National Malaria Elimination Programs and other public health bodies.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              We build scientists who are competitive in obtaining international grants and deeply networked with partners across West Africa and the globe.
            </p>
            <Link href="/about" className="group inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-500 transition-colors">
              Learn about our structure
              <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {statsData.map((stat) => (
              <div
                key={stat.label}
                className="group bg-card border border-card-border rounded-2xl p-6 hover-lift"
                data-testid={`mission-stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                  <stat.icon size={18} />
                </div>
                <p className="font-serif text-4xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ ACTIVITIES ═══════════ */}
      <section className="relative overflow-hidden" data-testid="activities-section">
        <div className="absolute inset-0 bg-[#0a0c14]" />
        <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-teal-500/6 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-24 md:py-32">
          <div className="mb-14">
            <p className="text-teal-400 text-xs font-bold tracking-widest uppercase mb-3">What We Do</p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
              <h2 className="font-serif text-white text-4xl md:text-5xl leading-tight max-w-lg">
                Our Core <em>Activities</em>
              </h2>
              <p className="text-white/40 text-sm max-w-xs leading-relaxed">
                Four pillars that drive scientific growth and collaboration at ICAMMDA.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {activities.map((act, i) => (
              <div
                key={act.title}
                className="group relative bg-white/4 hover:bg-white/7 border border-white/8 hover:border-teal-500/30 rounded-2xl p-6 transition-all duration-300 cursor-default"
                data-testid={`activity-${act.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="w-11 h-11 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-5 group-hover:bg-teal-500/20 transition-colors">
                  <act.icon size={20} />
                </div>
                <p className="text-white/30 text-xs font-mono mb-2">0{i + 1}</p>
                <h3 className="font-serif text-white text-lg mb-2">{act.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{act.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ NEWS + EVENTS ═══════════ */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-24 md:py-32">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* News — 3 cols */}
          <div className="lg:col-span-3" data-testid="recent-news-section">
            <div className="flex items-center justify-between mb-10">
              <div>
                <p className="text-teal-600 text-xs font-bold tracking-widest uppercase mb-2">Latest</p>
                <h2 className="font-serif text-foreground text-3xl">News &amp; Updates</h2>
              </div>
              <Link href="/news" className="group inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-teal-600 transition-colors" data-testid="view-all-news">
                View all <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            {postsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
              </div>
            ) : recentPosts && recentPosts.length > 0 ? (
              <div className="divide-y divide-border">
                {recentPosts.slice(0, 4).map((post, idx) => (
                  <Link key={post.id} href={`/news/${post.slug}`}>
                    <article
                      className="group py-6 flex gap-5 items-start hover:bg-muted/40 -mx-4 px-4 rounded-xl transition-colors cursor-pointer"
                      data-testid={`news-item-${post.id}`}
                    >
                      <div className="shrink-0 w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-mono text-xs font-bold border border-teal-100">
                        {String(idx + 1).padStart(2, "0")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-semibold tracking-wider uppercase text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">{post.category}</span>
                        </div>
                        <h3 className="font-serif text-foreground text-base leading-snug group-hover:text-teal-700 transition-colors" data-testid={`news-title-${post.id}`}>
                          {post.title}
                        </h3>
                        {post.excerpt && <p className="text-muted-foreground text-xs mt-1 line-clamp-1">{post.excerpt}</p>}
                        <p className="text-muted-foreground/60 text-xs mt-2">{format(new Date(post.createdAt), "MMM d, yyyy")}</p>
                      </div>
                      <ArrowUpRight size={14} className="text-muted-foreground shrink-0 group-hover:text-teal-500 mt-1 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                    </article>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground border border-dashed rounded-2xl" data-testid="no-posts-message">
                <p className="text-sm">No news published yet.</p>
              </div>
            )}
          </div>

          {/* Events — 2 cols */}
          <div className="lg:col-span-2" data-testid="upcoming-events-section">
            <div className="flex items-center justify-between mb-10">
              <div>
                <p className="text-teal-600 text-xs font-bold tracking-widest uppercase mb-2">Schedule</p>
                <h2 className="font-serif text-foreground text-3xl">Upcoming</h2>
              </div>
              <Link href="/events" className="group inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-teal-600 transition-colors" data-testid="view-all-events">
                View all <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            {eventsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
              </div>
            ) : upcomingEvents && upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <Link key={event.id} href={`/events/${event.slug}`}>
                    <div className="group relative bg-card border border-card-border hover:border-teal-200 rounded-2xl p-4 hover-lift cursor-pointer transition-colors" data-testid={`event-item-${event.id}`}>
                      <div className="flex gap-4 items-start">
                        <div className="shrink-0 w-12 h-12 rounded-xl bg-[#0a0c14] text-teal-400 flex flex-col items-center justify-center">
                          {event.startDate ? (
                            <>
                              <span className="text-[9px] font-bold tracking-wider uppercase leading-none">{format(new Date(event.startDate), "MMM")}</span>
                              <span className="text-lg font-bold leading-tight">{format(new Date(event.startDate), "d")}</span>
                            </>
                          ) : (
                            <Calendar size={16} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">{event.eventType}</span>
                          <h4 className="font-serif text-foreground text-sm leading-snug mt-0.5 group-hover:text-teal-700 transition-colors line-clamp-2" data-testid={`event-title-${event.id}`}>
                            {event.title}
                          </h4>
                          {event.location && (
                            <p className="text-muted-foreground/60 text-xs mt-1 truncate">{event.location}</p>
                          )}
                        </div>
                      </div>
                      {event.formType !== "none" && (
                        <div className="mt-3 pt-3 border-t border-border/50">
                          <span className="text-[10px] font-semibold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">Registration Open</span>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground border border-dashed rounded-2xl" data-testid="no-events-message">
                <p className="text-sm">No upcoming events.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════ PARTNERS ═══════════ */}
      {partners && partners.length > 0 && (
        <section className="border-t border-border/60 bg-muted/30" data-testid="partners-section">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16">
            <p className="text-center text-muted-foreground/50 text-xs font-semibold tracking-widest uppercase mb-10">Our Esteemed Partners &amp; Collaborating Institutions</p>
            <div className="flex flex-wrap justify-center items-center gap-3">
              {partners.map((p) => (
                <div
                  key={p.id}
                  className="group bg-card hover:bg-teal-50 border border-card-border hover:border-teal-200 rounded-xl px-5 py-3 transition-all duration-200 hover-lift"
                  data-testid={`partner-${p.id}`}
                >
                  {p.logoUrl ? (
                    <img src={p.logoUrl} alt={p.name} className="h-6 object-contain opacity-60 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <span className="text-sm font-semibold text-foreground/60 group-hover:text-teal-700 transition-colors">{p.name}</span>
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
