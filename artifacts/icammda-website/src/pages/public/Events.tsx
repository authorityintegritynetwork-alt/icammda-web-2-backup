import { useState } from "react";
import { Link } from "wouter";
import { format } from "date-fns";
import { Calendar, MapPin, ArrowUpRight } from "lucide-react";
import { useListEvents } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";

const TYPES = ["All", "Webinar", "Workshop", "Symposium", "Training", "Conference"];

const typeColor: Record<string, string> = {
  Webinar: "bg-cyan-50 text-cyan-700",
  Workshop: "bg-teal-50 text-teal-700",
  Symposium: "bg-violet-50 text-violet-700",
  Training: "bg-amber-50 text-amber-700",
  Conference: "bg-rose-50 text-rose-700",
};

export default function Events() {
  const [activeType, setActiveType] = useState("All");
  const { data: events, isLoading } = useListEvents({ published: true });

  const filtered = events?.filter((e) =>
    activeType === "All" ? true : e.eventType === activeType
  ) ?? [];

  const now = new Date();
  const upcoming = filtered.filter((e) => !e.startDate || new Date(e.startDate) >= now);
  const past = filtered.filter((e) => e.startDate && new Date(e.startDate) < now);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNav />

      {/* Hero */}
      <section className="relative bg-[#0a0c14] overflow-hidden pt-32 pb-20">
        <div className="absolute top-0 right-1/3 w-[500px] h-[250px] bg-teal-500/8 rounded-full blur-[120px] pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }}
        />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <p className="text-teal-400 text-xs font-bold tracking-widest uppercase mb-4">Programs</p>
          <h1 className="font-serif text-white text-5xl sm:text-6xl md:text-7xl leading-tight mb-4" data-testid="events-page-title">
            Events &amp;<br /><em className="text-gradient">Programs</em>
          </h1>
          <p className="text-white/40 text-lg max-w-xl">
            Workshops, webinars, symposia, and training opportunities from ICAMMDA.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 py-16">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-12" data-testid="event-type-filters">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                activeType === t
                  ? "bg-teal-500 text-black border-teal-500 font-semibold"
                  : "border-border text-muted-foreground hover:border-teal-300 hover:text-teal-700"
              }`}
              data-testid={`event-filter-${t.toLowerCase()}`}
            >
              {t}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-60 rounded-2xl" />)}
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <div className="mb-14" data-testid="upcoming-events-list">
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-serif text-foreground text-2xl">Upcoming Events</h2>
                  <div className="flex-1 h-px bg-border/60" />
                  <span className="text-xs text-muted-foreground font-mono">{upcoming.length} event{upcoming.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  {upcoming.map((event) => (
                    <Link key={event.id} href={`/events/${event.slug}`}>
                      <article className="group bg-card border border-card-border rounded-2xl overflow-hidden hover-lift cursor-pointer h-full flex flex-col" data-testid={`event-card-${event.id}`}>
                        {event.imageUrl ? (
                          <div className="aspect-video overflow-hidden">
                            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                        ) : (
                          <div className="h-2 bg-gradient-to-r from-teal-400 to-cyan-500" />
                        )}
                        <div className="p-6 flex-1 flex flex-col">
                          <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full w-fit mb-3 ${typeColor[event.eventType] || "bg-teal-50 text-teal-700"}`}>
                            {event.eventType}
                          </span>
                          <h3 className="font-serif text-foreground text-lg leading-snug group-hover:text-teal-700 transition-colors mb-3 flex-1" data-testid={`event-title-${event.id}`}>
                            {event.title}
                          </h3>
                          <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 mb-4">
                            {event.description.replace(/<[^>]+>/g, "").slice(0, 120)}...
                          </p>
                          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-3 border-t border-border/60 mt-auto">
                            {event.startDate && (
                              <span className="flex items-center gap-1">
                                <Calendar size={11} className="text-teal-500" />
                                {format(new Date(event.startDate), "MMM d, yyyy")}
                              </span>
                            )}
                            {event.location && (
                              <span className="flex items-center gap-1">
                                <MapPin size={11} className="text-teal-500" />
                                {event.location}
                              </span>
                            )}
                          </div>
                          {event.formType !== "none" && (
                            <div className="mt-3">
                              <span className="text-[10px] font-semibold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">Registration Open</span>
                            </div>
                          )}
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {past.length > 0 && (
              <div data-testid="past-events-list">
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-serif text-muted-foreground text-2xl">Past Events</h2>
                  <div className="flex-1 h-px bg-border/60" />
                  <span className="text-xs text-muted-foreground font-mono">{past.length} event{past.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {past.map((event) => (
                    <Link key={event.id} href={`/events/${event.slug}`}>
                      <article className="group bg-muted/40 border border-border/60 rounded-2xl p-5 hover-lift cursor-pointer" data-testid={`past-event-card-${event.id}`}>
                        <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full w-fit mb-3 block opacity-60 ${typeColor[event.eventType] || "bg-teal-50 text-teal-700"}`}>
                          {event.eventType}
                        </span>
                        <h3 className="font-serif text-foreground/70 text-sm leading-snug group-hover:text-teal-700 transition-colors" data-testid={`past-event-title-${event.id}`}>
                          {event.title}
                        </h3>
                        {event.startDate && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                            <Calendar size={10} /> {format(new Date(event.startDate), "MMM d, yyyy")}
                          </p>
                        )}
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {filtered.length === 0 && (
              <div className="text-center py-24 text-muted-foreground" data-testid="no-events-message">
                <p className="font-serif text-2xl mb-2">No events in this category.</p>
                <p className="text-sm">Check back soon.</p>
              </div>
            )}
          </>
        )}
      </section>

      <PublicFooter />
    </div>
  );
}
