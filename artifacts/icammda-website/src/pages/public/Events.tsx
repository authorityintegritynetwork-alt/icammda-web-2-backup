import { useState } from "react";
import { Link } from "wouter";
import { format } from "date-fns";
import { Calendar, MapPin } from "lucide-react";
import { useListEvents } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";

const TYPES = ["All", "Webinar", "Workshop", "Symposium", "Training", "Conference"];

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

      <section className="bg-[hsl(222,47%,11%)] text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Programs</p>
          <h1 className="text-4xl font-bold font-serif mb-3" data-testid="events-page-title">Events &amp; Programs</h1>
          <p className="text-slate-300">Workshops, webinars, symposia, and training opportunities from ICAMMDA.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-wrap gap-2 mb-8" data-testid="event-type-filters">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                activeType === t
                  ? "bg-primary text-white border-primary"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
              data-testid={`event-filter-${t.toLowerCase()}`}
            >
              {t}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-52 rounded-xl" />)}
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <div className="mb-10" data-testid="upcoming-events-list">
                <h2 className="text-xl font-bold font-serif text-foreground mb-4">Upcoming Events</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  {upcoming.map((event) => (
                    <Link key={event.id} href={`/events/${event.slug}`}>
                      <article className="group bg-card border border-card-border rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer" data-testid={`event-card-${event.id}`}>
                        {event.imageUrl && (
                          <div className="aspect-video overflow-hidden">
                            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          </div>
                        )}
                        <div className="p-5">
                          <Badge className="mb-2 bg-primary/10 text-primary text-xs">{event.eventType}</Badge>
                          <h3 className="font-semibold text-foreground leading-snug group-hover:text-primary transition-colors mb-2" data-testid={`event-title-${event.id}`}>
                            {event.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{event.description.replace(/<[^>]+>/g, "").slice(0, 120)}...</p>
                          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                            {event.startDate && (
                              <span className="flex items-center gap-1">
                                <Calendar size={12} className="text-primary" />
                                {format(new Date(event.startDate), "MMM d, yyyy")}
                              </span>
                            )}
                            {event.location && (
                              <span className="flex items-center gap-1">
                                <MapPin size={12} className="text-primary" />
                                {event.location}
                              </span>
                            )}
                          </div>
                          {event.formType !== "none" && (
                            <div className="mt-3">
                              <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">Registration Open</span>
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
                <h2 className="text-xl font-bold font-serif text-foreground mb-4 text-muted-foreground">Past Events</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {past.map((event) => (
                    <Link key={event.id} href={`/events/${event.slug}`}>
                      <article className="group bg-card border border-card-border rounded-xl p-5 hover:shadow-sm transition-shadow cursor-pointer opacity-80 hover:opacity-100" data-testid={`past-event-card-${event.id}`}>
                        <Badge variant="secondary" className="mb-2 text-xs">{event.eventType}</Badge>
                        <h3 className="font-medium text-foreground leading-snug group-hover:text-primary transition-colors mb-1" data-testid={`past-event-title-${event.id}`}>
                          {event.title}
                        </h3>
                        {event.startDate && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar size={11} /> {format(new Date(event.startDate), "MMM d, yyyy")}
                          </p>
                        )}
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {filtered.length === 0 && (
              <div className="text-center py-20 text-muted-foreground" data-testid="no-events-message">
                <Calendar size={48} className="mx-auto mb-3 opacity-20" />
                <p className="text-lg font-medium">No events in this category yet.</p>
              </div>
            )}
          </>
        )}
      </section>

      <PublicFooter />
    </div>
  );
}
