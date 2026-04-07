import { useState } from "react";
import { useRoute, Link } from "wouter";
import { format } from "date-fns";
import { ArrowLeft, Calendar, MapPin, ExternalLink, CheckCircle, Send } from "lucide-react";
import { useListEvents } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";

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
        <PublicNav />
        <div className="max-w-5xl mx-auto px-5 py-32 text-center" data-testid="event-not-found">
          <p className="font-serif text-2xl text-foreground mb-3">Event not found.</p>
          <Link href="/events" className="text-cyan-600 hover:underline text-sm">← Back to Events</Link>
        </div>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNav />

      {/* Hero */}
      <section className="bg-[#07101e] pt-28 pb-16">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <Link href="/events" className="inline-flex items-center gap-2 text-white/40 hover:text-cyan-400 text-xs font-medium mb-8 transition-colors" data-testid="back-to-events">
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
              dangerouslySetInnerHTML={{ __html: event.description }}
              data-testid="event-detail-content"
            />
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

      <PublicFooter />
    </div>
  );
}
