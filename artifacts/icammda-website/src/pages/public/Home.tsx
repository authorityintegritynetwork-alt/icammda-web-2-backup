import { Link } from "wouter";
import { ArrowUpRight, BookOpen, Users, BarChart3, Cpu, Calendar, ChevronRight, Microscope, Globe, Database, FlaskConical, ChevronDown, ExternalLink, Building2, GraduationCap, Mail, Linkedin } from "lucide-react";
import { format } from "date-fns";
import { useGetRecentPosts, useGetUpcomingEvents, useListPartners, useListLinkedinPosts } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import SEO from "@/components/SEO";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { useSiteContent } from "@/hooks/useSiteContent";
import { buildOrganizationSchema, SITE_URL } from "@/lib/seo";

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
  const c = useSiteContent();
  const { data: recentPosts, isLoading: postsLoading } = useGetRecentPosts();
  const { data: upcomingEvents, isLoading: eventsLoading } = useGetUpcomingEvents();
  const { data: partners } = useListPartners();
  const { data: linkedinPosts } = useListLinkedinPosts();

  const statsData = [
    { value: c("home.stats.researchers", "10+"), label: "Researchers", icon: Microscope },
    { value: c("home.stats.partners", "5+"), label: "Partner Institutions", icon: Globe },
    { value: c("home.stats.countries", "3+"), label: "Countries", icon: Database },
    { value: c("home.stats.events", "20+"), label: "Events & Trainings", icon: Calendar },
  ];

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ICAMMDA",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/news?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="ICAMMDA — Mathematical Modelling & Data Analytics Research Centre"
        description="ICAMMDA is the International Centre for Applied Mathematical Modelling and Data Analytics at Federal University Oye-Ekiti, Nigeria. Research, training, and partnerships in epidemiology, biostatistics, and applied mathematics across West Africa."
        canonical="/"
        jsonLd={[buildOrganizationSchema(), websiteSchema]}
      />
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
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 via-50% to-cyan-400/30 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-24 pb-20 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-400/30 bg-gradient-to-r from-violet-500/10 to-cyan-500/5 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                <span className="text-violet-300/90 text-[10px] font-semibold tracking-widest uppercase">{c("home.hero.eyebrow", "WAMCAD Member · West Africa")}</span>
              </div>

              <h1 className="font-serif text-white text-5xl sm:text-6xl lg:text-[4.5rem] leading-[0.93] tracking-tight mb-8" data-testid="hero-title">
                {c("home.hero.line1", "Where African")}<br />
                <em className="not-italic text-gradient">{c("home.hero.line2.em", "Science")}</em><br />
                {c("home.hero.line3", "Meets World‑Class")}<br />
                {c("home.hero.line4", "Analytics.")}
              </h1>

              <p className="text-white/45 text-base sm:text-lg max-w-lg leading-relaxed mb-10">
                {c("home.hero.subtitle", "International Centre for Applied Mathematical Modelling and Data Analytics — Federal University Oye-Ekiti, Nigeria. Building Africa's next generation of modelling scientists.")}
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

            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <a
          href="#mission"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/25 hover:text-white/50 transition-colors group"
          aria-label="Scroll down"
        >
          <span className="text-[9px] font-semibold tracking-widest uppercase">Explore</span>
          <div className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center group-hover:border-white/30 transition-colors animate-bounce">
            <ChevronDown size={13} />
          </div>
        </a>
      </section>

      {/* ═══════════ RESEARCH FOCUS ═══════════ */}
      <section className="border-y border-violet-100/60 bg-gradient-to-r from-violet-50/70 via-white to-cyan-50/40" data-testid="research-focus-section">
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
      <section id="mission" className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-24 md:py-28 scroll-mt-16" data-testid="mission-section">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-violet-600 text-xs font-bold tracking-widest uppercase mb-4">{c("home.mission.eyebrow", "Our Mission")}</p>
            <h2 className="font-serif text-foreground text-4xl md:text-5xl leading-tight mb-6">
              {c("home.mission.title", "Training a Critical Mass of Modelling Scientists across West Africa.")}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {c("home.mission.body1", "Our long-term goal is to train researchers who are retained within the West African region — building the next generation of modellers who work closely with National Malaria Elimination Programs and other public health institutions.")}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {c("home.mission.body2", "We build scientists who are internationally competitive, grant-ready, and deeply networked with partners across Africa and the globe.")}
            </p>
            {/* Inline stats strip */}
            <div className="grid grid-cols-4 gap-4 pt-8 border-t border-border/60 mb-8">
              {statsData.map((stat) => (
                <div key={stat.label} data-testid={`mission-stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  <p className="font-serif text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{stat.label}</p>
                </div>
              ))}
            </div>
            <Link href="/about" className="group inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 hover:text-cyan-500 transition-colors">
              Learn about our structure
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Collaboration photo with floating badges */}
          <div className="relative hidden lg:block" data-testid="mission-photo">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
              <img
                src="/team-collab.png"
                alt="ICAMMDA researchers collaborating"
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay for mood */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-transparent to-cyan-900/10" />
            </div>
            {/* Floating badge — bottom left */}
            <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl border border-border px-5 py-3.5">
              <p className="font-serif text-2xl font-bold text-foreground">{c("home.stats.researchers", "10+")}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Active Researchers</p>
            </div>
            {/* Floating badge — top right */}
            <div className="absolute -top-5 -right-5 bg-gradient-to-br from-violet-600 to-cyan-500 rounded-2xl shadow-xl px-5 py-3.5 text-white">
              <p className="font-serif text-2xl font-bold">{c("home.stats.countries", "3+")}</p>
              <p className="text-[10px] text-white/80 mt-0.5">Countries</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ COMMUNITY ═══════════ */}
      <section className="relative overflow-hidden" data-testid="community-section">
        {/* Group photo as full-bleed background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/team-group.jpg')" }}
        />
        {/* Strong left overlay so text is readable, photo breathes on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07101e]/96 via-[#07101e]/80 to-[#07101e]/40" />
        {/* Subtle purple tint on the right */}
        <div className="absolute inset-0 bg-gradient-to-l from-violet-900/30 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-28">
          <div className="max-w-lg">
            <p className="text-violet-400/80 text-[10px] font-bold tracking-widest uppercase mb-5">{c("home.community.eyebrow", "Our Community")}</p>
            <h2 className="font-serif text-white text-4xl md:text-5xl leading-tight mb-6">
              {c("home.community.title", "Growing a Continent's Scientific Capital.")}
            </h2>
            <p className="text-white/50 text-sm leading-relaxed mb-10 max-w-sm">
              {c("home.community.body", "From Federal University Oye-Ekiti to partner institutions across West Africa, our researchers are building the next generation of modelling scientists on the continent — trained, networked, and retained in Africa.")}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/team">
                <button className="group flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-200">
                  Meet the Team
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </Link>
              <Link href="/about">
                <button className="flex items-center gap-2 border border-white/15 hover:border-white/30 text-white/60 hover:text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200">
                  Our Structure
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ ACTIVITIES (dark) ═══════════ */}
      <section id="activities" className="relative overflow-hidden scroll-mt-16" data-testid="activities-section">
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
                { icon: BookOpen,  n: "01", title: c("home.activities.01.title", "Book Reading"),    desc: c("home.activities.01.desc", "Collaborative study of key texts in mathematical modelling and epidemiology."),  accent: "cyan" },
                { icon: Users,     n: "02", title: c("home.activities.02.title", "Journal Club"),     desc: c("home.activities.02.desc", "Weekly critique of cutting-edge publications across data science and global health."), accent: "violet" },
                { icon: BarChart3, n: "03", title: c("home.activities.03.title", "Progress Reports"), desc: c("home.activities.03.desc", "Regular research updates and milestone reviews across all active projects."),     accent: "violet" },
                { icon: Cpu,       n: "04", title: c("home.activities.04.title", "Software Hub"),     desc: c("home.activities.04.desc", "Hands-on mastery in R, Python, NetLogo, and simulation environments."),          accent: "cyan" },
              ].map((act) => (
                <div
                  key={act.title}
                  className={`group border rounded-2xl p-5 transition-all duration-300 ${
                    act.accent === "violet"
                      ? "bg-violet-500/5 hover:bg-violet-500/10 border-violet-500/10 hover:border-violet-500/30"
                      : "bg-cyan-500/5 hover:bg-cyan-500/10 border-white/6 hover:border-cyan-500/30"
                  }`}
                  data-testid={`activity-${act.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      act.accent === "violet" ? "bg-violet-500/15 text-violet-400" : "bg-cyan-500/10 text-cyan-400"
                    }`}>
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

      {/* ═══════════ LINKEDIN FEED ═══════════ */}
      {linkedinPosts && linkedinPosts.length > 0 && (
        <section className="border-t border-border/60 bg-gradient-to-b from-[#07101e]/3 to-transparent" data-testid="linkedin-section">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
              <div>
                <p className="text-cyan-600 text-[10px] font-bold tracking-widest uppercase mb-2">Social Media</p>
                <h2 className="font-serif text-foreground text-2xl flex items-center gap-2.5">
                  <Linkedin size={22} className="text-[#0A66C2]" />
                  Latest from LinkedIn
                </h2>
              </div>
              <a
                href="https://www.linkedin.com/company/icammda"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-[#0A66C2] hover:border-[#0A66C2]/30 hover:bg-[#0A66C2]/5 transition-all duration-200 shrink-0"
              >
                <Linkedin size={13} /> Follow us <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

            <div className={`grid gap-6 ${linkedinPosts.length === 1 ? "grid-cols-1 max-w-lg mx-auto" : linkedinPosts.length === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
              {linkedinPosts.slice(0, 3).map((post) => (
                <div key={post.id} className="flex flex-col gap-2">
                  {post.label && (
                    <p className="text-[10px] font-bold tracking-widest uppercase text-cyan-600">{post.label}</p>
                  )}
                  <div className="rounded-2xl overflow-hidden border border-border/60 bg-card shadow-sm hover:shadow-md transition-shadow duration-200">
                    <iframe
                      src={post.embedUrl}
                      title={post.label ?? "LinkedIn Post"}
                      className="w-full"
                      style={{ height: "500px", border: "none" }}
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                  <a
                    href={post.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-cyan-700 transition-colors self-start"
                  >
                    View on LinkedIn <ExternalLink size={10} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ PARTNERS ═══════════ */}
      <section className="border-t border-border/60" data-testid="partners-section">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
            <div>
              <p className="text-cyan-600 text-[10px] font-bold tracking-widest uppercase mb-2">Global Network</p>
              <h2 className="font-serif text-foreground text-2xl">Partner &amp; Collaborating Institutions</h2>
            </div>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-cyan-700 hover:border-cyan-300 hover:bg-cyan-50 transition-all duration-200 shrink-0"
            >
              <Mail size={13} /> Partner with us <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {partners && partners.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {partners.map((p) => (
                <div
                  key={p.id}
                  className="group flex flex-col items-center justify-center gap-3 bg-card border border-card-border hover:border-cyan-200 rounded-2xl p-5 text-center transition-all duration-200 hover-lift"
                  data-testid={`partner-${p.id}`}
                >
                  {p.logoUrl ? (
                    <img src={p.logoUrl} alt={p.name} className="h-8 object-contain opacity-55 group-hover:opacity-90 transition-opacity" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <Building2 size={16} className="text-muted-foreground group-hover:text-cyan-600 transition-colors" />
                    </div>
                  )}
                  <p className="text-xs font-semibold text-foreground/65 group-hover:text-cyan-700 transition-colors leading-snug">
                    {p.name}
                  </p>
                  {p.websiteUrl && (
                    <a
                      href={p.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-muted-foreground/50 flex items-center gap-0.5 hover:text-cyan-600 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Visit <ExternalLink size={9} />
                    </a>
                  )}
                </div>
              ))}

              {/* Become a partner card */}
              <Link href="/contact">
                <div className="group flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border hover:border-cyan-300 rounded-2xl p-5 text-center transition-all duration-200 cursor-pointer h-full min-h-[120px]">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
                    <GraduationCap size={16} className="text-cyan-600" />
                  </div>
                  <p className="text-xs font-semibold text-muted-foreground group-hover:text-cyan-700 transition-colors leading-snug">
                    Become a Partner
                  </p>
                </div>
              </Link>
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-border rounded-2xl">
              <Building2 size={28} className="text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-4">Partner institutions will appear here.</p>
              <Link href="/contact" className="inline-flex items-center gap-2 text-sm text-cyan-600 font-semibold hover:text-cyan-500 transition-colors">
                Get in touch <ArrowUpRight size={13} />
              </Link>
            </div>
          )}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
