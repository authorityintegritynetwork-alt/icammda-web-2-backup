import { useRoute, Link } from "wouter";
import { format } from "date-fns";
import { ArrowLeft, Calendar, MapPin, ExternalLink } from "lucide-react";
import { useListEvents } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";

interface CustomField {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea";
  required: boolean;
}

function CustomForm({ fields }: { fields: CustomField[] }) {
  return (
    <form className="space-y-4" data-testid="custom-form" onSubmit={(e) => { e.preventDefault(); alert("Form submitted! This is a demo form."); }}>
      {fields.map((field) => (
        <div key={field.name}>
          <Label htmlFor={field.name} className="mb-1 block text-sm font-medium">
            {field.label}{field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          {field.type === "textarea" ? (
            <Textarea
              id={field.name}
              name={field.name}
              required={field.required}
              className="resize-none"
              rows={4}
              data-testid={`form-field-${field.name}`}
            />
          ) : (
            <Input
              id={field.name}
              name={field.name}
              type={field.type}
              required={field.required}
              data-testid={`form-field-${field.name}`}
            />
          )}
        </div>
      ))}
      <Button type="submit" className="w-full" data-testid="custom-form-submit">
        Submit Application
      </Button>
    </form>
  );
}

export default function EventDetail() {
  const [, params] = useRoute("/events/:slug");
  const { data: events, isLoading } = useListEvents({ published: true });
  const event = events?.find((e) => e.slug === params?.slug);

  let customFields: CustomField[] = [];
  if (event?.customFormFields) {
    try { customFields = JSON.parse(event.customFormFields); } catch {}
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <PublicNav />
        <div className="max-w-4xl mx-auto px-4 py-12 w-full">
          <Skeleton className="h-8 w-24 mb-6" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-64 w-full mb-8 rounded-xl" />
        </div>
        <PublicFooter />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <PublicNav />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center text-muted-foreground" data-testid="event-not-found">
          <p className="text-lg font-medium">Event not found.</p>
          <Link href="/events" className="text-primary hover:underline mt-3 inline-block">Back to Events</Link>
        </div>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNav />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full" data-testid="event-detail">
        <Link href="/events" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors" data-testid="back-to-events">
          <ArrowLeft size={14} /> Back to Events
        </Link>

        <div className="flex items-center gap-2 mb-4">
          <Badge className="bg-primary/10 text-primary">{event.eventType}</Badge>
          {event.featured && <Badge variant="secondary">Featured</Badge>}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold font-serif text-foreground leading-tight mb-5" data-testid="event-detail-title">
          {event.title}
        </h1>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b border-border">
          {event.startDate && (
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-primary" />
              {format(new Date(event.startDate), "MMMM d, yyyy")}
              {event.endDate && ` – ${format(new Date(event.endDate), "MMMM d, yyyy")}`}
            </span>
          )}
          {event.location && (
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="text-primary" />
              {event.location}
            </span>
          )}
        </div>

        {event.imageUrl && (
          <div className="rounded-xl overflow-hidden mb-8 aspect-video">
            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" data-testid="event-detail-image" />
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: event.description }}
              data-testid="event-detail-description"
            />
          </div>

          {event.formType !== "none" && (
            <div className="lg:col-span-1" data-testid="event-registration-section">
              <div className="bg-card border border-card-border rounded-xl p-6 sticky top-20">
                <h2 className="font-bold text-lg text-foreground mb-4 font-serif">Register / Apply</h2>

                {event.formType === "google" && event.googleFormUrl ? (
                  <div data-testid="google-form-section">
                    <p className="text-sm text-muted-foreground mb-4">Complete the registration form below:</p>
                    <iframe
                      src={event.googleFormUrl}
                      width="100%"
                      height="500"
                      frameBorder="0"
                      marginHeight={0}
                      marginWidth={0}
                      title="Registration Form"
                      className="rounded-lg"
                      data-testid="google-form-iframe"
                    >
                      Loading form...
                    </iframe>
                    <a
                      href={event.googleFormUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex items-center gap-1 text-xs text-primary hover:underline"
                      data-testid="google-form-external-link"
                    >
                      Open form in new tab <ExternalLink size={11} />
                    </a>
                  </div>
                ) : event.formType === "custom" && customFields.length > 0 ? (
                  <CustomForm fields={customFields} />
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
