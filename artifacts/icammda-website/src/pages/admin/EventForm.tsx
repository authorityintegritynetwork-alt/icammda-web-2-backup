import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import {
  useListEvents,
  useCreateEvent,
  useUpdateEvent,
  getListEventsQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";

const EVENT_TYPES = ["Webinar", "Workshop", "Symposium", "Training", "Conference"];

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const DEFAULT_CUSTOM_FIELDS = JSON.stringify([
  { name: "fullName", label: "Full Name", type: "text", required: true },
  { name: "email", label: "Email Address", type: "email", required: true },
  { name: "institution", label: "Institution/Organisation", type: "text", required: false },
], null, 2);

export default function EventForm() {
  const [, params] = useRoute("/admin/events/:id/edit");
  const [, navigate] = useLocation();
  const isEdit = !!params?.id;
  const eventId = params?.id ? parseInt(params.id, 10) : undefined;

  const { data: events, isLoading: eventsLoading } = useListEvents();
  const existing = events?.find((e) => e.id === eventId);

  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    eventType: "Workshop",
    location: "",
    startDate: "",
    endDate: "",
    imageUrl: "",
    formType: "none" as "none" | "google" | "custom",
    googleFormUrl: "",
    customFormFields: DEFAULT_CUSTOM_FIELDS,
    published: false,
    featured: false,
  });

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title,
        slug: existing.slug,
        description: existing.description,
        eventType: existing.eventType,
        location: existing.location ?? "",
        startDate: existing.startDate ? existing.startDate.split("T")[0] : "",
        endDate: existing.endDate ? existing.endDate.split("T")[0] : "",
        imageUrl: existing.imageUrl ?? "",
        formType: (existing.formType ?? "none") as "none" | "google" | "custom",
        googleFormUrl: existing.googleFormUrl ?? "",
        customFormFields: existing.customFormFields ?? DEFAULT_CUSTOM_FIELDS,
        published: existing.published,
        featured: existing.featured,
      });
    }
  }, [existing]);

  const handleTitleChange = (title: string) => {
    setForm((f) => ({ ...f, title, slug: isEdit ? f.slug : slugify(title) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      slug: form.slug,
      description: form.description,
      eventType: form.eventType,
      location: form.location || undefined,
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
      imageUrl: form.imageUrl || undefined,
      formType: form.formType,
      googleFormUrl: form.formType === "google" ? (form.googleFormUrl || undefined) : undefined,
      customFormFields: form.formType === "custom" ? (form.customFormFields || undefined) : undefined,
      published: form.published,
      featured: form.featured,
    };

    if (isEdit && eventId) {
      await updateEvent.mutateAsync({ id: eventId, ...payload });
    } else {
      await createEvent.mutateAsync(payload);
    }
    queryClient.invalidateQueries({ queryKey: getListEventsQueryKey() });
    navigate("/admin/events");
  };

  const saving = createEvent.isPending || updateEvent.isPending;

  if (isEdit && eventsLoading) {
    return (
      <AdminLayout title={isEdit ? "Edit Event" : "New Event"}>
        <div className="space-y-4 max-w-2xl">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-12 rounded-lg" />)}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEdit ? "Edit Event" : "New Event"}>
      <div className="max-w-2xl" data-testid="event-form">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/admin/events")} className="text-sm text-muted-foreground hover:text-foreground">← Events</button>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">{isEdit ? "Edit Event" : "New Event"}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-card border border-card-border rounded-xl p-6">
          <div>
            <Label htmlFor="title" className="mb-1.5 block">Title <span className="text-destructive">*</span></Label>
            <Input
              id="title"
              required
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Event title"
              data-testid="event-title-input"
            />
          </div>

          <div>
            <Label htmlFor="slug" className="mb-1.5 block">Slug <span className="text-destructive">*</span></Label>
            <Input
              id="slug"
              required
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
              data-testid="event-slug-input"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="mb-1.5 block">Event Type <span className="text-destructive">*</span></Label>
              <Select value={form.eventType} onValueChange={(v) => setForm((f) => ({ ...f, eventType: v }))}>
                <SelectTrigger data-testid="event-type-select">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="location" className="mb-1.5 block">Location</Label>
              <Input
                id="location"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="City, Country / Online"
                data-testid="event-location-input"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate" className="mb-1.5 block">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                data-testid="event-start-date-input"
              />
            </div>
            <div>
              <Label htmlFor="endDate" className="mb-1.5 block">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={form.endDate}
                onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                data-testid="event-end-date-input"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="imageUrl" className="mb-1.5 block">Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              value={form.imageUrl}
              onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
              placeholder="https://..."
              data-testid="event-image-input"
            />
          </div>

          <div>
            <Label htmlFor="description" className="mb-1.5 block">Description (HTML) <span className="text-destructive">*</span></Label>
            <Textarea
              id="description"
              required
              rows={10}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="<p>Event description...</p>"
              className="font-mono text-sm"
              data-testid="event-description-input"
            />
          </div>

          {/* Registration form */}
          <div className="border border-border rounded-lg p-4 space-y-4">
            <div>
              <Label className="mb-1.5 block">Registration Form</Label>
              <Select value={form.formType} onValueChange={(v) => setForm((f) => ({ ...f, formType: v as "none" | "google" | "custom" }))}>
                <SelectTrigger data-testid="event-form-type-select">
                  <SelectValue placeholder="Select form type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="google">Google Form (iframe embed)</SelectItem>
                  <SelectItem value="custom">Custom Built-in Form</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {form.formType === "google" && (
              <div>
                <Label htmlFor="googleFormUrl" className="mb-1.5 block">Google Form URL</Label>
                <Input
                  id="googleFormUrl"
                  type="url"
                  value={form.googleFormUrl}
                  onChange={(e) => setForm((f) => ({ ...f, googleFormUrl: e.target.value }))}
                  placeholder="https://docs.google.com/forms/..."
                  data-testid="event-google-form-url-input"
                />
                <p className="text-xs text-muted-foreground mt-1">Paste the embed URL from the Google Form share dialog.</p>
              </div>
            )}

            {form.formType === "custom" && (
              <div>
                <Label htmlFor="customFormFields" className="mb-1.5 block">Custom Form Fields (JSON)</Label>
                <Textarea
                  id="customFormFields"
                  rows={8}
                  value={form.customFormFields}
                  onChange={(e) => setForm((f) => ({ ...f, customFormFields: e.target.value }))}
                  className="font-mono text-xs"
                  data-testid="event-custom-fields-input"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Array of {`{name, label, type, required}`}. Supported types: text, email, tel, textarea.
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-6 pt-2">
            <div className="flex items-center gap-3">
              <Switch
                id="published"
                checked={form.published}
                onCheckedChange={(v) => setForm((f) => ({ ...f, published: v }))}
                data-testid="event-published-switch"
              />
              <Label htmlFor="published">Published</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="featured"
                checked={form.featured}
                onCheckedChange={(v) => setForm((f) => ({ ...f, featured: v }))}
                data-testid="event-featured-switch"
              />
              <Label htmlFor="featured">Featured</Label>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={saving} data-testid="event-save-btn">
              {saving ? "Saving..." : isEdit ? "Update Event" : "Create Event"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/admin/events")} data-testid="event-cancel-btn">
              Cancel
            </Button>
          </div>

          {(createEvent.isError || updateEvent.isError) && (
            <p className="text-sm text-destructive" data-testid="event-form-error">
              {(createEvent.error as Error)?.message ?? (updateEvent.error as Error)?.message ?? "An error occurred."}
            </p>
          )}
        </form>
      </div>
    </AdminLayout>
  );
}
