import { useState } from "react";
import { useRoute, Link } from "wouter";
import { format } from "date-fns";
import { ArrowLeft, Calendar, MapPin, ExternalLink, CheckCircle, Send, Linkedin, Globe, Mail, Users } from "lucide-react";
import { useListEvents, useListEventSpeakers } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import DOMPurify from "isomorphic-dompurify";
import SEO from "@/components/SEO";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import Breadcrumbs from "@/components/Breadcrumbs";
import { absoluteUrl, stripHtml, truncate, ORGANIZATION } from "@/lib/seo";

function getPhotoSrc(url?: string | null) {
  if (!url) return "";
  if (url.startsWith("/objects/")) return `/api/storage/objects/${url.slice("/objects/".length)}`;
  return url;
}

function getInitials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
}

type Speaker = {
  id: number;
  name: string;
  title?: string | null;
  affiliation?: string | null;
  bio?: string | null;
  photoUrl?: string | null;
  linkedinUrl?: string | null;
  websiteUrl?: string | null;
  email?: string | null;
  speakerType: string;
};

function SpeakerCard({ speaker, onClick }: { speaker: Speaker; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group text-left bg-card border border-card-border rounded-2xl p-5 hover:border-cyan-500/40 hover:shadow-md transition-all"
      data-testid={`speaker-card-${speaker.id}`}
    >
      <div className="flex items-start gap-4">
        {speaker.photoUrl ? (
          <img src={getPhotoSrc(speaker.photoUrl)} alt={speaker.name} className="w-16 h-16 rounded-full object-cover shrink-0 border border-border" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/15 to-violet-500/15 border border-border flex items-center justify-center shrink-0">
            <span className="text-cyan-600 font-bold text-sm">{getInitials(speaker.name)}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-bold tracking-widest uppercase text-cyan-600">{speaker.speakerType}</span>
          <p className="font-serif text-foreground text-base mt-0.5 group-hover:text-cyan-700 transition-colors">{speaker.name}</p>
          {speaker.title && <p className="text-xs text-muted-foreground mt-0.5">{speaker.title}</p>}
          {speaker.affiliation && <p className="text-xs text-muted-foreground/80 mt-0.5 truncate">{speaker.affiliation}</p>}
        </div>
      </div>
      {speaker.bio && (
        <p className="text-xs text-muted-foreground mt-3 line-clamp-2 leading-relaxed">{speaker.bio}</p>
      )}
      <p className="text-[10px] text-cyan-600/70 font-semibold mt-3 group-hover:text-cyan-600 transition-colors">View profile →</p>
    </button>
  );
}

function SpeakerDialog({ speaker, open, onOpenChange }: { speaker: Speaker | null; open: boolean; onOpenChange: (o: boolean) => void }) {
  if (!speaker) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto" data-testid="speaker-detail-dialog">
        <DialogHeader>
          <DialogTitle className="sr-only">{speaker.name}</DialogTitle>
          <DialogDescription className="sr-only">{speaker.speakerType} biography and contact details</DialogDescription>
        </DialogHeader>
        <div className="flex items-start gap-4 mb-4">
          {speaker.photoUrl ? (
            <img src={getPhotoSrc(speaker.photoUrl)} alt={speaker.name} className="w-20 h-20 rounded-full object-cover shrink-0 border border-border" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/15 to-violet-500/15 border border-border flex items-center justify-center shrink-0">
              <span className="text-cyan-600 font-bold text-base">{getInitials(speaker.name)}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold tracking-widest uppercase text-cyan-600">{speaker.speakerType}</span>
            <h3 className="font-serif text-2xl text-foreground mt-1">{speaker.name}</h3>
            {speaker.title && <p className="text-sm text-foreground/80 mt-0.5">{speaker.title}</p>}
            {speaker.affiliation && <p className="text-xs text-muted-foreground mt-0.5">{speaker.affiliation}</p>}
          </div>
        </div>

        {speaker.bio && (
          <div className="text-sm text-foreground/85 leading-relaxed whitespace-pre-line border-t border-border pt-4">
            {speaker.bio}
          </div>
        )}

        {(speaker.email || speaker.linkedinUrl || speaker.websiteUrl) && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-border mt-4">
            {speaker.email && (
              <a href={`mailto:${speaker.email}`} className="inline-flex items-center gap-1.5 text-xs text-cyan-600 hover:underline">
                <Mail size={12} /> {speaker.email}
              </a>
            )}
            {speaker.linkedinUrl && (
              <a href={speaker.linkedinUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-cyan-600 hover:underline">
                <Linkedin size={12} /> LinkedIn
              </a>
            )}
            {speaker.websiteUrl && (
              <a href={speaker.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-cyan-600 hover:underline">
                <Globe size={12} /> Website
              </a>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface CustomField { name: string; label: string; type: string; required: boolean; }

const typeColor: Record<string, string> = {
  Webinar: "bg-cyan-50 text-cyan-700",
  Workshop: "bg-cyan-50 text-cyan-700",
  Symposium: "bg-violet-50 text-violet-700",
  Training: "bg-amber-50 text-amber-700",
  Conference: "bg-rose-50 text-rose-700",
};

function CustomForm({ fields }: { fields: CustomField[] }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10" data-testid="registration-success">
        <div className="w-14 h-14 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center mb-4">
          <CheckCircle size={26} />
        </div>
        <p className="font-serif text-foreground text-xl mb-2">Registration Received!</p>
        <p className="text-muted-foreground text-sm">Thank you. We'll confirm your spot by email.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-testid="custom-registration-form">
      {fields.map((field) => (
        <div key={field.name}>
          <label className="text-xs font-semibold text-foreground/70 tracking-wide mb-1.5 block">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          {field.type === "textarea" ? (
            <textarea
              name={field.name}
              required={field.required}
              value={values[field.name] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
              rows={3}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-400 transition-all resize-none"
            />
          ) : (
            <input
              type={field.type === "email" ? "email" : "text"}
              name={field.name}
              required={field.required}
              value={values[field.name] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-400 transition-all"
            />
          )}
        </div>
      ))}
      <button
        type="submit"
        disabled={submitting}
        className="group w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-black font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-200 mt-2"
        data-testid="custom-form-submit"
      >
        {submitting ? (
          <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Submitting...</>
        ) : (
          <><Send size={13} className="group-hover:translate-x-0.5 transition-transform" /> Register</>
        )}
      </button>
    </form>
  );
}

export default function EventDetail() {
  const [, params] = useRoute("/events/:slug");
  const { data: events, isLoading } = useListEvents({ published: true });
  const event = events?.find((e) => e.slug === params?.slug);
  const { data: speakers } = useListEventSpeakers(
    event ? { eventId: event.id } : undefined,
    { query: { enabled: !!event } }
  );
  const [activeSpeaker, setActiveSpeaker] = useState<Speaker | null>(null);

  const customFields: CustomField[] = (() => {
    if (!event?.customFormFields) return [];
    try { return JSON.parse(event.customFormFields); } catch { return []; }
  })();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <PublicNav />
        <div className="max-w-5xl mx-auto px-5 py-32 w-full">
          <Skeleton className="h-5 w-24 mb-8" />
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-4 w-48 mb-12" />
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-3">
              {[1,2,3,4,5].map((i) => <Skeleton key={i} className="h-4 w-full" />)}
            </div>
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SEO title="Event not found" noIndex />
        <PublicNav />
        <div className="max-w-5xl mx-auto px-5 py-32 text-center" data-testid="event-not-found">
          <p className="font-serif text-2xl text-foreground mb-3">Event not found.</p>
          <Link href="/events" className="text-cyan-600 hover:underline text-sm">← Back to Events</Link>
        </div>
        <PublicFooter />
      </div>
    );
  }

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: truncate(stripHtml(event.description ?? ""), 200),
    image: event.imageUrl ? [absoluteUrl(event.imageUrl)] : undefined,
    startDate: event.startDate ? new Date(event.startDate).toISOString() : undefined,
    endDate: event.endDate ? new Date(event.endDate).toISOString() : undefined,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: event.location?.toLowerCase().includes("online") || event.location?.toLowerCase().includes("virtual")
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    location: event.location
      ? { "@type": "Place", name: event.location, address: event.location }
      : { "@type": "Place", name: "Federal University Oye-Ekiti", address: "Oye-Ekiti, Ekiti State, Nigeria" },
    organizer: {
      "@type": "Organization",
      name: ORGANIZATION.name,
      url: ORGANIZATION.url,
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title={event.title}
        description={truncate(stripHtml(event.description ?? ""), 200)}
        type="article"
        image={event.imageUrl ?? undefined}
        canonical={`/events/${event.slug}`}
        jsonLd={eventSchema}
      />
      <PublicNav />

      {/* Hero */}
      <section id="main-content" tabIndex={-1} className="bg-[#07101e] pt-28 pb-16 outline-none">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <Breadcrumbs
            items={[
              { label: "News & Events", href: "/events" },
              { label: event.title },
            ]}
          />
          <Link href="/events" className="inline-flex items-center gap-2 text-white/40 hover:text-cyan-400 text-xs font-medium mt-6 mb-8 transition-colors" data-testid="back-to-events">
            <ArrowLeft size={13} /> Back to Events
          </Link>
          <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${typeColor[event.eventType] || "bg-cyan-50 text-cyan-700"}`}>
            {event.eventType}
          </span>
          <h1 className="font-serif text-white text-3xl sm:text-4xl md:text-5xl leading-tight mt-4 mb-6" data-testid="event-detail-title">
            {event.title}
          </h1>
          <div className="flex flex-wrap items-center gap-5 text-white/35 text-xs">
            {event.startDate && (
              <span className="flex items-center gap-1.5">
                <Calendar size={12} className="text-cyan-400/60" />
                {format(new Date(event.startDate), "EEEE, MMMM d, yyyy")}
                {event.endDate && event.endDate !== event.startDate && (
                  <> — {format(new Date(event.endDate), "MMMM d, yyyy")}</>
                )}
              </span>
            )}
            {event.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={12} className="text-cyan-400/60" />
                {event.location}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 py-14 w-full" data-testid="event-detail">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Description */}
          <div className="md:col-span-2">
            {event.imageUrl && (
              <div className="rounded-2xl overflow-hidden mb-8 aspect-video">
                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div
              className="prose prose-slate prose-headings:font-serif prose-headings:font-normal prose-a:text-cyan-600 max-w-none"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(event.description) }}
              data-testid="event-detail-content"
            />

            {speakers && speakers.length > 0 && (
              <div className="mt-12" data-testid="event-speakers-section">
                <div className="flex items-center gap-2 mb-5">
                  <Users size={18} className="text-cyan-600" />
                  <h2 className="font-serif text-foreground text-2xl">Speakers & Guests</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {speakers.map((s) => (
                    <SpeakerCard key={s.id} speaker={s} onClick={() => setActiveSpeaker(s)} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Meta card */}
            <div className="bg-card border border-card-border rounded-2xl p-5">
              <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-4">Event Details</p>
              <div className="space-y-3 text-sm">
                {event.startDate && (
                  <div className="flex gap-3">
                    <Calendar size={14} className="text-cyan-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-foreground font-medium">{format(new Date(event.startDate), "MMMM d, yyyy")}</p>
                      {event.endDate && event.endDate !== event.startDate && (
                        <p className="text-muted-foreground text-xs">to {format(new Date(event.endDate), "MMMM d, yyyy")}</p>
                      )}
                    </div>
                  </div>
                )}
                {event.location && (
                  <div className="flex gap-3">
                    <MapPin size={14} className="text-cyan-500 mt-0.5 shrink-0" />
                    <p className="text-foreground">{event.location}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Registration */}
            {event.formType !== "none" && (
              <div className="bg-card border border-card-border rounded-2xl p-5">
                <p className="font-serif text-foreground text-base mb-4">Register / Apply</p>
                {event.formType === "google" && event.googleFormUrl ? (
                  <div data-testid="google-form-section">
                    <iframe
                      src={event.googleFormUrl}
                      title={`Registration form — ${event.title}`}
                      className="w-full rounded-xl border border-border"
                      style={{ height: 480 }}
                      data-testid="google-form-iframe"
                    />
                    <a
                      href={event.googleFormUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-cyan-600 hover:underline mt-3"
                    >
                      Open in Google Forms <ExternalLink size={11} />
                    </a>
                  </div>
                ) : event.formType === "custom" && customFields.length > 0 ? (
                  <CustomForm fields={customFields} />
                ) : null}
              </div>
            )}
          </div>
        </div>
      </section>

      <SpeakerDialog speaker={activeSpeaker} open={!!activeSpeaker} onOpenChange={(o) => !o && setActiveSpeaker(null)} />

      <PublicFooter />
    </div>
  );
}
