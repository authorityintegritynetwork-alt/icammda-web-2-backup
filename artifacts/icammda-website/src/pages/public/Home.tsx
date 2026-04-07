import { Link } from "wouter";
import { ArrowUpRight, BookOpen, Users, BarChart3, Cpu, Calendar, ChevronRight, Microscope, Globe, Database, FlaskConical } from "lucide-react";
import { format } from "date-fns";
import { useGetRecentPosts, useGetUpcomingEvents, useListPartners } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";

const activities = [
  { icon: BookOpen, label: "Book Reading" },
  { icon: Users, label: "Journal Club" },
  { icon: BarChart3, label: "Progress Reports" },
  { icon: Cpu, label: "Software Hub" },
];

const statsData = [
  { value: "10+", label: "Researchers", icon: Microscope },
  { value: "5+", label: "Partner Institutions", icon: Globe },
  { value: "3+", label: "Countries", icon: Database },
  { value: "20+", label: "Events & Trainings", icon: Calendar },
];

const researchAreas = [
  "Malaria Modelling",
  "Schistosomiasis",
  "Lassa Fever",
  "Optimal Control Theory",
  "Epidemiological Dynamics",
  "Vaccine-Preventable Diseases",
  "Machine Learning in Health",
  "Spatial Analysis",
  "Data-Driven Policy",
  "West African Public Health",
];

export default function Home() {
  const { data: recentPosts, isLoading: postsLoading } = useGetRecentPosts();
  const { data: upcomingEvents, isLoading: eventsLoading } = useGetUpcomingEvents();
  const { data: partners } = useListPartners();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNav />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden min-h-screen flex items-center" data-testid="hero-section">
        {/* Full-bleed scientific background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        />
        {/* Left-strong overlay: very dark on text side, letting image breathe on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07101e]/97 via-[#07101e]/85 to-[#07101e]/45" />
        {/* Bottom fade to page bg */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#07101e] to-transparent" />
        {/* Subtle top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-24 pb-20 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/5 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-cyan-400/80 text-[10px] font-semibold tracking-widest uppercase">WAMCAD Member · West Africa</span>
              </div>

              <h1 className="font-serif text-white text-5xl sm:text-6xl lg:text-[4.5rem] leading-[0.93] tracking-tight mb-8" data-testid="hero-title">
                Where African<br />
                <em className="not-italic text-gradient">Science</em><br />
                Meets World‑Class<br />
                Analytics.
              </h1>

              <p className="text-white/45 text-base sm:text-lg max-w-lg leading-relaxed mb-10">
                International Centre for Applied Mathematical Modelling and Data Analytics — Federal University Oye-Ekiti, Nigeria. Building Africa's next generation of modelling scientists.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link href="/about">
                  <button className="group flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-[#07101e] font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-200" data-testid="hero-about-btn">
                    Discover ICAMMDA
                    <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </Link>
                <Link href="/events">
                  <button className="flex items-center gap-2 border border-white/12 hover:border-white/25 text-white/60 hover:text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200" data-testid="hero-events-btn">
                    View Events
                  </button>
                </Link>
              </div>

              {/* Stats strip */}
              <div className="grid grid-cols-4 gap-5 mt-14 pt-10 border-t border-white/8">
                {statsData.map((stat) => (
                  <div key={stat.label} className="text-center" data-testid={`hero-stat-${stat.label}`}>
                    <p className="text-white font-bold text-2xl leading-none">{stat.value}</p>
                    <p className="text-white/35 text-[10px] mt-1 leading-snug">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side — logo + floating elements */}
            <div className="hidden lg:flex flex-col items-center justify-center relative">
              {/* Main logo — large and proud */}
              <div className="relative w-72 h-72 animate-float">
                <div className="absolute inset-0 rounded-full bg-cyan-500/8 blur-3xl" />
                <img
                  src="/icammda-logo-circle.png"
                  alt="ICAMMDA Logo"
                  className="relative w-full h-full object-contain drop-shadow-[0_0_60px_rgba(34,211,238,0.15)]"
                />
              </div>

              {/* Floating activity badges */}
              <div className="absolute top-0 -left-6 space-y-2.5">
                {activities.map((act, i) => (
                  <div
                    key={act.label}
                    className="glass-dark rounded-xl px-4 py-2.5 flex items-center gap-3 border border-white/6"
                    style={{ animationDelay: `${i * 0.4}s` }}
                  >
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center shrink-0">
                      <act.icon size={13} className="text-cyan-400" />
                    </div>
                    <span className="text-white/60 text-xs font-medium">{act.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ RESEARCH FOCUS ═══════════ */}
      <section className="border-y border-border/60 bg-white" data-testid="research-focus-section">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
            <div className="flex items-center gap-2.5 shrink-0">
              <FlaskConical size={15} className="text-cyan-600" />
              <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Research Focus</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {researchAreas.map((area) => (
                <span
                  key={area}
                  className="text-xs font-medium text-foreground/70 bg-muted/60 hover:bg-cyan-50 hover:text-cyan-700 border border-border/60 hover:border-cyan-200 px-3 py-1.5 rounded-full transition-all duration-200 cursor-default"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ MISSION ═══════════ */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-24 md:py-28" data-testid="mission-section">
        <div className="grid lg:grid-cols-5 gap-16 items-center">
          <div className="lg:col-span-3">
            <p className="text-cyan-600 text-xs font-bold tracking-widest uppercase mb-4">Our Mission</p>
            <h2 className="font-serif text-foreground text-4xl md:text-5xl leading-tight mb-6">
              Training a Critical Mass<br />
              of Modelling Scientists<br />
              <em className="text-cyan-600">across West Africa.</em>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our long-term goal is to train researchers who are retained within the West African region — building the next generation of modellers who work closely with National Malaria Elimination Programs and other public health institutions.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              We build scientists who are internationally competitive, grant-ready, and deeply networked with partners across Africa and the globe.
            </p>
            <Link href="/about" className="group inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 hover:text-cyan-500 transition-colors">
              Learn about our structure
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Stats grid */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            {statsData.map((stat) => (
              <div
                key={stat.label}
                className="group bg-card border border-card-border rounded-2xl p-6 hover-lift"
                data-testid={`mission-stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4 group-hover:bg-cyan-100 transition-colors">
                  <stat.icon size={18} />
                </div>
                <p className="font-serif text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ ACTIVITIES (dark) ═══════════ */}
      <section className="relative overflow-hidden" data-testid="activities-section">
        {/* Africa epidemiological network background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/section-bg.png')" }}
        />
        {/* Strong dark overlay — image visible but subdued */}
        <div className="absolute inset-0 bg-[#07101e]/88" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-24 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-cyan-400/70 text-xs font-bold tracking-widest uppercase mb-4">What We Do</p>
              <h2 className="font-serif text-white text-4xl md:text-5xl leading-tight mb-5">
                Four Core<br /><em className="text-gradient">Activities</em>
              </h2>
              <p className="text-white/40 text-sm leading-relaxed max-w-sm">
                Structured programmes that drive scientific growth, collaboration, and technical excellence at ICAMMDA.
              </p>
              <Link href="/about" className="group inline-flex items-center gap-2 text-sm font-medium text-cyan-400/70 hover:text-cyan-400 transition-colors mt-6">
                Our Full Structure <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: BookOpen, n: "01", title: "Book Reading", desc: "Collaborative study of key texts in mathematical modelling and epidemiology." },
                { icon: Users, n: "02", title: "Journal Club", desc: "Weekly critique of cutting-edge publications across data science and global health." },
                { icon: BarChart3, n: "03", title: "Progress Reports", desc: "Regular research updates and milestone reviews across all active projects." },
                { icon: Cpu, n: "04", title: "Software Hub", desc: "Hands-on mastery in R, Python, NetLogo, and simulation environments." },
              ].map((act) => (
                <div
                  key={act.title}
                  className="group bg-white/3 hover:bg-white/6 border border-white/6 hover:border-cyan-500/20 rounded-2xl p-5 transition-all duration-300"
                  data-testid={`activity-${act.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                      <act.icon size={16} />
                    </div>
                    <span className="text-white/20 font-mono text-xs">{act.n}</span>
                  </div>
                  <h3 className="font-serif text-white text-sm mb-1.5">{act.title}</h3>
                  <p className="text-white/35 text-xs leading-relaxed">{act.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ NEWS + EVENTS ═══════════ */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-24 md:py-28">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* News — 3 cols */}
          <div className="lg:col-span-3" data-testid="recent-news-section">
            <div className="flex items-center justify-between mb-10">
              <div>
                <p className="text-cyan-600 text-xs font-bold tracking-widest uppercase mb-2">Latest</p>
                <h2 className="font-serif text-foreground text-3xl">News &amp; Updates</h2>
              </div>
              <Link href="/news" className="group inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-cyan-600 transition-colors" data-testid="view-all-news">
                View all <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            {postsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
              </div>
            ) : recentPosts && recentPosts.length > 0 ? (
              <div className="divide-y divide-border">
                {recentPosts.slice(0, 4).map((post, idx) => (
                  <Link key={post.id} href={`/news/${post.slug}`}>
                    <article
                      className="group py-5 flex gap-5 items-start hover:bg-muted/30 -mx-4 px-4 rounded-xl transition-colors cursor-pointer"
                      data-testid={`news-item-${post.id}`}
                    >
                      <div className="shrink-0 w-9 h-9 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center font-mono text-[10px] font-bold border border-cyan-100">
                        {String(idx + 1).padStart(2, "0")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-bold tracking-wider uppercase text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full">{post.category}</span>
                        </div>
                        <h3 className="font-serif text-foreground text-sm leading-snug group-hover:text-cyan-700 transition-colors" data-testid={`news-title-${post.id}`}>
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground/60 text-[10px] mt-1.5">{format(new Date(post.createdAt), "MMM d, yyyy")}</p>
                      </div>
                      <ArrowUpRight size={13} className="text-muted-foreground shrink-0 group-hover:text-cyan-500 mt-0.5 opacity-0 group-hover:opacity-100 transition-all" />
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
                <p className="text-cyan-600 text-xs font-bold tracking-widest uppercase mb-2">Schedule</p>
                <h2 className="font-serif text-foreground text-3xl">Upcoming</h2>
              </div>
              <Link href="/events" className="group inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-cyan-600 transition-colors" data-testid="view-all-events">
                View all <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            {eventsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
              </div>
            ) : upcomingEvents && upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <Link key={event.id} href={`/events/${event.slug}`}>
                    <div className="group bg-card border border-card-border hover:border-cyan-200 rounded-2xl p-4 hover-lift cursor-pointer transition-colors" data-testid={`event-item-${event.id}`}>
                      <div className="flex gap-4 items-start">
                        <div className="shrink-0 w-12 h-12 rounded-xl bg-[#07101e] text-cyan-400 flex flex-col items-center justify-center">
                          {event.startDate ? (
                            <>
                              <span className="text-[8px] font-bold tracking-wider uppercase leading-none">{format(new Date(event.startDate), "MMM")}</span>
                              <span className="text-lg font-bold leading-tight">{format(new Date(event.startDate), "d")}</span>
                            </>
                          ) : (
                            <Calendar size={16} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-cyan-600">{event.eventType}</span>
                          <h4 className="font-serif text-foreground text-sm leading-snug mt-0.5 group-hover:text-cyan-700 transition-colors line-clamp-2" data-testid={`event-title-${event.id}`}>
                            {event.title}
                          </h4>
                          {event.location && (
                            <p className="text-muted-foreground/50 text-[10px] mt-1 truncate">{event.location}</p>
                          )}
                        </div>
                      </div>
                      {event.formType !== "none" && (
                        <div className="mt-3 pt-3 border-t border-border/50">
                          <span className="text-[9px] font-semibold text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-full">Registration Open</span>
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
        <section className="border-t border-border/60 bg-muted/20" data-testid="partners-section">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-14">
            <p className="text-center text-muted-foreground/40 text-[10px] font-bold tracking-widest uppercase mb-9">Partner &amp; Collaborating Institutions</p>
            <div className="flex flex-wrap justify-center items-center gap-2.5">
              {partners.map((p) => (
                <div
                  key={p.id}
                  className="group bg-white hover:bg-cyan-50 border border-border/60 hover:border-cyan-200 rounded-xl px-5 py-2.5 transition-all duration-200 hover-lift"
                  data-testid={`partner-${p.id}`}
                >
                  {p.logoUrl ? (
                    <img src={p.logoUrl} alt={p.name} className="h-5 object-contain opacity-55 group-hover:opacity-90 transition-opacity" />
                  ) : (
                    <span className="text-xs font-semibold text-foreground/55 group-hover:text-cyan-700 transition-colors">{p.name}</span>
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
