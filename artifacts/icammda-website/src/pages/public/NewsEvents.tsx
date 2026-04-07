import { useState } from "react";
import { Link, useSearch } from "wouter";
import { format } from "date-fns";
import { Calendar, MapPin, ArrowUpRight, Newspaper, CalendarDays } from "lucide-react";
import { useListPosts, useListEvents } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";

const POST_CATEGORIES = ["All", "News", "Recent Training", "Upcoming Training"];
const EVENT_TYPES = ["All", "Webinar", "Workshop", "Symposium", "Training", "Conference"];

const typeColor: Record<string, string> = {
  Webinar:    "bg-cyan-50 text-cyan-700",
  Workshop:   "bg-cyan-50 text-cyan-700",
  Symposium:  "bg-violet-50 text-violet-700",
  Training:   "bg-amber-50 text-amber-700",
  Conference: "bg-rose-50 text-rose-700",
};

type Tab = "all" | "news" | "events";

interface Props { defaultTab?: Tab }

export default function NewsEvents({ defaultTab = "all" }: Props) {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const tabFromUrl = (params.get("tab") as Tab | null) ?? defaultTab;

  const [tab, setTab] = useState<Tab>(tabFromUrl);
  const [activeCat, setActiveCat] = useState("All");
  const [activeType, setActiveType] = useState("All");

  const { data: posts, isLoading: postsLoading } = useListPosts({ published: true });
  const { data: events, isLoading: eventsLoading } = useListEvents({ published: true });

  const isLoading = postsLoading || eventsLoading;
  const now = new Date();

  /* ── filtered lists ── */
  const filteredPosts = (posts ?? []).filter((p) =>
    activeCat === "All" ? true : p.category === activeCat
  );
  const filteredEvents = (events ?? []).filter((e) =>
    activeType === "All" ? true : e.eventType === activeType
  );

  const upcomingEvents = filteredEvents.filter((e) => !e.startDate || new Date(e.startDate) >= now);
  const pastEvents     = filteredEvents.filter((e) =>  e.startDate && new Date(e.startDate) <  now);

  /* ── "All" tab — interleaved chronological feed ── */
  const allItems = [
    ...(posts ?? []).map((p) => ({ kind: "post" as const, date: new Date(p.createdAt), data: p })),
    ...(events ?? []).map((e) => ({ kind: "event" as const, date: e.startDate ? new Date(e.startDate) : new Date(0), data: e })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNav />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/section-bg.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07101e]/97 via-[#07101e]/92 to-[#07101e]/80" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <p className="text-cyan-400 text-xs font-bold tracking-widest uppercase mb-4">Stay Connected</p>
          <h1 className="font-serif text-white text-5xl sm:text-6xl md:text-7xl leading-tight mb-4">
            News &amp;<br /><em className="text-gradient">Events</em>
          </h1>
          <p className="text-white/40 text-lg max-w-xl">
            Research breakthroughs, training opportunities, workshops, and announcements from ICAMMDA.
          </p>
        </div>
      </section>

      {/* ═══════════ CONTENT ═══════════ */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 py-14">

        {/* ── Tab switcher ── */}
        <div className="flex items-center gap-1 bg-muted/60 border border-border/60 rounded-2xl p-1.5 w-fit mb-10" data-testid="tab-switcher">
          {(["all", "news", "events"] as Tab[]).map((t) => {
            const Icon = t === "news" ? Newspaper : t === "events" ? CalendarDays : null;
            const labels: Record<Tab, string> = { all: "All", news: "News", events: "Events" };
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                data-testid={`tab-${t}`}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  tab === t
                    ? "bg-background text-foreground shadow-sm border border-border/60"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {Icon && <Icon size={14} />}
                {labels[t]}
                {t === "all"    && !isLoading && <span className="ml-1 text-[10px] bg-muted text-muted-foreground rounded-full px-1.5 py-0.5">{allItems.length}</span>}
                {t === "news"   && !postsLoading  && <span className="ml-1 text-[10px] bg-muted text-muted-foreground rounded-full px-1.5 py-0.5">{(posts ?? []).length}</span>}
                {t === "events" && !eventsLoading && <span className="ml-1 text-[10px] bg-muted text-muted-foreground rounded-full px-1.5 py-0.5">{(events ?? []).length}</span>}
              </button>
            );
          })}
        </div>

        {/* ══════════════════════════ ALL TAB ══════════════════════════ */}
        {tab === "all" && (
          <>
            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map((i) => <Skeleton key={i} className="h-72 rounded-2xl" />)}
              </div>
            ) : allItems.length === 0 ? (
              <div className="text-center py-24 text-muted-foreground">
                <p className="font-serif text-2xl mb-2">Nothing published yet.</p>
                <p className="text-sm">Check back soon.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allItems.map((item, idx) => {
                  if (item.kind === "post") {
                    const post = item.data;
                    return (
                      <Link key={`post-${post.id}`} href={`/news/${post.slug}`}>
                        <article className="group bg-card border border-card-border rounded-2xl overflow-hidden hover-lift cursor-pointer h-full flex flex-col">
                          {post.imageUrl ? (
                            <div className="aspect-video overflow-hidden">
                              <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                          ) : (
                            <div className={`h-2 ${idx % 3 === 0 ? "bg-gradient-to-r from-cyan-400 to-cyan-500" : idx % 3 === 1 ? "bg-gradient-to-r from-cyan-500 to-cyan-600" : "bg-gradient-to-r from-cyan-600 to-cyan-400"}`} />
                          )}
                          <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-[10px] font-bold tracking-widest uppercase text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-full">{post.category}</span>
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Newspaper size={9} /> News</span>
                            </div>
                            <h2 className="font-serif text-foreground text-lg leading-snug group-hover:text-cyan-700 transition-colors mb-3 flex-1">{post.title}</h2>
                            {post.excerpt && <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>}
                            <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/60 mt-auto">
                              <span>{format(new Date(post.createdAt), "MMM d, yyyy")}</span>
                              <span className="flex items-center gap-1 text-cyan-600 font-medium">Read <ArrowUpRight size={11} /></span>
                            </div>
                          </div>
                        </article>
                      </Link>
                    );
                  } else {
                    const event = item.data;
                    return (
                      <Link key={`event-${event.id}`} href={`/events/${event.slug}`}>
                        <article className="group bg-card border border-card-border rounded-2xl overflow-hidden hover-lift cursor-pointer h-full flex flex-col">
                          {event.imageUrl ? (
                            <div className="aspect-video overflow-hidden">
                              <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                          ) : (
                            <div className="h-2 bg-gradient-to-r from-violet-400 to-violet-500" />
                          )}
                          <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 mb-3">
                              <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${typeColor[event.eventType] || "bg-cyan-50 text-cyan-700"}`}>{event.eventType}</span>
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1"><CalendarDays size={9} /> Event</span>
                            </div>
                            <h3 className="font-serif text-foreground text-lg leading-snug group-hover:text-cyan-700 transition-colors mb-3 flex-1">{event.title}</h3>
                            <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 mb-4">
                              {event.description.replace(/<[^>]+>/g, "").slice(0, 120)}
                            </p>
                            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-3 border-t border-border/60 mt-auto">
                              {event.startDate && <span className="flex items-center gap-1"><Calendar size={10} className="text-cyan-500" />{format(new Date(event.startDate), "MMM d, yyyy")}</span>}
                              {event.location  && <span className="flex items-center gap-1"><MapPin size={10} className="text-cyan-500" />{event.location}</span>}
                            </div>
                          </div>
                        </article>
                      </Link>
                    );
                  }
                })}
              </div>
            )}
          </>
        )}

        {/* ══════════════════════════ NEWS TAB ══════════════════════════ */}
        {tab === "news" && (
          <>
            {/* Category filters */}
            <div className="flex flex-wrap gap-2 mb-10" data-testid="category-filters">
              {POST_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  data-testid={`filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                    activeCat === cat
                      ? "bg-cyan-500 text-black border-cyan-500 font-semibold"
                      : "border-border text-muted-foreground hover:border-cyan-300 hover:text-cyan-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {postsLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map((i) => <Skeleton key={i} className="h-72 rounded-2xl" />)}
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-24 text-muted-foreground" data-testid="no-news-message">
                <p className="font-serif text-2xl mb-2">No posts in this category yet.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="posts-grid">
                {filteredPosts.map((post, idx) => (
                  <Link key={post.id} href={`/news/${post.slug}`}>
                    <article className="group bg-card border border-card-border rounded-2xl overflow-hidden hover-lift cursor-pointer h-full flex flex-col" data-testid={`news-card-${post.id}`}>
                      {post.imageUrl ? (
                        <div className="aspect-video overflow-hidden">
                          <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      ) : (
                        <div className={`h-2 ${idx % 3 === 0 ? "bg-gradient-to-r from-cyan-400 to-cyan-500" : idx % 3 === 1 ? "bg-gradient-to-r from-cyan-500 to-cyan-600" : "bg-gradient-to-r from-cyan-600 to-cyan-400"}`} />
                      )}
                      <div className="p-6 flex-1 flex flex-col">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-full w-fit mb-3">{post.category}</span>
                        <h2 className="font-serif text-foreground text-lg leading-snug group-hover:text-cyan-700 transition-colors mb-3 flex-1" data-testid={`news-title-${post.id}`}>{post.title}</h2>
                        {post.excerpt && <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>}
                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/60 mt-auto">
                          <span>{format(new Date(post.createdAt), "MMM d, yyyy")}</span>
                          <span className="flex items-center gap-1 text-cyan-600 font-medium" data-testid={`read-more-${post.id}`}>Read <ArrowUpRight size={11} /></span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {/* ══════════════════════════ EVENTS TAB ══════════════════════════ */}
        {tab === "events" && (
          <>
            {/* Type filters */}
            <div className="flex flex-wrap gap-2 mb-10" data-testid="event-type-filters">
              {EVENT_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveType(t)}
                  data-testid={`event-filter-${t.toLowerCase()}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                    activeType === t
                      ? "bg-cyan-500 text-black border-cyan-500 font-semibold"
                      : "border-border text-muted-foreground hover:border-cyan-300 hover:text-cyan-700"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {eventsLoading ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {[1,2,3,4].map((i) => <Skeleton key={i} className="h-60 rounded-2xl" />)}
              </div>
            ) : (
              <>
                {upcomingEvents.length > 0 && (
                  <div className="mb-14" data-testid="upcoming-events-list">
                    <div className="flex items-center gap-4 mb-6">
                      <h2 className="font-serif text-foreground text-2xl">Upcoming Events</h2>
                      <div className="flex-1 h-px bg-border/60" />
                      <span className="text-xs text-muted-foreground font-mono">{upcomingEvents.length} event{upcomingEvents.length !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      {upcomingEvents.map((event) => (
                        <Link key={event.id} href={`/events/${event.slug}`}>
                          <article className="group bg-card border border-card-border rounded-2xl overflow-hidden hover-lift cursor-pointer h-full flex flex-col" data-testid={`event-card-${event.id}`}>
                            {event.imageUrl ? (
                              <div className="aspect-video overflow-hidden">
                                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              </div>
                            ) : (
                              <div className="h-2 bg-gradient-to-r from-cyan-400 to-cyan-500" />
                            )}
                            <div className="p-6 flex-1 flex flex-col">
                              <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full w-fit mb-3 ${typeColor[event.eventType] || "bg-cyan-50 text-cyan-700"}`}>{event.eventType}</span>
                              <h3 className="font-serif text-foreground text-lg leading-snug group-hover:text-cyan-700 transition-colors mb-3 flex-1" data-testid={`event-title-${event.id}`}>{event.title}</h3>
                              <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 mb-4">
                                {event.description.replace(/<[^>]+>/g, "").slice(0, 120)}...
                              </p>
                              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-3 border-t border-border/60 mt-auto">
                                {event.startDate && <span className="flex items-center gap-1"><Calendar size={11} className="text-cyan-500" />{format(new Date(event.startDate), "MMM d, yyyy")}</span>}
                                {event.location  && <span className="flex items-center gap-1"><MapPin size={11} className="text-cyan-500" />{event.location}</span>}
                              </div>
                              {event.formType !== "none" && (
                                <div className="mt-3">
                                  <span className="text-[10px] font-semibold text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-full">Registration Open</span>
                                </div>
                              )}
                            </div>
                          </article>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {pastEvents.length > 0 && (
                  <div data-testid="past-events-list">
                    <div className="flex items-center gap-4 mb-6">
                      <h2 className="font-serif text-muted-foreground text-2xl">Past Events</h2>
                      <div className="flex-1 h-px bg-border/60" />
                      <span className="text-xs text-muted-foreground font-mono">{pastEvents.length} event{pastEvents.length !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {pastEvents.map((event) => (
                        <Link key={event.id} href={`/events/${event.slug}`}>
                          <article className="group bg-muted/40 border border-border/60 rounded-2xl p-5 hover-lift cursor-pointer" data-testid={`past-event-card-${event.id}`}>
                            <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full w-fit mb-3 block opacity-60 ${typeColor[event.eventType] || "bg-cyan-50 text-cyan-700"}`}>{event.eventType}</span>
                            <h3 className="font-serif text-foreground/70 text-sm leading-snug group-hover:text-cyan-700 transition-colors" data-testid={`past-event-title-${event.id}`}>{event.title}</h3>
                            {event.startDate && <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2"><Calendar size={10} />{format(new Date(event.startDate), "MMM d, yyyy")}</p>}
                          </article>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {filteredEvents.length === 0 && (
                  <div className="text-center py-24 text-muted-foreground" data-testid="no-events-message">
                    <p className="font-serif text-2xl mb-2">No events in this category.</p>
                    <p className="text-sm">Check back soon.</p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </section>

      <PublicFooter />
    </div>
  );
}
